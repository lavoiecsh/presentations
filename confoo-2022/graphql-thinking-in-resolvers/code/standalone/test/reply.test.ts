import { Chirp, UsageError } from './types';
import { TestApplication } from './TestApplication';

const usernameParent = 'test';
const usernameChild = 'test2';

describe('Reply Scenarios', () => {
  const testApp = new TestApplication();
  let parent: Chirp;

  beforeAll(() =>
    testApp.start()
      .then(() => testApp.createUserAndAuthenticateClient(usernameParent))
      .then(() => testApp.client.chirp('parent'))
      .then(({ chirp }) => parent = chirp));

  afterAll(() =>
    testApp.stop());

  it('user must be authenticated through headers', () =>
    expect(testApp.client.unauthenticated().reply(parent.id, 'reply')).rejects.toMatchObject({ message: 'Unauthenticated' }));

  describe('with an authenticated user', () => {
    beforeAll(() =>
      testApp.createUserAndAuthenticateClient(usernameChild));

    it('must have contents', () =>
      testApp.client.reply(parent.id, '')
        .then(({ reply, errors }) => {
          expect(reply).toBeNull();
          expect(errors).toContainEqual({
            __typename: 'EmptyContents',
            message: expect.any(String),
          });
        }));

    it('contents must not be longer than 100 characters', () =>
      testApp.client.reply(parent.id, Array(102).join('a'))
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
      testApp.client.reply('none', 'test')
        .then(({ reply, errors }) => {
          expect(reply).toBeNull();
          expect(errors).toContainEqual({
            __typename: 'ChirpNotFound',
            chirpId: 'none',
            message: expect.any(String),
          });
        }));

    it('returns all errors at once', () =>
      testApp.client.reply('none', '')
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
        testApp.client.reply(parent.id, 'some test')
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
        expect(reply.author.username).toBe(usernameChild));

      it('references its parent', () =>
        expect(reply.parent.id).toBe(parent.id));

      it('its parent\'s replies contains itself', () =>
        expect(reply.parent.replies).toContainEqual(expect.objectContaining({ id: reply.id, contents: reply.contents })));

      it('is present in its author\'s chirps', () =>
        expect(reply.author.chirps).toContainEqual(expect.objectContaining({ id: reply.id })));
    });
  });
});
