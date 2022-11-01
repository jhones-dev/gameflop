import { loadSchema } from '@graphql-tools/load';
import { makeExecutableSchema } from '@graphql-tools/schema';
import { GraphQLFileLoader } from '@graphql-tools/graphql-file-loader';

import resolvers from './resolvers.js';

const typeDefs = await loadSchema(['*.graphql', '**/*.graphql'], {
  loaders: [new GraphQLFileLoader()],
});

export default makeExecutableSchema({
  typeDefs,
  resolvers,
});
