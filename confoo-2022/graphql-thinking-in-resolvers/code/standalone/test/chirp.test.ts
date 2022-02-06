import { makeServer } from '../src/server/makeServer';
import { TestClient } from './TestClient';
import { createHttpLink } from '@apollo/client/core';
import fetch from 'cross-fetch';
import { setContext } from '@apollo/client/link/context';
import { Chirp, UsageError } from './types';

describe('Chirp Scenarios', () => {
  const server = makeServer();
  const client = new TestClient();

  beforeAll(() =>
    server.listen({ port: 0 })
      .then(({ url }) => client.setLink(createHttpLink({ uri: url, fetch }))));

  afterAll(() =>
    server.stop());

  it('user must be authenticated through headers', () =>
    expect(client.chirp('a test')).rejects.toMatchObject({ message: 'Unauthenticated' }));

  describe('with an authenticated user', () => {
    beforeAll(() =>
      client.createUser('test')
        .then(({ user }) => client.setLink(setContext((_, { headers }) => ({
          ...headers,
          authorization: user.id,
        })).concat(client.link))));

    it('must have contents', () =>
      client.chirp('')
        .then(({ chirp, errors }) => {
          expect(chirp).toBeNull();
          expect(errors).toContain({
            __typename: 'EmptyContents',
          });
        }));

    it('contents must not be longer than 100 characters', () =>
      client.chirp(new Array(101).join('a'))
        .then(({ chirp, errors }) => {
          expect(chirp).toBeNull();
          expect(errors).toContain({
            __typename: 'TooLongContents',
            length: 101,
            maxLength: 100,
          });
        }));

    describe('on successful creation', () => {
      let chirp: Chirp;
      let errors: UsageError[];

      beforeAll(() =>
        client.chirp('some test')
          .then(payload => {
            chirp = payload.chirp;
            errors = payload.errors;
          }));

      it('returns no errors', () =>
        expect(errors).toBeNull());

      it('is given an identifier', () =>
        expect(chirp.id).toBeDefined());

      it('has no replies', () =>
        expect(chirp.replies).toHaveLength(0));

      it('has an author', () =>
        expect(chirp.author.username).toBe('test'));

      it('its author\'s chirps contains itself', () =>
        expect(chirp.author.chirps).toContain(expect.objectContaining({ id: chirp.id, contents: chirp.contents })));
    });
  });
});
