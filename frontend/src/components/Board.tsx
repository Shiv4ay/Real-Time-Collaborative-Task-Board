'use client';

import { useEffect, useState } from 'react';
import { DragDropContext, DropResult } from '@hello-pangea/dnd';
import { TaskStatus, useTaskStore } from '@/store/taskStore';
import Column from './Column';
import { initSocket, fetchTasks, updateTask } from '@/services/api';

export default function Board() {
    const { tasks, setTasks, moveTask } = useTaskStore();
    const [mounted, setMounted] = useState(false);

    useEffect(() => {
        setMounted(true);
        // Initial fetch
        fetchTasks({ limit: 100 }).then((res) => setTasks(res.data));

        // Initialize socket
        // const socket = initSocket();
        // return () => disconnectSocket(); // Handled in layout or top level usually
    }, [setTasks]);

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

        // API Call
        try {
            await updateTask(draggableId, { status: newStatus });
        } catch (error) {
            console.error('Failed to update task:', error);
            // Rollback logic would go here (fetch tasks again or revert)
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
