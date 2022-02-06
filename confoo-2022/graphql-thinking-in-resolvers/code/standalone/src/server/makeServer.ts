import { ApolloServer, gql } from 'apollo-server';
import { readFileSync } from 'fs';
import { join } from 'path';
import { UserInMemoryDataSource } from '../dataSources/UserInMemoryDataSource';
import { ChirpInMemoryDataSource } from '../dataSources/ChirpInMemoryDataSource';
import { resolvers } from '../resolvers';

const users = new UserInMemoryDataSource();
const chirps = new ChirpInMemoryDataSource();

export function makeServer(): ApolloServer {
  return new ApolloServer({
    typeDefs: gql(readFileSync(join(process.cwd(), 'resources', 'schema.graphql'), 'utf8')),
    context: ({ req }) => ({
      user: req.header('Authorization'),
    }),
    dataSources: () => ({
      users,
      chirps,
    }),
    resolvers,
  });
}
