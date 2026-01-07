import fp from 'fastify-plugin';
import swagger from '@fastify/swagger';
import swaggerUi from '@fastify/swagger-ui';
import { FastifyInstance } from 'fastify';

export default fp(async (app: FastifyInstance) => {
    await app.register(swagger, {
        swagger: {
            info: {
                title: 'Task Board API',
                description: 'Real-time collaborative task board API',
                version: '1.0.0',
            },
            host: 'localhost:4000',
            schemes: ['http'],
            consumes: ['application/json'],
            produces: ['application/json'],
            securityDefinitions: {
                Bearer: {
                    type: 'apiKey',
                    name: 'Authorization',
                    in: 'header',
                },
            },
        },
    });

    await app.register(swaggerUi, {
        routePrefix: '/documentation',
        uiConfig: {
            docExpansion: 'full',
            deepLinking: true,
        },
        staticCSP: true,
    });
});
