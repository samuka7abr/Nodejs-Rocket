import path from 'node:path';
import knex from 'knex';
import { env } from './env/index';

if(process.env.DATABASE_URL){
	throw new Error('database not provided');
}

export const config: Parameters<typeof knex>[0] = {
	client: 'sqlite3',
	connection: {
		filename: env.DATABASE_URL,
	},
	useNullAsDefault: true,
	migrations: {
		extension: 'ts',
		directory: path.resolve('db', 'migrations')
	}
};

export const database = knex(config);
