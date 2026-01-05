'use client';

import { Task, TaskStatus } from '@/store/taskStore';
import { Droppable } from '@hello-pangea/dnd';
import TaskCard from './TaskCard';

interface ColumnProps {
    title: string;
    status: TaskStatus;
    tasks: Task[];
}

export default function Column({ title, status, tasks }: ColumnProps) {
    return (
        <div className="flex w-80 flex-col rounded-lg bg-gray-100 p-4">
            <h2 className="mb-4 text-lg font-bold">{title}</h2>
            <Droppable droppableId={status}>
                {(provided) => (
                    <div
                        ref={provided.innerRef}
                        {...provided.droppableProps}
                        className="flex-1 space-y-2"
                    >
                        {tasks.map((task, index) => (
                            <TaskCard key={task.id} task={task} index={index} />
                        ))}
                        {provided.placeholder}
                    </div>
                )}
            </Droppable>
        </div>
    );
}
