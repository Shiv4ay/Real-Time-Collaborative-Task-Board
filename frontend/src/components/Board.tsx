'use client';

import { useEffect, useState } from 'react';
import { DragDropContext, DropResult } from '@hello-pangea/dnd';
import { TaskStatus, useTaskStore } from '@/store/taskStore';
import BoardControls from './BoardControls';
import { TaskPriority } from '@/store/taskStore';
import Column from './Column';
import { fetchTasks, updateTask } from '@/services/api';
import { useQueueStore } from '@/store/queueStore';
import { useOnlineStatus } from '@/hooks/useOnlineStatus';

export default function Board() {
    const { tasks, setTasks, moveTask } = useTaskStore();
    const { addToQueue } = useQueueStore();
    const isOnline = useOnlineStatus();
    const [mounted, setMounted] = useState(false);

    // Filter State
    const [search, setSearch] = useState('');
    const [priority, setPriority] = useState<TaskPriority | 'ALL'>('ALL');
    const [sortBy, setSortBy] = useState<'created_desc' | 'created_asc'>('created_desc');

    useEffect(() => {
        setMounted(true);
        const params: any = { limit: 100 };
        if (search) params.search = search;
        if (priority !== 'ALL') params.priority = priority;
        if (sortBy) params.sort = sortBy;

        console.log('Fetching tasks with params:', params);

        const timeoutId = setTimeout(() => {
            fetchTasks(params)
                .then((res) => {
                    console.log('Fetched tasks:', res.data.length);
                    setTasks(res.data);
                })
                .catch((err) => {
                    console.error('Fetch tasks failed:', err);
                    // Optional: Show a UI error
                });
        }, 300);

        return () => clearTimeout(timeoutId);
    }, [setTasks, search, priority, sortBy]);

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
            console.log('Sending update to backend:', draggableId, newStatus);
            await updateTask(draggableId, { status: newStatus });
            console.log('Backend update successful');
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
        <div className="flex flex-col h-full">
            <BoardControls
                search={search}
                setSearch={setSearch}
                priority={priority}
                setPriority={setPriority}
                sortBy={sortBy}
                setSortBy={setSortBy}
            />
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
        </div>
    );
}
