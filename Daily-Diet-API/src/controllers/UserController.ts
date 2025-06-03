import { Knex } from '../database';
import { z } from 'zod';
import { randomUUID } from 'node:crypto';
import { FastifyRequest, FastifyReply } from 'fastify';

export class UserController{
	async createUser(request : FastifyRequest, reply: FastifyReply){
		const createUserBodySchema = z.object({
			name: z.string(),
			email: z.string().email(),
		});

		let session_id = randomUUID();

		if(!session_id){
			console.log('criando um id');
			session_id = randomUUID();
		}

		reply.setCookie('session_id', session_id, {
			path: '/',
			maxAge: 1000 * 60 * 60 * 24 * 7,//7dias
		});

		const { name, email } = createUserBodySchema.parse(request.body);
		const getUserByEmail = await Knex('users').where({email}).first();

		if(getUserByEmail){
			return reply.status(400).send({message: 'user already exists'});
		}

		try{
			await Knex('users').insert({
				id: randomUUID(),
				name,
				email,
				session_id: session_id,
			});
		}catch(error){
			console.error(error.message);
			return reply.status(400).send('caralho');
		}

		
		return reply.status(201).send();
	}

}