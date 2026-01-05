import { FastifyInstance } from 'fastify';
import { loginHandler } from './auth.controller';

export async function authRoutes(app: FastifyInstance) {
    app.post('/login', loginHandler);
}
