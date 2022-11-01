import dayjs from 'dayjs';
import bcrypt from 'bcrypt';
import { Prisma, PrismaClient } from '@prisma/client';

import { generateJwt } from '../../utils/jwt.js';

import type {
  ApolloContext,
  BaseError,
  InputError,
  InternalError,
} from '../..';

type LoginInput = {
  email: string;
  password: string;
};

const prisma = new PrismaClient();

export default {
  Query: {
    Accounts: (_: undefined, args: Prisma.accountsFindManyArgs) => {
      return {
        __typename: 'AccountList',
        accounts: prisma.accounts.findMany(args),
      };
    },
  },
  Mutation: {
    AddAccount: async (_: undefined, args: Prisma.accountsCreateInput) => {
      let error: BaseError | InputError | InternalError;

      if (!args.email) {
        error = {
          __typename: 'InputError',
          statusCode: 'ACC100',
          message: 'Invalid email.',
          field: 'email',
        };

        return error;
      }

      if (typeof args.password === 'string' && args.password.length) {
        const hash = await bcrypt.hash(
          args.password,
          Number(process.env.SALTROUNDS) || 10
        );

        prisma.accounts.create({
          data: { ...args, password: hash },
        });

        return {
          __typename: 'ResultSuccess',
          statusCode: 'HTTP201',
          message: 'Account created successfully.',
        };
      } else {
        if (args.socialMedia) {
          prisma.accounts.create({ data: args });

          return {
            __typename: 'ResultSuccess',
            statusCode: 'HTTP201',
            message: 'Account created successfully.',
          };
        } else {
          error = {
            __typename: 'InputError',
            statusCode: 'ACC102',
            message: 'No password or social media provided.',
            field: 'socialMedia',
          };

          return error;
        }
      }
    },
    Login: async (_: undefined, args: LoginInput, context: ApolloContext) => {
      let error: BaseError | InputError | InternalError;

      const account = await prisma.accounts.findUnique({
        where: {
          email: args.email,
        },
        include: {
          companies: true,
          users: true,
        },
      });

      if (account && account.password) {
        const correctPassword = await bcrypt.compare(
          args.password,
          account.password
        );

        if (!correctPassword) {
          error = {
            __typename: 'InputError',
            statusCode: 'ACC101',
            message: 'Incorrect email or password.',
            field: 'password',
          };

          return error;
        }

        const accountType = account.users
          ? 'user'
          : account.companies && 'company';

        if (!accountType) {
          error = {
            __typename: 'InternalError',
            statusCode: 'ACC202',
            message: 'Unknown account type.',
            action: 'Login',
            operation: 'Select account type',
          };

          return error;
        }

        const accessToken = generateJwt({
          subject: account.id,
          payload: { email: account.email, type: accountType },
        });

        if (!accessToken) {
          error = {
            __typename: 'InternalError',
            statusCode: 'ACC203',
            message: 'Invalid generated token.',
            action: 'Login',
            details: 'Token data: ' + accessToken,
          };

          return error;
        }

        context.res.cookie('JWT', accessToken, {
          httpOnly: true,
          secure: process.env.NODE_ENV !== 'development',
          expires: dayjs().add(1, 'hour').toDate(),
        });

        return {
          __typename: 'ResultSuccess',
          statusCode: 'HTTP200',
          message: 'Login success',
        };
      } else {
        return {
          __typename: 'InputError',
          statusCode: 'ACC101',
          message: 'Incorrect email or password.',
          field: 'email',
        };
      }
    },
  },
};
