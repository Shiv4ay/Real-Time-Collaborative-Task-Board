import Fastify from 'fastify';
import cors from '@fastify/cors';
import customJwt from '@fastify/jwt';
import websocket from '@fastify/websocket';
import { Server } from 'socket.io';
import dotenv from 'dotenv';
import { authRoutes } from './modules/auth/auth.routes';
import { taskRoutes } from './modules/tasks/task.routes';
import { prisma } from './plugins/prisma';
import { redis } from './plugins/redis';
import swaggerPlugin from './plugins/swagger';

dotenv.config();

const app = Fastify({ logger: true });

// Register Plugins
app.register(swaggerPlugin);
app.register(cors, {
    origin: (origin, cb) => {
        // Allow no origin (like mobile apps or curl requests)
        if (!origin) return cb(null, true);

        // Allow localhost and local network IPs
        const allowedOrigins = [
            'http://localhost:3000',
            'http://127.0.0.1:3000'
        ];

        // Dynamic check for local network IPs or adding simple regex
        if (allowedOrigins.includes(origin) || origin.startsWith('http://192.168.')) {
            cb(null, true);
            return;
        }

        cb(new Error('Not allowed by CORS'), false);
    },
    methods: ['GET', 'POST', 'PUT', 'DELETE', 'OPTIONS'],
    credentials: true,
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
        origin: (origin, callback) => {
            const allowedOrigins = [
                'http://localhost:3000',
                'http://127.0.0.1:3000'
            ];
            if (!origin || allowedOrigins.includes(origin) || origin.startsWith('http://192.168.')) {
                callback(null, true);
            } else {
                callback(new Error('Not allowed by CORS'), false);
            }
        },
        methods: ['GET', 'POST', 'PUT', 'DELETE'],
        credentials: true,
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
