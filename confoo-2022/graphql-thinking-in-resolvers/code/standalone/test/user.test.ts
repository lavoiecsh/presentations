import { makeServer } from '../src/server/makeServer';
import { UsageError, User } from './types';
import { TestClient } from './TestClient';

describe('User Scenarios', () => {
  const server = makeServer();
  const client = new TestClient();

  beforeAll(() =>
    server.listen({ port: 0 })
      .then(({ url }) => client.unauthenticated().setUrl(url)));

  afterAll(() =>
    server.stop());

  it('users must have a non-empty username', () =>
    client.createUser('')
      .then(payload => {
        expect(payload.user).toBeNull();
        expect(payload.errors).toHaveLength(1);
        const error = payload.errors[0];
        expect(error.__typename).toBe('EmptyUsername');
        expect(error.message).toBeDefined();
      }));

  it('doesn\'t allow spaces in the username', () =>
    client.createUser('some username')
      .then(payload => {
        expect(payload.user).toBeNull();
        expect(payload.errors).toHaveLength(1);
        const error = payload.errors[0];
        expect(error.__typename).toBe('InvalidUsername');
        expect(error.message).toBeDefined();
      }));

  it('doesn\'t allow multiple users to have the same username', () =>
    client.createUser('foobar')
      .then(() => client.createUser('foobar'))
      .then(payload => {
        expect(payload.user).toBeNull();
        expect(payload.errors).toHaveLength(1);
        const error = payload.errors[0];
        expect(error.__typename).toBe('UsernameTaken');
        expect(error.message).toBeDefined();
      }));

  describe('new users', () => {
    let user: User;
    let errors: UsageError[];

    beforeAll(() =>
      client.createUser('test')
        .then(payload => {
          user = payload.user;
          errors = payload.errors;
        }));

    it('returns no errors on creation', () =>
      expect(errors).toBeNull());

    it('are given identifiers', () =>
      expect(user.id).toBeDefined());

    it('have the requested username', () =>
      expect(user.username).toBe('test'));

    it('have written no chirps', () =>
      expect(user.chirps).toHaveLength(0));

    it('can be queried by it\'s identifier', () =>
      client.queryUser(user.id)
        .then(queriedUser => {
          expect(queriedUser.id).toBe(user.id);
          expect(queriedUser.username).toBe(user.username);
          expect(queriedUser.chirps).toHaveLength(0);
        }));
  });
});
