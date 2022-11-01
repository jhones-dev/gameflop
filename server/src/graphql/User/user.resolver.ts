import { Prisma, PrismaClient } from '@prisma/client';

import type { BaseError, InputError, InternalError } from '../..';

const prisma = new PrismaClient();

type AccountUser = Prisma.usersUncheckedCreateInput &
  Pick<Prisma.accountsCreateInput, 'email' | 'password'>;

export default {
  Query: {
    Users: (_: undefined, args: Prisma.usersFindManyArgs) => {
      return {
        __typename: 'UserList',
        reviews: prisma.users.findMany(args),
      };
    },
  },
  Mutation: {
    AddUser: async (
      _: undefined,
      args: Prisma.usersUncheckedCreateInput & { accountId: number }
    ) => {
      let error: BaseError | InputError | InternalError;

      const user = await prisma.users.create({
        data: {
          name: args.name,
          photo: args.photo,
          linkedAccounts: args.linkedAccounts,
          badges: args.badges,
          favoriteList: args.favoriteList,
          permission: args.permission,
          accounts: {
            connect: {
              id: args.accountId,
            },
          },
        },
      });

      if (user) {
        return {
          __typename: 'ResultSuccess',
          statusCode: 'HTTP201',
          message: 'Account registration successful.',
        };
      } else {
        error = {
          __typename: 'InternalError',
          statusCode: 'USR210',
          message: 'Failed to create user.',
          action: 'User creation',
          operation: 'Insert',
        };

        return error;
      }
    },
    AddAccountWithUser: async (_: undefined, args: AccountUser) => {
      let error: BaseError | InputError | InternalError;

      const user = await prisma.users.create({
        data: {
          name: args.name,
          photo: args.photo,
          linkedAccounts: args.linkedAccounts,
          badges: args.badges,
          favoriteList: args.favoriteList,
          permission: args.permission,
          accounts: {
            connectOrCreate: {
              where: {
                email: args.email,
              },
              create: {
                email: args.email,
                password: args.password,
              },
            },
          },
        },
      });

      if (user) {
        return {
          __typename: 'ResultSuccess',
          statusCode: 'HTTP201',
          message: 'Account registration successful.',
        };
      } else {
        error = {
          __typename: 'InternalError',
          statusCode: 'USR210',
          message: 'Failed to create user.',
          action: 'User creation',
          operation: 'Insert',
        };

        return error;
      }
    },
  },
};
