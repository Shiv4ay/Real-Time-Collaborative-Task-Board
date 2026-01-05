import { prisma } from '../../plugins/prisma';
import { redis } from '../../plugins/redis';
import { CreateTaskInput, UpdateTaskInput, TaskQueryInput } from './task.schemas';
import { FastifyInstance } from 'fastify';

const CACHE_KEY = 'tasks:all';

export async function getTasks(query: TaskQueryInput) {
    // Simple caching strategy: Cache only the first page without filters
    // For production, you'd cache based on query params hash
    const isCacheable = query.page === 1 && !query.status && !query.search;

    if (isCacheable) {
        const cached = await redis.get(CACHE_KEY);
        if (cached) return JSON.parse(cached);
    }

    const { page, limit, status, search } = query;
    const skip = (page - 1) * limit;

    const where: any = {};
    if (status) where.status = status;
    if (search) {
        where.OR = [
            { title: { contains: search, mode: 'insensitive' } },
            { description: { contains: search, mode: 'insensitive' } },
        ];
    }

    const [data, total] = await Promise.all([
        prisma.task.findMany({
            where,
            skip,
            take: limit,
            orderBy: { createdAt: 'desc' },
        }),
        prisma.task.count({ where }),
    ]);

    const result = { data, total, page, limit };

    if (isCacheable) {
        await redis.set(CACHE_KEY, JSON.stringify(result), 'EX', 60); // Cache for 60s
    }

    return result;
}

export async function createTask(app: FastifyInstance, input: CreateTaskInput) {
    const task = await prisma.task.create({ data: input });

    await redis.del(CACHE_KEY); // Invalidate cache
    app.io.emit('TASK_CREATED', task);

    return task;
}

export async function updateTask(app: FastifyInstance, id: string, input: UpdateTaskInput) {
    const task = await prisma.task.update({ where: { id }, data: input });

    await redis.del(CACHE_KEY); // Invalidate cache
    app.io.emit('TASK_UPDATED', task);

    return task;
}

export async function deleteTask(app: FastifyInstance, id: string) {
    const task = await prisma.task.delete({ where: { id } });

    await redis.del(CACHE_KEY); // Invalidate cache
    app.io.emit('TASK_DELETED', { id }); // Emit ID only or full task

    return task;
}
