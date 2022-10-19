import { Prisma, PrismaClient } from '@prisma/client';

import type { ApolloContext } from '../..';

const prisma = new PrismaClient();

type AccountUser = Prisma.usersUncheckedCreateInput &
  Pick<Prisma.accountsCreateInput, 'email' | 'password'>;

export default {
  Query: {
    Users: (_: undefined, args: Prisma.usersFindManyArgs) => {
      return prisma.users.findMany(args);
    },
  },
  Mutation: {
    AddUser: async (
      _: undefined,
      args: Prisma.usersUncheckedCreateInput & { accountId: number }
    ) => {
      return prisma.users.create({
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
    },
    AddAccountWithUser: async (_: undefined, args: AccountUser) => {
      return prisma.users.create({
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
    },
  },
};
