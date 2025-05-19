import { checkSessionIdExists } from '../middleware/check-session-id-exists';
import { FastifyInstance } from 'fastify';
import { database } from '../database';
import { randomUUID } from 'crypto';
import { z } from 'zod';


export async function transactionsRoutes(app: FastifyInstance){
	app.addHook('preHandler', async (request) => {
		console.log(`[${request.method}] ${request.url}`);
	});

	app.get('/', {
		preHandler: [checkSessionIdExists]
	},async (request) => {
		const{ sessionId } = request.cookies;
		const transactions = await database('transactions').where('session_id', sessionId).select();

		return {
			transactions
		};
	});

	app.get('/:id', {
		preHandler: [checkSessionIdExists]
	},async(request) => {
		const getTransactionParamsSchema = z.object({
			id: z.string().uuid()
		});

		const { id } = getTransactionParamsSchema.parse(request.params);

		const { sessionId } = request.cookies;

		const transaction = await database('transactions').where('id', id).andWhere('session_id', sessionId).first();

		return { transaction };
	});

	app.get('/sumary', {
		preHandler: [checkSessionIdExists]
	},async () =>{
		const sumary = await database('transactions').sum('amount', {as: 'amount'}).first();

		return sumary;
	});

	app.post('/', {
		preHandler: [checkSessionIdExists]
	},async (request, reply) => {
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