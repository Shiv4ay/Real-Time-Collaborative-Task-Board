import { prisma } from '../../plugins/prisma';
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

    return { token, user: { id: user.id, email: user.email } };
}
