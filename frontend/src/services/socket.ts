import { io, Socket } from 'socket.io-client';
import { useTaskStore } from '../store/taskStore';

let socket: Socket;

export const initSocket = () => {
    if (socket) return socket;

    const WS_URL = process.env.NEXT_PUBLIC_WS_URL || 'http://localhost:4000';

    socket = io(WS_URL, {
        transports: ['websocket'],
        autoConnect: true,
    });

    socket.on('connect', () => {
        console.log('Connected to WebSocket');
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
