
import '@fastify/jwt';
import { Server } from 'socket.io';

// This usage of 'declare module' is correct for type augmentation if inside a .d.ts file included in compilation.
// However, adding a top-level export makes it a module, allowing augmentation of external modules.
export { };

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
