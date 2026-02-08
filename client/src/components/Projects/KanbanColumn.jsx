import { Droppable } from '@hello-pangea/dnd';
import { Plus } from 'lucide-react';
import KanbanTask from './KanbanTask';

const KanbanColumn = ({
    colId,
    column,
    tasks,
    isAdding,
    onAddClick,
    onTaskClick,
    newTaskContent,
    setNewTaskContent,
    handleAddTask,
    cancelAdd,
    readOnly
}) => {
    return (
        <div className="flex flex-col w-80 bg-gray-50 dark:bg-gray-800/50 rounded-xl border border-gray-100 dark:border-gray-700/50 h-full max-h-full">
            {/* Column Header */}
            <div className={`p-4 border-b border-gray-100 dark:border-gray-700 font-bold flex justify-between items-center ${colId === 'todo' ? 'text-indigo-600 dark:text-indigo-400' :
                    colId === 'in-progress' ? 'text-orange-600 dark:text-orange-400' :
                        'text-green-600 dark:text-green-400'
                }`}>
                <div className="flex items-center gap-2">
                    <div className={`w-2 h-2 rounded-full ${colId === 'todo' ? 'bg-indigo-500' :
                            colId === 'in-progress' ? 'bg-orange-500' :
                                'bg-green-500'
                        }`} />
                    {column.title}
                    <span className="bg-gray-200 dark:bg-gray-700 text-gray-600 dark:text-gray-300 text-xs px-2 py-0.5 rounded-full ml-1">
                        {column.taskIds.length}
                    </span>
                </div>
                {!readOnly && colId === 'todo' && (
                    <button
                        onClick={onAddClick}
                        className="p-1 hover:bg-gray-200 dark:hover:bg-gray-700 rounded transition-colors"
                        title="Add Task"
                    >
                        <Plus className="h-4 w-4" />
                    </button>
                )}
            </div>

            {/* Task List */}
            <Droppable droppableId={colId}>
                {(provided, snapshot) => (
                    <div
                        {...provided.droppableProps}
                        ref={provided.innerRef}
                        className={`flex-1 overflow-y-auto p-3 space-y-3 transition-colors ${snapshot.isDraggingOver ? 'bg-indigo-50/50 dark:bg-indigo-900/10' : ''
                            }`}
                    >
                        {column.taskIds.map((taskId, index) => {
                            const task = tasks[taskId];
                            if (!task) return null;
                            return (
                                <KanbanTask
                                    key={task.id}
                                    task={task}
                                    index={index}
                                    onClick={() => onTaskClick(task)}
                                    readOnly={readOnly}
                                />
                            );
                        })}
                        {provided.placeholder}

                        {/* Add Task Input */}
                        {isAdding && (
                            <form onSubmit={handleAddTask} className="mt-2">
                                <div className="bg-white dark:bg-gray-800 p-3 rounded-xl border-2 border-indigo-500 shadow-lg">
                                    <textarea
                                        autoFocus
                                        value={newTaskContent}
                                        onChange={(e) => setNewTaskContent(e.target.value)}
                                        placeholder="What needs to be done?"
                                        className="w-full text-sm bg-transparent border-none focus:ring-0 p-0 text-gray-900 dark:text-white placeholder-gray-400 resize-none mb-3"
                                        rows="3"
                                        onKeyDown={(e) => {
                                            if (e.key === 'Enter' && !e.shiftKey) {
                                                e.preventDefault();
                                                handleAddTask(e);
                                            }
                                        }}
                                    />
                                    <div className="flex justify-end gap-2">
                                        <button
                                            type="button"
                                            onClick={cancelAdd}
                                            className="px-3 py-1.5 text-xs font-medium text-gray-600 dark:text-gray-300 hover:bg-gray-100 dark:hover:bg-gray-700 rounded-lg transition-colors"
                                        >
                                            Cancel
                                        </button>
                                        <button
                                            type="submit"
                                            disabled={!newTaskContent.trim()}
                                            className="px-3 py-1.5 text-xs font-medium bg-indigo-600 text-white rounded-lg hover:bg-indigo-700 disabled:opacity-50 transition-colors shadow-lg shadow-indigo-500/20"
                                        >
                                            Add Card
                                        </button>
                                    </div>
                                </div>
                            </form>
                        )}
                    </div>
                )}
            </Droppable>
        </div>
    );
};

export default KanbanColumn;
