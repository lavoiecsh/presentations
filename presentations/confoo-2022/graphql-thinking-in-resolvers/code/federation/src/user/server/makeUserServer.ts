import { ApolloServer, gql } from 'apollo-server';
import { UserInMemoryDataSource } from '../dataSources/UserInMemoryDataSource';
import { buildSubgraphSchema } from '@apollo/subgraph';
import { readFileSync } from 'fs';
import { join } from 'path';
import { resolvers } from '../resolvers';

export function makeUserServer(): ApolloServer {
  const users = new UserInMemoryDataSource();

  return new ApolloServer({
    schema: buildSubgraphSchema({
      typeDefs: gql(readFileSync(join(process.cwd(), 'resources', 'user.graphql'), 'utf8')),
      resolvers,
    }),
    context: () => ({}),
    dataSources: () => ({
      users,
    }),
  });
}
