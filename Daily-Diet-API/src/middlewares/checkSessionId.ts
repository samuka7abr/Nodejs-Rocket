import { FastifyReply, FastifyRequest } from 'fastify';
import { Knex } from '../database';

export async function checksession_idExists(request: FastifyRequest, reply: FastifyReply) {
	const session_id = request.cookies.session_id;

	if (!session_id) {
		return reply.status(401).send({ error: 'Unauthorized' });
	}

	const user = await Knex('users').where({ session_id: session_id }).first();

	if (!user) {
		return reply.status(401).send({ error: 'Unauthorized' });
	}

	request.user = user;
}