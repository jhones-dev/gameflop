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
      let error: BaseError | InputError | InternalError;

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
          __typename: 'ResultSuccess',
          statusCode: 'HTTP201',
          message: 'Company created successfully.',
        };
      } else {
        error = {
          __typename: 'InternalError',
          statusCode: 'EMP201',
          message: 'Failed to create company.',
          action: 'Company creation',
          operation: 'Insert',
        };

        return error;
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
        Number(process.env.SALTROUNDS) || 10
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
          __typename: 'ResultSuccess',
          statusCode: 'HTTP201',
          message: 'Company created successfully.',
        };
      } else {
        error = {
          __typename: 'InternalError',
          statusCode: 'EMP201',
          message: 'Failed to create company.',
          action: 'Company creation',
          operation: 'Insert',
        };

        return error;
      }
    },
  },
};
