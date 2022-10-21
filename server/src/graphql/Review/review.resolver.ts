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
    Reviews: (_: undefined, args: Prisma.reviewsFindManyArgs) => {
      return {
        __typename: 'ReviewArrayResult',
        reviews: prisma.reviews.findMany(args),
      };
    },
  },
  Mutation: {
    AddReview: async (
      _: undefined,
      args: Prisma.reviewsUncheckedCreateInput,
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

      const review = await prisma.reviews.create({
        data: {
          rating: args.rating,
          title: args.title,
          description: args.description,
          status: args.status,
          games: {
            connect: { id: args.game },
          },
          users: {
            connect: { id: args.author || context.user?.id },
          },
        },
      });

      if (review) {
        if (review.status === 'published')
          return {
            __typename: 'ReviewResultSuccess',
            statusCode: 'HTTP201',
            message: 'Your review was added and is already published.',
          };
        else if (review.status === 'pending')
          return {
            __typename: 'ReviewResultSuccess',
            statusCode: 'HTTP201',
            message: 'Your review was added and is under approval.',
          };
      } else {
        error = {
          __typename: 'InternalError',
          statusCode: 'REV210',
          message: 'Failed to create review.',
          action: 'Review creation',
          operation: 'Insert',
        };

        return error;
      }
    },
  },
};
