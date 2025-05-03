import fastify from 'fastify';
import { database } from './database'; 
import crypto from 'node:crypto';	
import { env } from './env';

const app = fastify();

app.get('/hello', async () => {
	const transactions = await database('transactions').insert({
		id: crypto.randomUUID(),
		title: 'transação de teste',
		amount: 1000
	}).returning('*');

	return transactions;
});

app.listen({ port: env.PORT }).then(() => {
	console.log('HTTP server running!');
});
