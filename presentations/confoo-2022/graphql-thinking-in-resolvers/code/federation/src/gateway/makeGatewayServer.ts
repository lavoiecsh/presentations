import { ApolloServer } from 'apollo-server';
import { ApolloGateway, IntrospectAndCompose, ServiceEndpointDefinition } from '@apollo/gateway';
import { AuthenticatedDataSource } from './AuthenticatedDataSource';
import { GatewayContext } from './GatewayContext';

export function makeGatewayServer(subgraphs: ServiceEndpointDefinition[]): ApolloServer {
  const gateway = new ApolloGateway({
    supergraphSdl: new IntrospectAndCompose({ subgraphs }),
    buildService: ({ url }) => new AuthenticatedDataSource({ url }),
  });

  return new ApolloServer({
    gateway,
    context: ({ req }): GatewayContext => ({ authorization: req.headers['authorization'] }),
  });
}
