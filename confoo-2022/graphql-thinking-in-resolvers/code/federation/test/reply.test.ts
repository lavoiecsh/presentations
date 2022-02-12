import { TestClient } from './TestClient';
import { makeServer } from '../src/server/makeServer';
import { Chirp, UsageError, User } from './types';

describe('Reply Scenarios', () => {
  const server = makeServer();
  const client = new TestClient();
  let user: User;
  let chirp: Chirp;

  beforeAll(() =>
    server.listen({ port: 0 })
      .then(({ url }) => client.setUrl(url))
      .then(() => client.createUser('test'))
      .then(payload => user = payload.user)
      .then(() => client.authenticated(user.id))
      .then(() => client.chirp('parent'))
      .then(payload => chirp = payload.chirp));

  afterAll(() =>
    server.stop());

  it('user must be authenticated through headers', () =>
    expect(client.unauthenticated().reply(chirp.id, 'reply')).rejects.toMatchObject({ message: 'Unauthenticated' }));

  describe('with an authenticated user', () => {
    beforeAll(() =>
      client.authenticated(user.id));

    it('must have contents', () =>
      client.reply(chirp.id, '')
        .then(({ reply, errors }) => {
          expect(reply).toBeNull();
          expect(errors).toContainEqual({
            __typename: 'EmptyContents',
            message: expect.any(String),
          });
        }));

    it('contents must not be longer than 100 characters', () =>
      client.reply(chirp.id, Array(102).join('a'))
        .then(({ reply, errors }) => {
          expect(reply).toBeNull();
          expect(errors).toContainEqual({
            __typename: 'TooLongContents',
            length: 101,
            maxLength: 100,
            message: expect.any(String),
          });
        }));

    it('must reference an existing chirp', () =>
      client.reply('none', 'test')
        .then(({ reply, errors }) => {
          expect(reply).toBeNull();
          expect(errors).toContainEqual({
            __typename: 'ChirpNotFound',
            chirpId: 'none',
            message: expect.any(String),
          });
        }));

    it('returns all errors at once', () =>
      client.reply('none', '')
        .then(({ reply, errors }) => {
          expect(reply).toBeNull();
          expect(errors).toContainEqual({
            __typename: 'EmptyContents',
            message: expect.any(String),
          });
          expect(errors).toContainEqual({
            __typename: 'ChirpNotFound',
            chirpId: 'none',
            message: expect.any(String),
          });
        }));

    describe('on successful creation', () => {
      let reply: Chirp;
      let errors: UsageError[];

      beforeAll(() =>
        client.reply(chirp.id, 'some test')
          .then(payload => {
            reply = payload.reply;
            errors = payload.errors;
          }));

      it('returns no errors', () =>
        expect(errors).toBeNull());

      it('is given an identifier', () =>
        expect(reply.id).toBeDefined());

      it('has no replies', () =>
        expect(reply.replies).toHaveLength(0));

      it('has an author', () =>
        expect(reply.author.username).toBe(user.username));

      it('references its parent', () =>
        expect(reply.parent.id).toBe(chirp.id));

      it('its parent\'s replies contains itself', () =>
        expect(reply.parent.replies).toContainEqual(expect.objectContaining({ id: reply.id, contents: reply.contents })));

      it('is present in its author\'s chirps', () =>
        expect(reply.author.chirps).toContainEqual(expect.objectContaining({ id: reply.id })));
    });
  });
});
