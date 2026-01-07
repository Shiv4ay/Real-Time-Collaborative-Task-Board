'use client';

import { TaskPriority } from '@/store/taskStore';

interface BoardControlsProps {
    search: string;
    setSearch: (value: string) => void;
    priority: TaskPriority | 'ALL';
    setPriority: (value: TaskPriority | 'ALL') => void;
    sortBy: 'created_desc' | 'created_asc';
    setSortBy: (value: 'created_desc' | 'created_asc') => void;
}

export default function BoardControls({
    search,
    setSearch,
    priority,
    setPriority,
    sortBy,
    setSortBy,
}: BoardControlsProps) {
    return (
        <div className="flex flex-wrap gap-4 p-8 pb-0 items-center">
            <div className="flex-1 min-w-[200px]">
                <input
                    type="text"
                    placeholder="Search tasks..."
                    value={search}
                    onChange={(e) => setSearch(e.target.value)}
                    className="w-full rounded-md border border-gray-300 dark:border-zinc-700 p-2 shadow-sm focus:border-blue-500 focus:ring-blue-500 text-gray-900 dark:text-gray-100 bg-white dark:bg-zinc-800"
                />
            </div>

            <div className="flex gap-4">
                <select
                    value={priority}
                    onChange={(e) => setPriority(e.target.value as any)}
                    className="rounded-md border border-gray-300 dark:border-zinc-700 p-2 shadow-sm focus:border-blue-500 focus:ring-blue-500 text-gray-900 dark:text-gray-100 bg-white dark:bg-zinc-800"
                >
                    <option value="ALL">All Priorities</option>
                    <option value="LOW">Low</option>
                    <option value="MEDIUM">Medium</option>
                    <option value="HIGH">High</option>
                </select>

                <select
                    value={sortBy}
                    onChange={(e) => setSortBy(e.target.value as any)}
                    className="rounded-md border border-gray-300 dark:border-zinc-700 p-2 shadow-sm focus:border-blue-500 focus:ring-blue-500 text-gray-900 dark:text-gray-100 bg-white dark:bg-zinc-800"
                >
                    <option value="created_desc">Newest First</option>
                    <option value="created_asc">Oldest First</option>
                </select>

                <button
                    onClick={() => document.documentElement.classList.toggle('dark')}
                    className="rounded-md border border-gray-300 dark:border-zinc-700 p-2 shadow-sm hover:bg-gray-100 dark:hover:bg-zinc-700 text-gray-900 dark:text-gray-100 bg-white dark:bg-zinc-800"
                    title="Toggle Dark Mode"
                >
                    🌙
                </button>
            </div>
        </div>
    );
}
