import { FastifyReply, FastifyRequest } from 'fastify';
import { loginUser } from './auth.services';
import { loginSchema } from './auth.schemas';

export async function loginHandler(
    request: FastifyRequest<{ Body: unknown }>,
    reply: FastifyReply
) {
    const body = loginSchema.parse(request.body);

    try {
        const result = await loginUser(request.server, body);
        return reply.code(200).send(result);
    } catch (err: any) {
        return reply.code(401).send({ message: err.message });
    }
}
