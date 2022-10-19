import { ApolloServer } from 'apollo-server-express';
import { PrismaClient } from '@prisma/client';

import schema from './graphql/schema.js';
import { verifyJwt } from './utils/jwt.js';

import type express from 'express';

const prisma = new PrismaClient();

export async function startApolloServer(app: express.Application) {
  const apolloServer = new ApolloServer({
    schema,
    introspection: process.env.NODE_ENV !== 'production',
    context: async ({ req, res }) => {
      const { JWT } = req.cookies;
      const decoded = verifyJwt(JWT);

      if (decoded) {
        const user = await prisma.users.findUnique({
          where: { accountId: Number(decoded?.sub) },
        });

        return { req, res, user };
      }

      return { req, res };
    },
  });

  await apolloServer.start();
  apolloServer.applyMiddleware({ app, path: '/graphql' });
  console.log('Initialized apollo server...');
}
