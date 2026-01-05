import { FastifyInstance } from 'fastify';
import { createTaskHandler, deleteTaskHandler, getTasksHandler, updateTaskHandler } from './task.controller';

export async function taskRoutes(app: FastifyInstance) {
    // Public routes for now, or add onRequest: [app.authenticate]
    app.get('/', { onRequest: [app.authenticate] }, getTasksHandler);
    app.post('/', { onRequest: [app.authenticate] }, createTaskHandler);
    app.put('/:id', { onRequest: [app.authenticate] }, updateTaskHandler);
    app.delete('/:id', { onRequest: [app.authenticate] }, deleteTaskHandler);
}
