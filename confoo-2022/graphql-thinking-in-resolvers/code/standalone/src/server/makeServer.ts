import { ApolloServer, gql } from 'apollo-server';
import { readFileSync } from 'fs';
import { join } from 'path';
import { UserInMemoryDataSource } from '../dataSources/UserInMemoryDataSource';
import { ChirpInMemoryDataSource } from '../dataSources/ChirpInMemoryDataSource';
import { resolvers } from '../resolvers';

export function makeServer(): ApolloServer {
  const users = new UserInMemoryDataSource();
  const chirps = new ChirpInMemoryDataSource();

  return new ApolloServer({
    typeDefs: gql(readFileSync(join(process.cwd(), 'resources', 'schema.graphql'), 'utf8')),
    context: ({ req }) => ({
      user: req.header('authorization'),
    }),
    dataSources: () => ({
      users,
      chirps,
    }),
    resolvers,
  });
}
