import { makeServer } from '../src/server/makeServer';
import { TestClient } from './TestClient';
import { Chirp, UsageError } from './types';

describe('Chirp Scenarios', () => {
  const server = makeServer();
  const client = new TestClient();

  beforeAll(() =>
    server.listen({ port: 0 })
      .then(({ url }) => client.setUrl(url)));

  afterAll(() =>
    server.stop());

  it('user must be authenticated through headers', () =>
    expect(client.unauthenticated().chirp('a test')).rejects.toMatchObject({ message: 'Unauthenticated' }));

  it('user must exist', () =>
    expect(client.authenticated('none').chirp('a test')).rejects.toMatchObject({ message: 'Unauthenticated' }));

  describe('with an authenticated user', () => {
    beforeAll(() =>
      client.createUser('test')
        .then(({ user }) => client.authenticated(user.id)));

    it('must have contents', () =>
      client.chirp('')
        .then(({ chirp, errors }) => {
          expect(chirp).toBeNull();
          expect(errors).toContainEqual({
            __typename: 'EmptyContents',
            message: expect.any(String),
          });
        }));

    it('contents must not be longer than 100 characters', () =>
      client.chirp(new Array(102).join('a'))
        .then(({ chirp, errors }) => {
          expect(chirp).toBeNull();
          expect(errors).toContainEqual({
            __typename: 'TooLongContents',
            length: 101,
            maxLength: 100,
            message: expect.any(String),
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
        expect(chirp.author.chirps).toContainEqual(expect.objectContaining({ id: chirp.id, contents: chirp.contents })));
    });
  });
});
