import fastify from 'fastify';
import coockie from '@fastify/cookie'

import { transactionsRoutes } from './routes/transactions';

 export const app = fastify();

app.register(coockie);
app.register(transactionsRoutes, {
  prefix: 'transactions',
});
