import { create } from 'zustand';
import { persist } from 'zustand/middleware';

export interface QueuedAction {
    id: string; // Unique ID for the action
    type: 'CREATE' | 'UPDATE' | 'DELETE';
    payload: any;
    timestamp: number;
}

interface QueueState {
    queue: QueuedAction[];
    addToQueue: (action: QueuedAction) => void;
    removeFromQueue: (id: string) => void;
    clearQueue: () => void;
}

export const useQueueStore = create<QueueState>()(
    persist(
        (set) => ({
            queue: [],
            addToQueue: (action) => set((state) => ({ queue: [...state.queue, action] })),
            removeFromQueue: (id) => set((state) => ({ queue: state.queue.filter((a) => a.id !== id) })),
            clearQueue: () => set({ queue: [] }),
        }),
        {
            name: 'offline-queue-storage',
        }
    )
);
