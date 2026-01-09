'use client';

import { useState } from 'react';
import { createTask } from '@/services/api';
import { useAuthStore } from '@/store/authStore';

export default function CreateTaskForm() {
    const [title, setTitle] = useState('');
    const [description, setDescription] = useState('');
    const [priority, setPriority] = useState<'LOW' | 'MEDIUM' | 'HIGH'>('MEDIUM');
    const [isOpen, setIsOpen] = useState(false);

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();
        if (!title) return;

        try {
            await createTask({
                title,
                description,
                priority,
                status: 'TODO'
            });
            setTitle('');
            setDescription('');
            setIsOpen(false);
        } catch (error) {
            console.error('Failed to create task', error);
            alert('Failed to create task');
        }
    };

    if (!isOpen) {
        return (
            <button
                onClick={() => setIsOpen(true)}
                className="fixed bottom-8 right-8 flex h-14 w-14 items-center justify-center rounded-full bg-blue-600 text-3xl text-white shadow-lg hover:bg-blue-700"
            >
                +
            </button>
        );
    }

    return (
        <div className="fixed inset-0 flex items-center justify-center bg-black bg-opacity-50 z-50">
            <div className="w-full max-w-md rounded-lg bg-white dark:bg-zinc-800 p-6 shadow-xl text-gray-900 dark:text-gray-100 border dark:border-zinc-700">
                <h2 className="mb-4 text-xl font-bold">Create New Task</h2>
                <form onSubmit={handleSubmit} className="space-y-4">
                    <div>
                        <label className="block text-sm font-medium text-gray-700 dark:text-gray-300">Title</label>
                        <input
                            type="text"
                            value={title}
                            onChange={(e) => setTitle(e.target.value)}
                            className="mt-1 block w-full rounded-md border border-gray-300 dark:border-zinc-600 p-2 shadow-sm focus:border-blue-500 focus:ring-blue-500 bg-white dark:bg-zinc-900"
                            required
                        />
                    </div>
                    <div>
                        <label className="block text-sm font-medium text-gray-700 dark:text-gray-300">Description</label>
                        <textarea
                            value={description}
                            onChange={(e) => setDescription(e.target.value)}
                            className="mt-1 block w-full rounded-md border border-gray-300 dark:border-zinc-600 p-2 shadow-sm focus:border-blue-500 focus:ring-blue-500 bg-white dark:bg-zinc-900"
                            rows={3}
                        />
                    </div>
                    <div>
                        <label className="block text-sm font-medium text-gray-700 dark:text-gray-300">Priority</label>
                        <select
                            value={priority}
                            onChange={(e) => setPriority(e.target.value as any)}
                            className="mt-1 block w-full rounded-md border border-gray-300 dark:border-zinc-600 p-2 shadow-sm focus:border-blue-500 focus:ring-blue-500 bg-white dark:bg-zinc-900 appearance-auto cursor-pointer"
                        >
                            <option value="LOW">Low</option>
                            <option value="MEDIUM">Medium</option>
                            <option value="HIGH">High</option>
                        </select>
                    </div>
                    <div className="flex justify-end space-x-2 pt-4">
                        <button
                            type="button"
                            onClick={() => setIsOpen(false)}
                            className="rounded-md px-4 py-2 text-gray-600 dark:text-gray-300 hover:bg-gray-100 dark:hover:bg-zinc-700"
                        >
                            Cancel
                        </button>
                        <button
                            type="submit"
                            className="rounded-md bg-blue-600 px-4 py-2 text-white hover:bg-blue-700"
                        >
                            Create
                        </button>
                    </div>
                </form>
            </div>
        </div>
    );
}
