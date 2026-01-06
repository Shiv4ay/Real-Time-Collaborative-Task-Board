'use client';

import { useEffect, useState } from 'react';
import { DragDropContext, DropResult } from '@hello-pangea/dnd';
import { TaskStatus, useTaskStore } from '@/store/taskStore';
import Column from './Column';
import { fetchTasks, updateTask } from '@/services/api';
import { useQueueStore } from '@/store/queueStore';
import { useOnlineStatus } from '@/hooks/useOnlineStatus';

export default function Board() {
    const { tasks, setTasks, moveTask } = useTaskStore();
    const { addToQueue } = useQueueStore(); // Import this
    const isOnline = useOnlineStatus(); // Import this
    const [mounted, setMounted] = useState(false);

    // ... (useEffect remains same)

    const onDragEnd = async (result: DropResult) => {
        const { destination, source, draggableId } = result;

        if (!destination) return;

        if (
            destination.droppableId === source.droppableId &&
            destination.index === source.index
        ) {
            return;
        }

        const newStatus = destination.droppableId as TaskStatus;

        // Optimistic update
        moveTask(draggableId, newStatus);

        if (!isOnline) {
            // Queue the action
            addToQueue({
                id: draggableId,
                type: 'UPDATE',
                payload: { status: newStatus },
                timestamp: Date.now(),
            });
            return;
        }

        // API Call
        try {
            await updateTask(draggableId, { status: newStatus });
        } catch (error) {
            console.error('Failed to update task:', error);
            // Rollback
            fetchTasks({ limit: 100 }).then(res => setTasks(res.data));
        }
    };

    if (!mounted) return null; // Avoid hydration mismatch

    const columns: { id: TaskStatus; title: string }[] = [
        { id: 'TODO', title: 'To Do' },
        { id: 'IN_PROGRESS', title: 'In Progress' },
        { id: 'DONE', title: 'Done' },
    ];

    return (
        <DragDropContext onDragEnd={onDragEnd}>
            <div className="flex h-full gap-6 overflow-x-auto p-8">
                {columns.map((col) => (
                    <Column
                        key={col.id}
                        title={col.title}
                        status={col.id}
                        tasks={tasks.filter((t) => t.status === col.id)}
                    />
                ))}
            </div>
        </DragDropContext>
    );
}
