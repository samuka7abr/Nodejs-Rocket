import 'dotenv/config';
import { z } from 'zod';

const envSchema = z.object({
	PORT: z.coerce.number().default(3333),
	DATABASE_URL: z.string(),
	NODE_ENV: z.enum(['development', 'test', 'production']).default('development'),
});

const _env = envSchema.safeParse(process.env);

if(_env.success === false){
	console.error('invalid env variables', _env.error.format());
    
	throw new Error('invalid env variables');
}

export const env = _env.data;