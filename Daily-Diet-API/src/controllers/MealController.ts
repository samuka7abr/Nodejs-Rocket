import { Knex } from '../database';
import { z } from 'zod';
import { randomUUID } from 'node:crypto';
import { FastifyRequest, FastifyReply } from 'fastify';

export class MealController{
	async createMeal(request: FastifyRequest, reply: FastifyReply){
		const createMealBodySchema = z.object({
			name: z.string(),
			description: z.string(),
			isOnDiet: z.boolean(),
			date: z.coerce.date(),
		});

		const { name, description, isOnDiet, date } = createMealBodySchema.parse(request.body);
        
		try{
			await Knex('meals').insert({
				id: randomUUID(),
				name,
				description,
				is_on_diet: isOnDiet,
				date: date.getTime(),
				user_id: request.user?.id,
			});
			return reply.status(201).send('refeição adicionada com sucesso!');
		}catch(error){
			console.log(error.message);
			return reply.status(400).send('deu erro nessa porraaaa');
		}
	}
	//eslint-disable-next-line
	async listMeals(request: FastifyRequest, reply: FastifyReply){
		const meals = await Knex('meals').where({ user_id: request.user?.id}).orderBy('date', 'desc');

		return reply.send({ meals });
	}

	async listById(request: FastifyRequest, reply: FastifyReply){
		const paramsSchema = z.object({ mealId: z.string().uuid() });

		const { mealId } = paramsSchema.parse(request.params);

		const meal = await Knex('meals').where({ id: mealId }).first();

		if (!meal) {
			return reply.status(404).send({ error: 'Meal not found' });
		}

		return reply.send({ meal });
	}

	//eslint-disable-next-line
	async editMeal(request: FastifyRequest, reply: FastifyReply){
		const paramsSchema = z.object({
			mealId: z.string().uuid()
		});

		const { mealId } = paramsSchema.parse(request.params);

		const updateMealBodySchema = z.object({
			name: z.string(),
			description: z.string(),
			isOnDiet: z.boolean(),
			date: z.coerce.date(),
		});
		//eslint-disable-next-line
		const { name, description, isOnDiet, date} = updateMealBodySchema.parse(request.body);

		const meal = await Knex('meals').where({ id: mealId }).first();

		if(!meal){
			return reply.status(404).send({ error: 'Meal not found'});
		}

		await Knex('meals').where({ id: mealId }).update({
			name,
			description,
			is_on_diet: isOnDiet,
			date: date.getTime()
		});

		return reply.status(204).send('Meal updated successfully');
	}

	async deleteMeal(request: FastifyRequest, reply: FastifyReply) {
		const paramsSchema = z.object({ mealId: z.string().uuid() });
		const { mealId } = paramsSchema.parse(request.params);

		const meal = await Knex('meals').where({ id: mealId }).first();
		if (!meal) {
			return reply.status(404).send({ error: 'Meal not found' });
		}

		await Knex('meals').where({ id: mealId }).delete();
		return reply.status(204).send();
	}

	async getMetrics(request: FastifyRequest, reply: FastifyReply) {
		if (!request.user) {
			return reply.status(401).send({ error: 'usuário não encontrado' });
		}

		const userId = request.user.id;


		const totalMealsOnDiet = await Knex('meals')
			.where({ user_id: userId, is_on_diet: true })
			.count('id', { as: 'total' })
			.first();

		const totalMealsOffDiet = await Knex('meals')
			.where({ user_id: userId, is_on_diet: false })
			.count('id', { as: 'total' })
			.first();

		const allMeals = await Knex('meals')
			.where({ user_id: userId })
			.orderBy('date', 'desc');

		const { bestOnDietSequence } = allMeals.reduce(
			(acc, meal) => {
				if (meal.is_on_diet) {
					acc.currentSequence += 1;
				} else {
					acc.currentSequence = 0;
				}

				if (acc.currentSequence > acc.bestOnDietSequence) {
					acc.bestOnDietSequence = acc.currentSequence;
				}

				return acc;
			},
			{ bestOnDietSequence: 0, currentSequence: 0 }
		);

		return reply.send({
			totalMeals: allMeals.length,
			totalMealsOnDiet: totalMealsOnDiet?.total ?? 0,
			totalMealsOffDiet: totalMealsOffDiet?.total ?? 0,
			bestOnDietSequence,
		});
	}

	
}