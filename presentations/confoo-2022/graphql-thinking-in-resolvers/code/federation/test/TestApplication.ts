import { ApolloServer } from 'apollo-server';
import { TestClient } from './TestClient';
import { User } from './types';
import { makeChirpServer } from '../src/chirp/server/makeChirpServer';
import { makeUserServer } from '../src/user/server/makeUserServer';
import { ServiceEndpointDefinition } from '@apollo/gateway';
import { makeGatewayServer } from '../src/gateway/makeGatewayServer';

export class TestApplication {
  private readonly chirpServer: ApolloServer;
  private readonly userServer: ApolloServer;
  private gatewayServer: ApolloServer;
  public readonly client: TestClient;

  constructor() {
    this.chirpServer = makeChirpServer();
    this.userServer = makeUserServer();
    this.gatewayServer = null;
    this.client = new TestClient();
  }

  start(): Promise<void> {
    const subgraphs: ServiceEndpointDefinition[] = [];
    return this.userServer.listen({ port: 0 })
      .then(({ url }) => subgraphs.push({ name: 'user', url }))
      .then(() => this.chirpServer.listen({ port: 0 }))
      .then(({ url }) => subgraphs.push({ name: 'chirp', url }))
      .then(() => this.gatewayServer = makeGatewayServer(subgraphs))
      .then(() => this.gatewayServer.listen({ port: 0 }))
      .then(({ url }) => this.client.setUrl(url))
      .then(() => {
      });
  }

  stop(): Promise<void> {
    return this.gatewayServer.stop()
      .then(() => this.chirpServer.stop())
      .then(() => this.userServer.stop());
  }

  createUserAndAuthenticateClient(username: string): Promise<User> {
    return this.client.createUser(username)
      .then(({ user }) => {
        this.client.authenticated(user.id);
        return user;
      });
  }
}
