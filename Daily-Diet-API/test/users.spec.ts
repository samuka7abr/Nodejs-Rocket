import { FastifyInstance } from 'fastify';
import { z } from 'zod';
import { Knex } from '../src/database';
import { randomUUID } from 'node:crypto';

export async function usersRoutes(app: FastifyInstance) {
	app.post('/', async (request, reply) => {
		const createUserBodySchema = z.object({
			name: z.string(),
			email: z.string().email(),
		});

		let sessionId = request.cookies.sessionId;

		if (!sessionId) {
			sessionId = randomUUID();

			reply.setCookie('sessionId', sessionId, {
				path: '/',
				maxAge: 1000 * 60 * 60 * 24 * 7, // 7 days
			});
		}

		const { name, email } = createUserBodySchema.parse(request.body);

		const userByEmail = await Knex('users').where({ email }).first();

		if (userByEmail) {
			return reply.status(400).send({ message: 'User already exists' });
		}

		await Knex('users').insert({
			id: randomUUID(),
			name,
			email,
			session_id: sessionId,
		});

		return reply.status(201).send();
	});
}