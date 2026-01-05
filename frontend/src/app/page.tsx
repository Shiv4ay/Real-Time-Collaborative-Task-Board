'use client';

import { useEffect, useState } from 'react';
import { useRouter } from 'next/navigation';
import { useAuthStore } from '@/store/authStore';
import Board from '@/components/Board';
import { initSocket, disconnectSocket } from '@/services/socket';

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
    <main className="flex min-h-screen flex-col bg-gray-50">
      <header className="flex items-center justify-between bg-white px-8 py-4 shadow-sm">
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
      </div>
    </main>
  );
}
