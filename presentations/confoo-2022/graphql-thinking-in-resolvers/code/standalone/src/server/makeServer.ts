import { ApolloServer, gql } from 'apollo-server';
import { readFileSync } from 'fs';
import { join } from 'path';
import { UserInMemoryDataSource } from '../dataSources/UserInMemoryDataSource';
import { ChirpInMemoryDataSource } from '../dataSources/ChirpInMemoryDataSource';
import { resolvers } from '../resolvers';
import { decode } from 'jsonwebtoken';

export function makeServer(): ApolloServer {
  const users = new UserInMemoryDataSource();
  const chirps = new ChirpInMemoryDataSource();

  return new ApolloServer({
    typeDefs: gql(readFileSync(join(process.cwd(), 'resources', 'schema.graphql'), 'utf8')),
    context: ({ req }) => ({
      user: decode(req.header('authorization')),
    }),
    dataSources: () => ({
      users,
      chirps,
    }),
    resolvers,
  });
}
