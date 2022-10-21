import { Prisma, PrismaClient } from '@prisma/client';
import slugify from 'slugify';

import type {
  ApolloContext,
  BaseError,
  InputError,
  InternalError,
} from '../..';

const prisma = new PrismaClient();

export default {
  Query: {
    Games: (_: undefined, args: Prisma.gamesFindManyArgs) => {
      return {
        __typename: 'GameArrayResult',
        games: prisma.games.findMany(args),
      };
    },
  },
  Mutation: {
    AddGame: async (
      _: undefined,
      args: Prisma.gamesUncheckedCreateInput,
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

      const game = await prisma.games.create({
        data: {
          title: args.title,
          slug: args.slug || slugify(args.title),
          genre: args.genre,
          ageRating: args.ageRating,
          platform: args.platform,
          releaseDate: args.releaseDate,
          thumbnail: args.thumbnail,
          media: args.media,
          developers: {
            connect: { id: args.developer },
          },
          publishers: {
            connect: { id: args.publisher },
          },
        },
      });

      if (game) {
        return {
          __typename: 'GameResultSuccess',
          statusCode: 'HTTP201',
          message: 'Game created successfully.',
        };
      } else {
        error = {
          __typename: 'InternalError',
          statusCode: 'GAM210',
          message: 'Failed to create game.',
          action: 'Game creation',
          operation: 'Insert',
        };

        return error;
      }
    },
  },
};
