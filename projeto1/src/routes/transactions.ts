import { FastifyInstance } from 'fastify';
import { database } from '../database';
import { z } from 'zod';
 
export async function transactionsRoutes(app: FastifyInstance){
	app.get('/', async () => {
		const transactions = await database('transactions').select();

		return {
			transactions
		};
	});

	app.post('/', async (request, reply) => {
		const createTransactionBodySchema = z.object({
			title: z.string(),
			amount: z.number(),
			type: z.enum(['credit', 'debit']),
		});

		const { title, amount, type } = createTransactionBodySchema.parse(request.body);
		await database('transactions')
			.insert({
				id: crypto.randomUUID(),
				title,
				amount: type === 'credit' ? amount : amount * - 1
			});
		return reply.status(201).send;
	});
}