'use client';

import { useEffect, useState } from 'react';
import { useRouter } from 'next/navigation';
import { useAuthStore } from '@/store/authStore';
import Board from '@/components/Board';
import { initSocket, disconnectSocket } from '@/services/socket';
import OfflineSyncManager from '@/components/OfflineSyncManager';
import CreateTaskForm from '@/components/CreateTaskForm';

export default function Home() {
  const user = useAuthStore((state) => state.user);
  const router = useRouter();
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    if (!user) {
      router.push('/login');
    } else {
      setLoading(false);
      initSocket();
    }

    return () => {
      disconnectSocket();
    };
  }, [user, router]);

  if (loading) return <div className="flex h-screen items-center justify-center">Loading...</div>;

  return (
    <main className="flex min-h-screen flex-col bg-gray-50 dark:bg-black transition-colors duration-200">
      <header className="flex items-center justify-between bg-white dark:bg-zinc-900 border-b dark:border-zinc-800 px-8 py-4 shadow-sm text-gray-900 dark:text-gray-100 transition-colors duration-200">
        <h1 className="text-xl font-bold">Task Board</h1>
        <div className="flex items-center gap-4">
          <span>Hello, {user?.email}</span>
          <button
            onClick={() => useAuthStore.getState().logout()}
            className="text-sm text-red-600 hover:text-red-800"
          >
            Logout
          </button>
        </div>
      </header>
      <div className="flex-1 overflow-hidden">
        <Board />
        <OfflineSyncManager />
        <CreateTaskForm />
      </div>
      <footer className="py-4 text-center text-sm text-gray-500 dark:text-gray-400 bg-white dark:bg-zinc-900 border-t dark:border-zinc-800 transition-colors duration-200">
        <p>Designed & Built by <span className="font-semibold text-gray-900 dark:text-gray-200">Siba Sundar Guntha</span></p>
      </footer>
    </main>
  );
}
