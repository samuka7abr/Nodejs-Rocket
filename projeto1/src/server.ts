import fastify from 'fastify';
import { database } from './database'; 

const app = fastify();

app.get('/hello', async () => {
  const tables = await database('sqlite_schema').select('*');
  return tables;
});

app.listen({ port: 3333 }).then(() => {
  console.log('HTTP server running!');
});
