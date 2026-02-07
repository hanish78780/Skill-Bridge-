import React from 'react';
import { Droppable } from '@hello-pangea/dnd';
import clsx from 'clsx';
import { Plus, MoreHorizontal, Inbox, CircleDashed, CheckCircle2 } from 'lucide-react';
import KanbanTask from './KanbanTask';

const COLUMN_CONFIG = {
    'todo': { label: 'To Do', color: 'gray', icon: Inbox, badge: 'bg-gray-100 text-gray-600 dark:bg-gray-800 dark:text-gray-300' },
    'in-progress': { label: 'In Progress', color: 'blue', icon: CircleDashed, badge: 'bg-blue-100 text-blue-600 dark:bg-blue-900/30 dark:text-blue-300' },
    'done': { label: 'Done', color: 'green', icon: CheckCircle2, badge: 'bg-green-100 text-green-600 dark:bg-green-900/30 dark:text-green-300' }
};

const KanbanColumn = ({ colId, column, tasks, isAdding, onAddClick, onTaskClick, newTaskContent, setNewTaskContent, handleAddTask, cancelAdd, provided }) => {
    const config = COLUMN_CONFIG[colId] || COLUMN_CONFIG['todo'];
    const Icon = config.icon;

    return (
        <div className="flex-1 min-w-[320px] bg-gray-50/50 dark:bg-gray-800/20 rounded-2xl flex flex-col h-full border border-gray-200/50 dark:border-gray-700/50">
            {/* Header */}
            <div className="p-4 flex items-center justify-between group">
                <div className="flex items-center gap-3">
                    <h3 className="font-bold text-gray-700 dark:text-gray-200 text-sm flex items-center gap-2">
                        <Icon className={clsx("h-4 w-4", `text-${config.color}-500`)} />
                        {column.title}
                    </h3>
                    <span className={clsx("text-xs font-bold px-2 py-0.5 rounded-full min-w-[24px] text-center", config.badge)}>
                        {column.taskIds.length}
                    </span>
                </div>
                <div className="flex gap-1 opacity-0 group-hover:opacity-100 transition-opacity">
                    <button onClick={onAddClick} className="p-1 hover:bg-white dark:hover:bg-gray-700 rounded text-gray-400 hover:text-gray-600">
                        <Plus className="h-4 w-4" />
                    </button>
                    <button className="p-1 hover:bg-white dark:hover:bg-gray-700 rounded text-gray-400 hover:text-gray-600">
                        <MoreHorizontal className="h-4 w-4" />
                    </button>
                </div>
            </div>

            {/* Tasks Area */}
            <Droppable droppableId={column.id}>
                {(provided, snapshot) => (
                    <div
                        {...provided.droppableProps}
                        ref={provided.innerRef}
                        className={clsx(
                            "flex-1 p-3 transition-colors rounded-b-2xl overflow-y-auto scrollbar-thin scrollbar-thumb-gray-200 dark:scrollbar-thumb-gray-700",
                            snapshot.isDraggingOver ? "bg-indigo-50/30 dark:bg-indigo-900/10 ring-2 ring-indigo-500/20 ring-inset" : ""
                        )}
                    >
                        <div className="space-y-3 min-h-[100px]">
                            {column.taskIds.map((taskId, index) => {
                                const task = tasks[taskId];
                                if (!task) return null;
                                return (
                                    <KanbanTask
                                        key={task.id}
                                        task={task}
                                        index={index}
                                        onClick={onTaskClick}
                                    />
                                );
                            })}

                            {provided.placeholder}

                            {/* Empty State */}
                            {!isAdding && column.taskIds.length === 0 && (
                                <div className="h-32 border-2 border-dashed border-gray-200 dark:border-gray-700 rounded-xl flex flex-col items-center justify-center text-gray-400 gap-2 mb-2">
                                    <div className="p-2 bg-white dark:bg-gray-800 rounded-full shadow-sm">
                                        <Plus className="h-5 w-5 opacity-50" />
                                    </div>
                                    <span className="text-xs font-medium">No tasks yet</span>
                                    <button onClick={onAddClick} className="text-xs text-indigo-600 hover:underline">Add one</button>
                                </div>
                            )}

                            {/* Add Task Form (Inline) */}
                            {isAdding && colId === 'todo' && (
                                <div className="mt-2">
                                    <form onSubmit={handleAddTask} className="bg-white dark:bg-gray-800 p-4 rounded-xl border-2 border-indigo-500 shadow-lg animate-in fade-in slide-in-from-bottom-2 duration-200">
                                        <textarea
                                            autoFocus
                                            placeholder="What needs to be done?"
                                            className="w-full text-sm resize-none outline-none bg-transparent text-gray-900 dark:text-white placeholder-gray-400 mb-3"
                                            rows="3"
                                            value={newTaskContent}
                                            onChange={(e) => setNewTaskContent(e.target.value)}
                                            onKeyDown={(e) => {
                                                if (e.key === 'Enter' && !e.shiftKey) {
                                                    e.preventDefault();
                                                    handleAddTask(e);
                                                }
                                                if (e.key === 'Escape') cancelAdd();
                                            }}
                                        />
                                        <div className="flex justify-between items-center">
                                            <div className="flex gap-2 text-gray-400">
                                                {/* Placeholder for priority/tags selector in simpler form */}
                                            </div>
                                            <div className="flex gap-2">
                                                <button type="button" onClick={cancelAdd} className="px-3 py-1.5 text-xs font-medium text-gray-500 hover:bg-gray-100 dark:hover:bg-gray-700 rounded-lg transition-colors">Cancel</button>
                                                <button type="submit" className="px-3 py-1.5 text-xs font-bold bg-indigo-600 text-white rounded-lg hover:bg-indigo-700 shadow-sm shadow-indigo-200 dark:shadow-none transition-all">Add Task</button>
                                            </div>
                                        </div>
                                    </form>
                                </div>
                            )}
                        </div>
                    </div>
                )}
            </Droppable>
        </div>
    );
};

export default KanbanColumn;
