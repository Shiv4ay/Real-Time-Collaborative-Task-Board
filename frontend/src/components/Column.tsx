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
        <div className="flex w-80 flex-col rounded-lg bg-gray-100 dark:bg-zinc-900/50 p-4 text-gray-900 dark:text-gray-200 border dark:border-zinc-800 transition-colors duration-200">
            <h2 className="mb-4 text-lg font-bold">{title}</h2>
            <Droppable droppableId={status}>
                {(provided) => (
                    <div
                        ref={provided.innerRef}
                        {...provided.droppableProps}
                        className="flex-1 space-y-2 min-h-[150px]"
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
