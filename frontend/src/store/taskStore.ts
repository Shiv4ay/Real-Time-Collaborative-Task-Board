import { create } from 'zustand';
import { Socket } from 'socket.io-client';

export type TaskStatus = 'TODO' | 'IN_PROGRESS' | 'DONE';
export type TaskPriority = 'LOW' | 'MEDIUM' | 'HIGH';

export interface Task {
    id: string;
    title: string;
    description?: string;
    status: TaskStatus;
    priority: TaskPriority;
    createdAt: string;
}

interface TaskState {
    tasks: Task[];
    setTasks: (tasks: Task[]) => void;
    addTask: (task: Task) => void;
    updateTask: (task: Task) => void;
    deleteTask: (taskId: string) => void;
    moveTask: (taskId: string, newStatus: TaskStatus) => void;
}

export const useTaskStore = create<TaskState>((set) => ({
    tasks: [],
    setTasks: (tasks) => set({ tasks }),
    addTask: (task) => set((state) => {
        if (state.tasks.find(t => t.id === task.id)) return state;
        return { tasks: [task, ...state.tasks] };
    }),
    updateTask: (updatedTask) => set((state) => ({
        tasks: state.tasks.map((t) => (t.id === updatedTask.id ? updatedTask : t)),
    })),
    deleteTask: (taskId) => set((state) => ({
        tasks: state.tasks.filter((t) => t.id !== taskId),
    })),
    moveTask: (taskId, newStatus) => set((state) => ({
        tasks: state.tasks.map((t) =>
            t.id === taskId ? { ...t, status: newStatus } : t
        ),
    })),
}));
