import { io, Socket } from 'socket.io-client';
import { useTaskStore } from '../store/taskStore';

let socket: Socket;

export const initSocket = () => {
    if (socket) return socket;

    // DIRECT CONNECTION STRATEGY
    // We bypass the Next.js proxy for WebSockets because it adds unnecessary complexity/failure points.
    // We connect directly to Port 4000 on the same host (localhost or IP).
    const socketUrl = typeof window !== 'undefined'
        ? `http://${window.location.hostname}:4000`
        : 'http://localhost:4000';

    console.log('🔌 Connecting to WebSocket at:', socketUrl);

    socket = io(socketUrl, {
        transports: ['websocket'], // Force WebSocket (skip polling) for best performance
        autoConnect: true,
    });

    socket.on('connect', () => {
        console.log('✅ Connected to WebSocket Server:', socket.id);
    });

    socket.on('connect_error', (err) => {
        console.error('❌ WebSocket Connection Error:', err.message);
    });

    socket.on('disconnect', (reason) => {
        console.warn('⚠️ WebSocket Disconnected:', reason);
    });

    socket.on('TASK_CREATED', (task) => {
        useTaskStore.getState().addTask(task);
    });

    socket.on('TASK_UPDATED', (task) => {
        useTaskStore.getState().updateTask(task);
    });

    socket.on('TASK_DELETED', ({ id }) => {
        useTaskStore.getState().deleteTask(id);
    });

    return socket;
};

export const disconnectSocket = () => {
    if (socket) socket.disconnect();
};
