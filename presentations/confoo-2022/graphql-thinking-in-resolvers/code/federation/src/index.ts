import { makeChirpServer } from './chirp/server/makeChirpServer';
import { makeUserServer } from './user/server/makeUserServer';
import { ServiceEndpointDefinition } from '@apollo/gateway';
import { makeGatewayServer } from './gateway/makeGatewayServer';

const userServer = makeUserServer();
const chirpServer = makeChirpServer();
const subgraphs: ServiceEndpointDefinition[] = [];

userServer.listen({ port: 4002 })
  .then(({ url }) => subgraphs.push({ name: 'user', url }))
  .then(() => chirpServer.listen({ port: 4003 }))
  .then(({ url }) => subgraphs.push({ name: 'chirp', url }))
  .then(() => makeGatewayServer(subgraphs))
  .then(gatewayServer => gatewayServer.listen({ port: 4001 }))
  .then(({ url }) => {
      console.log(`Server ready at ${url}`);
  });
