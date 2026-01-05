'use client';

import { Task } from '@/store/taskStore';
import { Draggable } from '@hello-pangea/dnd';

interface TaskCardProps {
    task: Task;
    index: number;
}

export default function TaskCard({ task, index }: TaskCardProps) {
    return (
        <Draggable draggableId={task.id} index={index}>
            {(provided) => (
                <div
                    ref={provided.innerRef}
                    {...provided.draggableProps}
                    {...provided.dragHandleProps}
                    className="mb-2 rounded bg-white p-4 shadow-sm hover:shadow-md"
                >
                    <div className="flex justify-between">
                        <h3 className="font-semibold">{task.title}</h3>
                        <span className={`text-xs px-2 py-1 rounded ${task.priority === 'HIGH' ? 'bg-red-100 text-red-800' :
                                task.priority === 'MEDIUM' ? 'bg-yellow-100 text-yellow-800' :
                                    'bg-blue-100 text-blue-800'
                            }`}>
                            {task.priority}
                        </span>
                    </div>
                    <p className="mt-1 text-sm text-gray-600">{task.description}</p>
                </div>
            )}
        </Draggable>
    );
}
