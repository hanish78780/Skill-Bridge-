
import { useState, useEffect } from 'react';
import { DragDropContext, Droppable, Draggable } from '@hello-pangea/dnd';
import axios from 'axios';
import { Plus, MoreHorizontal } from 'lucide-react';
import { v4 as uuidv4 } from 'uuid';
import clsx from 'clsx';

const initialColumns = {
    todo: {
        id: 'todo',
        title: 'To Do',
        taskIds: [],
    },
    'in-progress': {
        id: 'in-progress',
        title: 'In Progress',
        taskIds: [],
    },
    done: {
        id: 'done',
        title: 'Done',
        taskIds: [],
    },
};

const KanbanBoard = ({ projectId, tasks: initialTasks = [], onTaskUpdate }) => {
    const [tasks, setTasks] = useState({});
    const [columns, setColumns] = useState(initialColumns);
    const [isAdding, setIsAdding] = useState(false);
    const [newTaskContent, setNewTaskContent] = useState('');

    useEffect(() => {
        // Initialize board from props
        const taskMap = {};
        const colMap = JSON.parse(JSON.stringify(initialColumns)); // Deep copy

        initialTasks.forEach(task => {
            taskMap[task.id] = task;
            if (colMap[task.status]) {
                colMap[task.status].taskIds.push(task.id);
            }
        });

        setTasks(taskMap);
        setColumns(colMap);
    }, [initialTasks]);

    const onDragEnd = async (result) => {
        const { destination, source, draggableId } = result;

        if (!destination) return;
        if (
            destination.droppableId === source.droppableId &&
            destination.index === source.index
        ) return;

        const start = columns[source.droppableId];
        const finish = columns[destination.droppableId];

        // Moving within same column
        if (start === finish) {
            const newTaskIds = Array.from(start.taskIds);
            newTaskIds.splice(source.index, 1);
            newTaskIds.splice(destination.index, 0, draggableId);

            const newColumn = {
                ...start,
                taskIds: newTaskIds,
            };

            setColumns({
                ...columns,
                [newColumn.id]: newColumn,
            });
            return;
        }

        // Moving from one column to another
        const startTaskIds = Array.from(start.taskIds);
        startTaskIds.splice(source.index, 1);
        const newStart = {
            ...start,
            taskIds: startTaskIds,
        };

        const finishTaskIds = Array.from(finish.taskIds);
        finishTaskIds.splice(destination.index, 0, draggableId);
        const newFinish = {
            ...finish,
            taskIds: finishTaskIds,
        };

        setColumns({
            ...columns,
            [newStart.id]: newStart,
            [newFinish.id]: newFinish,
        });

        // Optimistic UI update done, now sync with backend
        try {
            if (projectId) {
                await axios.put(`/projects/${projectId}/tasks/${draggableId}`, {
                    status: destination.droppableId
                });
                if (onTaskUpdate) onTaskUpdate();
            }
        } catch (error) {
            console.error('Failed to update task status:', error);
            // Revert state on error (optional implementation)
        }
    };

    const handleAddTask = async (e) => {
        e.preventDefault();
        if (!newTaskContent.trim()) return;
        if (!projectId) return; // Guard against missing project context

        const tempId = uuidv4();
        const newTask = {
            id: tempId,
            content: newTaskContent,
            status: 'todo',
        };

        // Optimistic update
        setTasks(prev => ({ ...prev, [tempId]: newTask }));
        setColumns(prev => ({
            ...prev,
            todo: {
                ...prev.todo,
                taskIds: [...prev.todo.taskIds, tempId]
            }
        }));

        setIsAdding(false);
        setNewTaskContent('');

        try {
            await axios.post(`/projects/${projectId}/tasks`, {
                id: tempId,
                content: newTaskContent
            });
            if (onTaskUpdate) onTaskUpdate();
        } catch (error) {
            console.error('Failed to add task:', error);
        }
    };

    return (
        <div className="h-full overflow-x-auto pb-4">
            <DragDropContext onDragEnd={onDragEnd}>
                <div className="flex gap-6 h-full min-w-[800px]">
                    {['todo', 'in-progress', 'done'].map((colId) => {
                        const column = columns[colId];
                        return (
                            <div key={column.id} className="flex-1 min-w-[280px] bg-gray-50 dark:bg-gray-800/50 rounded-xl p-4 flex flex-col h-full border border-gray-100 dark:border-gray-800">
                                <h3 className={clsx(
                                    "font-semibold mb-4 flex items-center gap-2 text-sm uppercase tracking-wider",
                                    colId === 'todo' && "text-gray-500",
                                    colId === 'in-progress' && "text-blue-500",
                                    colId === 'done' && "text-green-500"
                                )}>
                                    <div className={clsx("w-2 h-2 rounded-full",
                                        colId === 'todo' ? "bg-gray-400" :
                                            colId === 'in-progress' ? "bg-blue-400" : "bg-green-400"
                                    )} />
                                    {column.title}
                                    <span className="ml-auto bg-white dark:bg-gray-700 text-gray-400 text-xs px-2 py-0.5 rounded-full">
                                        {column.taskIds.length}
                                    </span>
                                </h3>

                                <Droppable droppableId={column.id}>
                                    {(provided, snapshot) => (
                                        <div
                                            {...provided.droppableProps}
                                            ref={provided.innerRef}
                                            className={clsx(
                                                "flex-1 transition-colors rounded-lg",
                                                snapshot.isDraggingOver ? "bg-indigo-50/50 dark:bg-indigo-900/20" : ""
                                            )}
                                        >
                                            <div className="space-y-3">
                                                {column.taskIds.map((taskId, index) => {
                                                    const task = tasks[taskId];
                                                    if (!task) return null;
                                                    return (
                                                        <Draggable key={task.id} draggableId={task.id} index={index}>
                                                            {(provided, snapshot) => (
                                                                <div
                                                                    ref={provided.innerRef}
                                                                    {...provided.draggableProps}
                                                                    {...provided.dragHandleProps}
                                                                    className={clsx(
                                                                        "bg-white dark:bg-gray-800 p-4 rounded-lg shadow-sm border border-gray-100 dark:border-gray-700 group hover:shadow-md transition-shadow",
                                                                        snapshot.isDragging && "shadow-xl ring-2 ring-indigo-500 rotate-1"
                                                                    )}
                                                                >
                                                                    <p className="text-sm text-gray-800 dark:text-gray-200">{task.content}</p>
                                                                    <div className="mt-3 flex items-center justify-between">
                                                                        <div className="flex -space-x-2">
                                                                            {/* Placeholder for assignee avatar */}
                                                                            <div className="w-6 h-6 rounded-full bg-indigo-100 flex items-center justify-center text-xs text-indigo-600 border-2 border-white dark:border-gray-800">
                                                                                U
                                                                            </div>
                                                                        </div>
                                                                        <button className="text-gray-300 hover:text-gray-500 opacity-0 group-hover:opacity-100 transition-opacity">
                                                                            <MoreHorizontal className="h-4 w-4" />
                                                                        </button>
                                                                    </div>
                                                                </div>
                                                            )}
                                                        </Draggable>
                                                    );
                                                })}
                                            </div>
                                            {provided.placeholder}

                                            {colId === 'todo' && (
                                                <div className="mt-3">
                                                    {isAdding ? (
                                                        <form onSubmit={handleAddTask} className="bg-white dark:bg-gray-800 p-3 rounded-lg border border-indigo-200 dark:border-indigo-800 shadow-sm">
                                                            <textarea
                                                                autoFocus
                                                                placeholder="What needs to be done?"
                                                                className="w-full text-sm resize-none outline-none bg-transparent dark:text-white"
                                                                rows="2"
                                                                value={newTaskContent}
                                                                onChange={(e) => setNewTaskContent(e.target.value)}
                                                                onKeyDown={(e) => {
                                                                    if (e.key === 'Enter' && !e.shiftKey) {
                                                                        e.preventDefault();
                                                                        handleAddTask(e);
                                                                    }
                                                                    if (e.key === 'Escape') setIsAdding(false);
                                                                }}
                                                            />
                                                            <div className="flex justify-end gap-2 mt-2">
                                                                <button type="button" onClick={() => setIsAdding(false)} className="text-xs text-gray-500 hover:text-gray-700">Cancel</button>
                                                                <button type="submit" className="text-xs bg-indigo-600 text-white px-2 py-1 rounded hover:bg-indigo-700">Add</button>
                                                            </div>
                                                        </form>
                                                    ) : (
                                                        <button
                                                            onClick={() => setIsAdding(true)}
                                                            className="flex items-center gap-2 text-sm text-gray-500 hover:text-indigo-600 w-full py-2 px-1 transition-colors"
                                                        >
                                                            <Plus className="h-4 w-4" /> Add Task
                                                        </button>
                                                    )}
                                                </div>
                                            )}
                                        </div>
                                    )}
                                </Droppable>
                            </div>
                        );
                    })}
                </div>
            </DragDropContext>
        </div>
    );
};

export default KanbanBoard;
