import { Chirp, UsageError } from './types';
import { TestApplication } from './TestApplication';

const username = 'test';

describe('Chirp Scenarios', () => {
  const testApp = new TestApplication();

  beforeAll(() =>
    testApp.start());

  afterAll(() =>
    testApp.stop());

  it('user must be authenticated through headers', () =>
    expect(testApp.client.unauthenticated().chirp('a test')).rejects.toMatchObject({ message: 'Unauthenticated' }));

  it('returns not found if the chirp doesn\'t exist', () =>
    expect(testApp.client.queryChirp('none')).rejects.toMatchObject({ message: 'Chirp with id none not found' }));

  describe('with an authenticated user', () => {
    beforeAll(() =>
      testApp.createUserAndAuthenticateClient(username));

    it('must have contents', () =>
      testApp.client.chirp('')
        .then(({ chirp, errors }) => {
          expect(chirp).toBeNull();
          expect(errors).toContainEqual({
            __typename: 'EmptyContents',
            message: expect.any(String),
          });
        }));

    it('contents must not be longer than 100 characters', () =>
      testApp.client.chirp(new Array(102).join('a'))
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
        testApp.client.chirp('some test')
          .then(payload => {
            chirp = payload.chirp;
            errors = payload.errors;
          }));

      it('returns no errors', () =>
        expect(errors).toBeNull());

      it('is given an identifier', () =>
        expect(chirp.id).toBeDefined());

      it('has a publication date', () =>
        expect(new Date().getTime() - new Date(chirp.date).getTime()).toBeLessThan(500));

      it('has no replies', () =>
        expect(chirp.replies).toHaveLength(0));

      it('has an author', () =>
        expect(chirp.author.username).toBe(username));

      it('its author\'s chirps contains itself', () =>
        expect(chirp.author.chirps).toContainEqual(expect.objectContaining({
          id: chirp.id,
          contents: chirp.contents,
        })));

      it('can be queried', () =>
        testApp.client.queryChirp(chirp.id)
          .then(queriedChirp => {
            expect(queriedChirp).toMatchObject(chirp);
          }));
    });

  });
});
