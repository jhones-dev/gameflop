import merge from 'lodash/merge.js';
import GraphQLJSON from 'graphql-type-json';
import { GraphQLScalarType, Kind } from 'graphql';
import type { IResolvers } from '@graphql-tools/utils/typings/Interfaces';

import userResolver from './User/user.resolver.js';
import gameResolver from './Game/game.resolver.js';
import reviewResolver from './Review/review.resolver.js';
import accountResolver from './Account/account.resolver.js';
import companyResolver from './Company/company.resolver.js';
import developerResolver from './Developer/developer.resolver.js';
import publisherResolver from './Publisher/publisher.resolver.js';

const resolvers: IResolvers = merge(
  userResolver,
  gameResolver,
  reviewResolver,
  accountResolver,
  companyResolver,
  developerResolver,
  publisherResolver,
  {
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
  }
);

export default resolvers;
