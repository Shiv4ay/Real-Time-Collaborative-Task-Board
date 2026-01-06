'use client';

import { useEffect } from 'react';
import { useOnlineStatus } from '../hooks/useOnlineStatus';
import { useQueueStore } from '../store/queueStore';
import { createTask, updateTask, deleteTask } from '../services/api';

export default function OfflineSyncManager() {
    const isOnline = useOnlineStatus();
    const { queue, removeFromQueue, clearQueue } = useQueueStore();

    useEffect(() => {
        const processQueue = async () => {
            if (isOnline && queue.length > 0) {
                console.log('Online! Processing offline queue...', queue.length);

                // Process sequentially to maintain order
                for (const action of queue) {
                    try {
                        switch (action.type) {
                            case 'CREATE':
                                await createTask(action.payload);
                                break;
                            case 'UPDATE':
                                await updateTask(action.id, action.payload);
                                break;
                            case 'DELETE':
                                await deleteTask(action.id);
                                break;
                        }
                        removeFromQueue(action.id);
                    } catch (error) {
                        console.error(`Failed to sync action ${action.id}:`, error);
                        // If it fails permanently (e.g. 400), maybe remove it?
                        // For 500 or network, keep it? 
                        // For simplicity in this demo, we'll keep retrying or manual intervention.
                    }
                }
            }
        };

        processQueue();
    }, [isOnline, queue, removeFromQueue]);

    if (!isOnline) {
        return (
            <div className="fixed bottom-4 right-4 rounded-md bg-yellow-100 p-4 text-yellow-800 shadow-lg border border-yellow-300 z-50">
                <p className="font-bold">You are offline</p>
                <p className="text-sm">Changes will sync when connection updates.</p>
            </div>
        );
    }

    return null;
}
