import { FastifyReply, FastifyRequest } from 'fastify';
import { createTask, deleteTask, getTasks, updateTask } from './task.services';
import { createTaskSchema, updateTaskSchema, taskQuerySchema } from './task.schemas';

export async function getTasksHandler(
    request: FastifyRequest<{ Querystring: unknown }>,
    reply: FastifyReply
) {
    console.log('GET /tasks Query:', request.query);
    const query = taskQuerySchema.parse(request.query);
    console.log('Parsed Query:', query);
    const tasks = await getTasks(query);
    return reply.send(tasks);
}

export async function createTaskHandler(
    request: FastifyRequest<{ Body: unknown }>,
    reply: FastifyReply
) {
    const body = createTaskSchema.parse(request.body);
    const task = await createTask(request.server, body);
    return reply.code(201).send(task);
}

export async function updateTaskHandler(
    request: FastifyRequest<{ Params: { id: string }; Body: unknown }>,
    reply: FastifyReply
) {
    const body = updateTaskSchema.parse(request.body);
    const { id } = request.params;
    const task = await updateTask(request.server, id, body);
    return reply.send(task);
}

export async function deleteTaskHandler(
    request: FastifyRequest<{ Params: { id: string } }>,
    reply: FastifyReply
) {
    const { id } = request.params;
    await deleteTask(request.server, id);
    return reply.code(204).send();
}
