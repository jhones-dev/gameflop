import { Prisma, PrismaClient } from '@prisma/client';

import type {
  ApolloContext,
  BaseError,
  InputError,
  InternalError,
} from '../..';

const prisma = new PrismaClient();

export default {
  Query: {
    Developers: (_: undefined, args: Prisma.developersFindManyArgs) => {
      return {
        __typename: 'DeveloperList',
        developers: prisma.developers.findMany(args),
      };
    },
  },
  Mutation: {
    AddDeveloper: async (
      _: undefined,
      args: Prisma.developersCreateInput,
      context: ApolloContext
    ) => {
      let error: BaseError | InputError | InternalError;

      if (!context.user) {
        error = {
          __typename: 'BaseError',
          statusCode: 'HTTP401',
          message: 'You must be logged in to perform this action.',
        };

        return error;
      }

      if (context.user.permission < 2) {
        error = {
          __typename: 'BaseError',
          statusCode: 'HTTP403',
          message: 'You do not have permission to execute this action.',
        };

        return error;
      }

      const developer = await prisma.developers.create({ data: args });

      if (developer) {
        return {
          __typename: 'ResultSuccess',
          statusCode: 'HTTP201',
          message: 'Developer created successfully.',
        };
      } else {
        error = {
          __typename: 'InternalError',
          statusCode: 'DEV201',
          message: 'Failed to create developer.',
          action: 'Developer creation',
          operation: 'Insert',
        };

        return error;
      }
    },
  },
};
