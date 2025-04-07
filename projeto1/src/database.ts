import knex from 'knex';

export const database = knex({
  client: 'sqlite3',
  connection: {
    filename: './tmp/app.db'
  },
});
