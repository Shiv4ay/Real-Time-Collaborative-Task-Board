
import '@fastify/jwt';
import { Server } from 'socket.io';

declare module 'fastify' {
    interface FastifyInstance {
        io: Server;
        authenticate: (request: any, reply: any) => Promise<void>;
    }
}

declare module '@fastify/jwt' {
    interface FastifyJWT {
        payload: { id: string; email: string };
        user: { id: string; email: string };
    }
}
