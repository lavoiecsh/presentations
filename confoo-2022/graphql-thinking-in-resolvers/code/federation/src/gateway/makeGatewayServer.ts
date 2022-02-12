import { ApolloServer } from 'apollo-server';
import { ApolloGateway, IntrospectAndCompose, ServiceEndpointDefinition } from '@apollo/gateway';

export function makeGatewayServer(subgraphs: ServiceEndpointDefinition[]): ApolloServer {
  const gateway = new ApolloGateway({
    supergraphSdl: new IntrospectAndCompose({ subgraphs }),
  });

  return new ApolloServer({
    gateway,
  });
}
