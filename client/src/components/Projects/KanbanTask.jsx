import React from 'react';
import { Draggable } from '@hello-pangea/dnd';
import clsx from 'clsx';
import { MoreHorizontal, Clock, MessageSquare, Paperclip, AlertCircle } from 'lucide-react';

const PRIORITIES = {
    low: { label: 'Low', color: 'bg-green-100 text-green-700', dash: 'bg-green-500' },
    medium: { label: 'Medium', color: 'bg-yellow-100 text-yellow-700', dash: 'bg-yellow-500' },
    high: { label: 'High', color: 'bg-red-100 text-red-700', dash: 'bg-red-500' }
};

const KanbanTask = ({ task, index, onClick }) => {
    const priority = PRIORITIES[task.priority || 'medium'];

    return (
        <Draggable draggableId={task.id} index={index}>
            {(provided, snapshot) => (
                <div
                    ref={provided.innerRef}
                    {...provided.draggableProps}
                    {...provided.dragHandleProps}
                    onClick={() => onClick(task)}
                    className={clsx(
                        "group relative bg-white dark:bg-gray-800 rounded-xl p-4 shadow-sm border border-gray-200 dark:border-gray-700 hover:shadow-md cursor-pointer transition-all duration-200 ease-in-out",
                        snapshot.isDragging && "shadow-2xl ring-2 ring-indigo-500 rotate-2 scale-105 z-50 opacity-90"
                    )}
                    style={{
                        ...provided.draggableProps.style,
                        transform: snapshot.isDragging ? provided.draggableProps.style?.transform : 'translate(0, 0)'
                    }}
                >
                    {/* Priority Indicator Line */}
                    <div className={clsx("absolute left-0 top-4 bottom-4 w-1 rounded-r-full opacity-0 group-hover:opacity-100 transition-opacity", priority.dash)} />

                    {/* Metadata Badges */}
                    <div className="flex items-center gap-2 mb-3">
                        <span className={clsx("px-2 py-0.5 rounded text-[10px] font-bold uppercase tracking-wider", priority.color)}>
                            {priority.label}
                        </span>
                        {task.dueDate && (
                            <span className={clsx(
                                "flex items-center gap-1 px-2 py-0.5 rounded text-[10px] font-bold",
                                new Date(task.dueDate) < new Date() ? "bg-red-50 text-red-600" : "bg-gray-100 text-gray-500"
                            )}>
                                <Clock className="h-3 w-3" />
                                {new Date(task.dueDate).toLocaleDateString(undefined, { month: 'short', day: 'numeric' })}
                            </span>
                        )}
                    </div>

                    {/* Content */}
                    <h4 className="text-sm font-medium text-gray-800 dark:text-gray-200 leading-snug mb-3 pr-2">
                        {task.content}
                    </h4>

                    {/* Footer */}
                    <div className="flex items-center justify-between border-t border-gray-100 dark:border-gray-700 pt-3 mt-2">
                        <div className="flex items-center gap-3 text-gray-400">
                            {/* Assignee Avatar (Mock) */}
                            <div className="flex -space-x-1.5 overflow-hidden">
                                {task.assignedTo ? (
                                    <img src={task.assignedTo.avatar || "https://ui-avatars.com/api/?name=" + task.assignedTo.name} className="inline-block h-6 w-6 rounded-full ring-2 ring-white dark:ring-gray-800" alt="" />
                                ) : (
                                    <div className="h-6 w-6 rounded-full bg-gray-100 dark:bg-gray-700 flex items-center justify-center text-[10px] font-medium text-gray-500 border border-white dark:border-gray-800">
                                        ?
                                    </div>
                                )}
                            </div>
                        </div>

                        <div className="flex items-center gap-3">
                            {task.comments?.length > 0 && (
                                <div className="flex items-center gap-1 text-xs text-gray-400 hover:text-gray-600 dark:hover:text-gray-300">
                                    <MessageSquare className="h-3.5 w-3.5" />
                                    <span>{task.comments.length}</span>
                                </div>
                            )}
                            {task.attachments?.length > 0 && (
                                <div className="flex items-center gap-1 text-xs text-gray-400 hover:text-gray-600 dark:hover:text-gray-300">
                                    <Paperclip className="h-3.5 w-3.5" />
                                    <span>{task.attachments.length}</span>
                                </div>
                            )}
                        </div>
                    </div>
                </div>
            )}
        </Draggable>
    );
};

export default KanbanTask;
