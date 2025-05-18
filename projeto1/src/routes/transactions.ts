import { FastifyInstance } from 'fastify';
import { database } from '../database';
import { z } from 'zod';
import { randomUUID } from 'crypto';
 
export async function transactionsRoutes(app: FastifyInstance){
	app.get('/', async () => {
		const transactions = await database('transactions').select();

		return {
			transactions
		};
	});

	app.get('/:id', async(request) => {
		const getTransactionParamsSchema = z.object({
			id: z.string().uuid()
		});

		const { id } = getTransactionParamsSchema.parse(request.params);

		const transaction = await database('transactions').where('id', id).first();

		return { transaction };
	});

	app.get('/sumary', async () =>{
		const sumary = await database('transactions').sum('amount', {as: 'amount'}).first();

		return sumary;
	});

	app.post('/', async (request, reply) => {
		const createTransactionBodySchema = z.object({
			title: z.string(),
			amount: z.number(),
			type: z.enum(['credit', 'debit'])
		});

		const { title, amount, type } = createTransactionBodySchema.parse(request.body);

		let sessionId = request.cookies.sessionId;

		if(!sessionId){
			sessionId = randomUUID();

			reply.cookie('sessionId', sessionId, {
				path: '/',
				maxAge:  60 * 60 * 24 * 7 //7days
			});
		}

		await database('transactions')
			.insert({
				id: crypto.randomUUID(),
				title,
				amount: type === 'credit' ? amount : amount * - 1,
				session_id: sessionId,
			});
		return reply.status(201).send();
	});
}