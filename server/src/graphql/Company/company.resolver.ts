import bcrypt from 'bcrypt';
import { Prisma, PrismaClient } from '@prisma/client';

import type { BaseError, InputError, InternalError } from '../..';

const prisma = new PrismaClient();

type AccountCompany = Prisma.companiesUncheckedCreateInput &
  Pick<Prisma.accountsCreateInput, 'email' | 'password'>;

export default {
  Query: {
    Companies: (_: undefined, args: Prisma.companiesFindManyArgs) => {
      return {
        __typename: 'CompanyList',
        companies: prisma.companies.findMany(args),
      };
    },
  },
  Mutation: {
    AddCompany: async (
      _: undefined,
      args: Prisma.companiesUncheckedCreateInput
    ) => {
      const company = await prisma.companies.create({
        data: {
          name: args.name,
          logo: args.logo,
          verified: args.verified || false,
          employees: args.employees,
          accounts: {
            connect: {
              id: args.accountId,
            },
          },
        },
      });

      if (company) {
        return {
          __typename: 'CompanyResultSuccess',
          statusCode: 'HTTP201',
          message: 'Company created successfully.',
        };
      }
    },
    AddAccountWithCompany: async (_: undefined, args: AccountCompany) => {
      let error: BaseError | InputError | InternalError;

      if (typeof args.password !== 'string' || !args.password.length) {
        error = {
          __typename: 'InputError',
          statusCode: 'ACC103',
          message: 'Invalid password.',
          field: 'password',
        };

        return error;
      }

      const hash = await bcrypt.hash(
        args.password,
        process.env.SALTROUNDS || 10
      );

      const company = await prisma.companies.create({
        data: {
          name: args.name,
          logo: args.logo,
          verified: args.verified || false,
          employees: args.employees,
          accounts: {
            connectOrCreate: {
              where: {
                email: args.email,
              },
              create: {
                email: args.email,
                password: hash,
              },
            },
          },
        },
      });

      if (company) {
        return {
          __typename: 'CompanyResultSuccess',
          statusCode: 'HTTP201',
          message: 'Company created successfully.',
        };
      }
    },
  },
};
