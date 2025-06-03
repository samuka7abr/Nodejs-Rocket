import { FastifyInstance } from 'fastify';  
import { UserController } from '../controllers/UserController';
//eslint-disable-next-line
import { checksession_idExists } from '../middlewares/checkSessionId';

const userController = new UserController(); 

export function usersRoutes(app: FastifyInstance){

	app.post('/', userController.createUser);
}