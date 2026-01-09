import { io, Socket } from 'socket.io-client';
import { useTaskStore } from '../store/taskStore';

let socket: Socket | undefined;

export const initSocket = () => {
    if (socket) return socket;

    // DIRECT CONNECTION STRATEGY
    // ... rest of initSocket ...
    // ...
    // ...
    // ...
    // ...
    // ...
    // ...
    const socketUrl = typeof window !== 'undefined'
        ? `http://${window.location.hostname}:4000`
        : 'http://localhost:4000';

    console.log('🔌 Connecting to WebSocket at:', socketUrl);

    const s = io(socketUrl, {
        transports: ['websocket'],
        autoConnect: true,
    });

    socket = s;

    s.on('connect', () => {
        console.log('✅ Connected to WebSocket Server:', s.id);
    });

    s.on('connect_error', (err) => {
        console.error('❌ WebSocket Connection Error:', err.message);
    });

    s.on('disconnect', (reason) => {
        console.warn('⚠️ WebSocket Disconnected:', reason);
    });

    s.on('TASK_CREATED', (task) => {
        useTaskStore.getState().addTask(task);
    });

    s.on('TASK_UPDATED', (task) => {
        useTaskStore.getState().updateTask(task);
    });

    s.on('TASK_DELETED', ({ id }) => {
        useTaskStore.getState().deleteTask(id);
    });

    return s;
};

export const disconnectSocket = () => {
    if (socket) {
        socket.disconnect();
        socket = undefined;
    }
};
