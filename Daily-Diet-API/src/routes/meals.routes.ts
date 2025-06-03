import { checksession_idExists } from '../middlewares/checkSessionId';
import { FastifyInstance } from 'fastify';
import { MealController } from '../controllers/MealController';

const mealController = new MealController();

export function mealRoutes(app : FastifyInstance){
	app.post('/', {
		preHandler: checksession_idExists
	},mealController.createMeal);

	app.get('/:', {

		preHandler: checksession_idExists
	}, mealController.listMeals);

	app.get('/;mealId', {

		preHandler: checksession_idExists
	}, mealController.listById);	
}

