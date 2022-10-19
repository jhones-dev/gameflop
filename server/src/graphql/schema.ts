import merge from 'lodash/merge.js';
import GraphQLJSON from 'graphql-type-json';
import { loadSchema } from '@graphql-tools/load';
import { makeExecutableSchema } from '@graphql-tools/schema';
import { GraphQLFileLoader } from '@graphql-tools/graphql-file-loader';
import { GraphQLScalarType, Kind } from 'graphql';

import AccountResolver from './Account/account.resolver.js';
import CompanyResolver from './Company/company.resolver.js';

import type { IResolvers } from '@graphql-tools/utils/typings/Interfaces';

const typeDefs = await loadSchema(['*.graphql', '**/*.graphql'], {
  loaders: [new GraphQLFileLoader()],
});

const resolvers: IResolvers = merge(AccountResolver, CompanyResolver, {
  JSON: GraphQLJSON,
  Date: new GraphQLScalarType({
    name: 'Date',
    description: 'Date custom scalar type',
    serialize(value) {
      if (!(value instanceof Date) && typeof value === 'string') {
        return new Date(value);
      }

      return value;
    },
    parseValue(value) {
      return new Date(Number(value)); // Convert incoming integer to Date
    },
    parseLiteral(ast) {
      if (ast.kind === Kind.INT) {
        return new Date(parseInt(ast.value, 10)); // Convert hard-coded AST string to integer and then to Date
      }
      return null; // Invalid hard-coded value (not an integer)
    },
  }),
});

export default makeExecutableSchema({
  typeDefs,
  resolvers,
});
