import knex, { Knex as setupKnex, Knex} from 'knex';
import { env } from './env';

//console.log(process.env)
export const config: Knex.Config = {
  client: 'sqlite',
  connection: {
    filename: env.DATABASE_URL,
  },
  useNullAsDefault: true,
  migrations: {
    extension: 'ts',
    directory: './db/migrations',

  },
};
const knexInstance = knex(config);

export { knexInstance, knex };
