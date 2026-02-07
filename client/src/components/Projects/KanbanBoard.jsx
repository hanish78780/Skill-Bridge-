import { useState, useEffect } from 'react';
import { DragDropContext } from '@hello-pangea/dnd';
import axios from 'axios';
import { v4 as uuidv4 } from 'uuid';
import KanbanColumn from './KanbanColumn';
import TaskDetailModal from './TaskDetailModal';
import { useToast } from '../../context/ToastContext';

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
    const { success, error: toastError } = useToast();
    const [tasks, setTasks] = useState({});
    const [columns, setColumns] = useState(initialColumns);
    const [isAdding, setIsAdding] = useState(false);
    const [newTaskContent, setNewTaskContent] = useState('');
    const [selectedTask, setSelectedTask] = useState(null);

    useEffect(() => {
        const taskMap = {};
        const colMap = JSON.parse(JSON.stringify(initialColumns));

        initialTasks.forEach(task => {
            taskMap[task.id] = task;
            if (task.status && colMap[task.status]) {
                colMap[task.status].taskIds.push(task.id);
            } else {
                colMap['todo'].taskIds.push(task.id);
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

        if (start === finish) {
            const newTaskIds = Array.from(start.taskIds);
            newTaskIds.splice(source.index, 1);
            newTaskIds.splice(destination.index, 0, draggableId);

            const newColumn = { ...start, taskIds: newTaskIds };

            setColumns({
                ...columns,
                [newColumn.id]: newColumn,
            });
            return;
        }

        const startTaskIds = Array.from(start.taskIds);
        startTaskIds.splice(source.index, 1);
        const newStart = { ...start, taskIds: startTaskIds };

        const finishTaskIds = Array.from(finish.taskIds);
        finishTaskIds.splice(destination.index, 0, draggableId);
        const newFinish = { ...finish, taskIds: finishTaskIds };

        setColumns({
            ...columns,
            [newStart.id]: newStart,
            [newFinish.id]: newFinish,
        });

        // Update local task state immediately for smoothness
        setTasks(prev => ({
            ...prev,
            [draggableId]: { ...prev[draggableId], status: destination.droppableId }
        }));

        try {
            if (projectId) {
                await axios.put(`/projects/${projectId}/tasks/${draggableId}`, {
                    status: destination.droppableId
                });
                if (onTaskUpdate) onTaskUpdate();
            }
        } catch (error) {
            console.error('Failed to update task status:', error);
            toastError("Failed to save move");
        }
    };

    const handleAddTask = async (e) => {
        e.preventDefault();
        if (!newTaskContent.trim()) return;
        if (!projectId) return;

        const tempId = uuidv4();
        const newTask = {
            id: tempId,
            content: newTaskContent,
            status: 'todo',
            priority: 'medium',
            comments: [],
            attachments: []
        };

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
            await axios.post(`/projects/${projectId}/tasks`, newTask);
            if (onTaskUpdate) onTaskUpdate();
            success("Task added");
        } catch (error) {
            console.error('Failed to add task:', error);
            toastError("Failed to add task");
        }
    };

    const handleTaskUpdate = async (updatedTask) => {
        // Optimistic Update
        setTasks(prev => ({ ...prev, [updatedTask.id]: updatedTask }));

        try {
            // In a real app we'd have a specific PUT endpoint for full task details
            // For now we assume the generic PUT works or we construct the right call
            await axios.put(`/projects/${projectId}/tasks/${updatedTask.id}`, updatedTask);
            if (onTaskUpdate) onTaskUpdate();
            success('Task updated');
        } catch (error) {
            toastError('Failed to update task');
        }
    };

    const handleDeleteTask = async () => {
        if (!selectedTask) return;
        if (!window.confirm("Delete this task?")) return;

        try {
            await axios.delete(`/projects/${projectId}/tasks/${selectedTask.id}`);

            // Remove from local state
            const col = columns[selectedTask.status];
            const newTaskIds = col.taskIds.filter(id => id !== selectedTask.id);

            setColumns(prev => ({
                ...prev,
                [selectedTask.status]: { ...prev[selectedTask.status], taskIds: newTaskIds }
            }));

            const newTasks = { ...tasks };
            delete newTasks[selectedTask.id];
            setTasks(newTasks);

            setSelectedTask(null);
            if (onTaskUpdate) onTaskUpdate();
            success("Task deleted");
        } catch (err) {
            toastError("Failed to delete task");
        }
    };

    return (
        <div className="h-full flex flex-col">
            <TaskDetailModal
                isOpen={!!selectedTask}
                onClose={() => setSelectedTask(null)}
                task={selectedTask}
                projectId={projectId}
                onUpdate={handleTaskUpdate}
                onDelete={handleDeleteTask}
            />

            <DragDropContext onDragEnd={onDragEnd}>
                <div className="flex-1 overflow-x-auto overflow-y-hidden">
                    <div className="flex h-full gap-6 pb-2 min-w-[900px]">
                        {['todo', 'in-progress', 'done'].map((colId) => (
                            <KanbanColumn
                                key={colId}
                                colId={colId}
                                column={columns[colId]}
                                tasks={tasks}
                                isAdding={isAdding && colId === 'todo'}
                                onAddClick={() => setIsAdding(true)}
                                onTaskClick={setSelectedTask}
                                newTaskContent={newTaskContent}
                                setNewTaskContent={setNewTaskContent}
                                handleAddTask={handleAddTask}
                                cancelAdd={() => setIsAdding(false)}
                            />
                        ))}
                    </div>
                </div>
            </DragDropContext>
        </div>
    );
};

export default KanbanBoard;
