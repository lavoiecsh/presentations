import { ApolloServer, gql } from 'apollo-server';
import { ChirpInMemoryDataSource } from '../dataSources/ChirpInMemoryDataSource';
import { decode } from 'jsonwebtoken';
import { resolvers } from '../resolvers';
import { buildSubgraphSchema } from '@apollo/subgraph';
import { readFileSync } from 'fs';
import { join } from 'path';

export function makeServer(): ApolloServer {
  const chirps = new ChirpInMemoryDataSource();

  return new ApolloServer({
    schema: buildSubgraphSchema({
      typeDefs: gql(readFileSync(join(process.cwd(), 'resources', 'chirp.graphql'), 'utf8')),
      resolvers,
    }),
    context: ({ req }) => ({
      user: decode(req.header('authorization')),
    }),
    dataSources: () => ({
      chirps,
    }),
  });
}
