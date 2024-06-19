import { ApolloServer } from 'apollo-server';
import { TestClient } from './TestClient';
import { makeServer } from '../src/server/makeServer';
import { User } from './types';

export class TestApplication {
  private readonly server: ApolloServer;
  public readonly client: TestClient;

  constructor() {
    this.server = makeServer();
    this.client = new TestClient();
  }

  start(): Promise<void> {
    return this.server.listen({ port: 0 })
      .then(({ url }) => this.client.setUrl(url))
      .then(() => {
      });
  }

  stop(): Promise<void> {
    return this.server.stop();
  }

  createUserAndAuthenticateClient(username: string): Promise<User> {
    return this.client.createUser(username)
      .then(({ user }) => {
        this.client.authenticated(user.id);
        return user;
      });
  }
}
