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
    Publishers: (_: undefined, args: Prisma.publishersFindManyArgs) => {
      return {
        __typename: 'PublisherList',
        publishers: prisma.publishers.findMany(args),
      };
    },
  },
  Mutation: {
    AddPublisher: async (
      _: undefined,
      args: Prisma.publishersCreateInput,
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

      const publisher = await prisma.publishers.create({ data: args });

      if (publisher) {
        return {
          __typename: 'ResultSuccess',
          statusCode: 'HTTP201',
          message: 'Publisher created successfully.',
        };
      } else {
        error = {
          __typename: 'InternalError',
          statusCode: 'PUB210',
          message: 'Failed to create publisher.',
          action: 'Publisher creation',
          operation: 'Insert',
        };

        return error;
      }
    },
  },
};
