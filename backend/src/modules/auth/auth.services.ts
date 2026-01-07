import { prisma } from '../../plugins/prisma';
import { redis } from '../../plugins/redis';
import { LoginInput } from './auth.schemas';
import { FastifyInstance } from 'fastify';

export async function loginUser(app: FastifyInstance, input: LoginInput) {
    const { email, password } = input;

    // For simplicity in this demo, we'll create the user if they don't exist
    // In a real app, you'd check password hash
    let user = await prisma.user.findUnique({ where: { email } });

    if (!user) {
        user = await prisma.user.create({
            data: {
                email,
                password, // In real app: hash this!
            },
        });
    } else {
        // In real app, verify password here
        if (user.password !== password) {
            throw new Error('Invalid credentials');
        }
    }

    const token = app.jwt.sign({ id: user.id, email: user.email });

    // Store session metadata in Redis
    await redis.set(`session:${user.id}`, JSON.stringify({
        email: user.email,
        loginAt: new Date().toISOString(),
        ip: 'unknown' // In a real app, retrieve from request
    }), 'EX', 86400); // Expire in 24 hours

    return { token, user: { id: user.id, email: user.email } };
}
