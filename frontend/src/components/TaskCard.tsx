'use client';

import { deleteTask } from '@/services/api';
import { useTaskStore, Task } from '@/store/taskStore';
import { Draggable } from '@hello-pangea/dnd';

interface TaskCardProps {
    task: Task;
    index: number;
}

export default function TaskCard({ task, index }: TaskCardProps) {
    const { deleteTask: deleteTaskStore } = useTaskStore();

    const handleDelete = async () => {
        if (confirm('Are you sure you want to delete this task?')) {
            try {
                // Optimistic update
                deleteTaskStore(task.id);
                await deleteTask(task.id);
            } catch (error) {
                console.error("Failed to delete", error);
                // In a perfect world we would revert here, 
                // but for now relying on fetchTasks or socket error handling
            }
        }
    };

    return (
        <Draggable draggableId={task.id} index={index}>
            {(provided) => (
                <div
                    ref={provided.innerRef}
                    {...provided.draggableProps}
                    {...provided.dragHandleProps}
                    className="mb-2 rounded bg-white dark:bg-zinc-800 p-4 shadow-sm hover:shadow-md text-gray-900 dark:text-gray-100 group relative border dark:border-zinc-700"
                >
                    <div className="flex justify-between items-start mb-2">
                        <h3 className="font-semibold text-gray-900 dark:text-gray-100">{task.title}</h3>
                        <span className={`text-xs px-2 py-1 rounded-full font-medium ${task.priority === 'HIGH' ? 'bg-red-100 text-red-800 dark:bg-red-900/30 dark:text-red-300' :
                            task.priority === 'MEDIUM' ? 'bg-yellow-100 text-yellow-800 dark:bg-yellow-900/30 dark:text-yellow-300' :
                                'bg-blue-100 text-blue-800 dark:bg-blue-900/30 dark:text-blue-300'
                            }`}>
                            {task.priority}
                        </span>
                    </div>
                    <p className="text-sm text-gray-600 dark:text-gray-400 mb-6">{task.description}</p>

                    <button
                        onClick={handleDelete}
                        className="absolute bottom-2 right-2 p-1.5 rounded-full hover:bg-gray-100 dark:hover:bg-zinc-700 text-gray-400 hover:text-red-500 transition-colors opacity-0 group-hover:opacity-100"
                        title="Delete Task"
                    >
                        <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={1.5} stroke="currentColor" className="w-4 h-4">
                            <path strokeLinecap="round" strokeLinejoin="round" d="m14.74 9-.346 9m-4.788 0L9.26 9m9.968-3.21c.342.052.682.107 1.022.166m-1.022-.165L18.16 19.673a2.25 2.25 0 0 1-2.244 2.077H8.084a2.25 2.25 0 0 1-2.244-2.077L4.772 5.79m14.456 0a48.108 48.108 0 0 0-3.478-.397m-12 .562c.34-.059.68-.114 1.022-.165m0 0a48.11 48.11 0 0 1 3.478-.397m7.5 0v-.916c0-1.18-.91-2.164-2.09-2.201a51.964 51.964 0 0 0-3.32 0c-1.18.037-2.09 1.022-2.09 2.201v.916m7.5 0a48.667 48.667 0 0 0-7.5 0" />
                        </svg>
                    </button>

                </div>
            )}
        </Draggable>
    );
}
