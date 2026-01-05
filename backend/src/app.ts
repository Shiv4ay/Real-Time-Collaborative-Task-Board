import fastify from 'fastify';
import cors from '@fastify/cors';
import customJwt from '@fastify/jwt';
import websocket from '@fastify/websocket';
import { Server } from 'socket.io';
import dotenv from 'dotenv';
import { authRoutes } from './modules/auth/auth.routes';
import { taskRoutes } from './modules/tasks/task.routes';
import { prisma } from './plugins/prisma';
import { redis } from './plugins/redis';

dotenv.config();

const app = fastify({ logger: true });

// Register Plugins
app.register(cors, {
    origin: process.env.CORS_ORIGIN || '*',
});

app.register(customJwt, {
    secret: process.env.JWT_SECRET || 'supersecret',
});

app.decorate('authenticate', async (request: any, reply: any) => {
    try {
        await request.jwtVerify();
    } catch (err) {
        reply.send(err);
    }
});

// Setup Socket.io
const io = new Server(app.server, {
    cors: {
        origin: process.env.CORS_ORIGIN || '*',
        methods: ['GET', 'POST', 'PUT', 'DELETE'],
    },
});

// Make io accessible in requests
app.decorate('io', io);

// Register Routes
app.register(authRoutes, { prefix: '/auth' });
app.register(taskRoutes, { prefix: '/tasks' });

// Health Check
app.get('/health', async () => {
    return { status: 'ok' };
});

const start = async () => {
    try {
        await prisma.$connect();
        console.log('Connected to Database');

        // Redis connection check is handled in plugin

        const port = parseInt(process.env.PORT || '4000');
        await app.listen({ port, host: '0.0.0.0' });
        console.log(`Server running at http://localhost:${port}`);
    } catch (err) {
        app.log.error(err);
        process.exit(1);
    }
};

start();

// Socket.io connection handling
io.on('connection', (socket) => {
    console.log('Client connected:', socket.id);

    socket.on('disconnect', () => {
        console.log('Client disconnected:', socket.id);
    });
});

export { app, io };
