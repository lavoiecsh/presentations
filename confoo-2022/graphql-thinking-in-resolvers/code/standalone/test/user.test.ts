import { UsageError, User } from './types';
import { TestApplication } from './TestApplication';

describe('User Scenarios', () => {
  const testApp = new TestApplication();

  beforeAll(() =>
    testApp.start());

  afterAll(() =>
    testApp.stop());

  it('users must have a non-empty username', () =>
    testApp.client.createUser('')
      .then(payload => {
        expect(payload.user).toBeNull();
        expect(payload.errors).toHaveLength(1);
        const error = payload.errors[0];
        expect(error.__typename).toBe('EmptyUsername');
        expect(error.message).toBeDefined();
      }));

  it('doesn\'t allow spaces in the username', () =>
    testApp.client.createUser('some username')
      .then(payload => {
        expect(payload.user).toBeNull();
        expect(payload.errors).toHaveLength(1);
        const error = payload.errors[0];
        expect(error.__typename).toBe('InvalidUsername');
        expect(error.message).toBeDefined();
      }));

  it('doesn\'t allow multiple users to have the same username', () =>
    testApp.client.createUser('foobar')
      .then(() => testApp.client.createUser('foobar'))
      .then(payload => {
        expect(payload.user).toBeNull();
        expect(payload.errors).toHaveLength(1);
        const error = payload.errors[0];
        expect(error.__typename).toBe('UsernameTaken');
        expect(error.message).toBeDefined();
      }));

  it('returns not found if the user doesn\'t exist', () =>
    expect(testApp.client.queryUser('none')).rejects.toMatchObject({ message: 'User with id none not found' }));

  describe('new users', () => {
    let user: User;
    let errors: UsageError[];

    beforeAll(() =>
      testApp.client.createUser('test')
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
      testApp.client.queryUser(user.id)
        .then(queriedUser => {
          expect(queriedUser.id).toBe(user.id);
          expect(queriedUser.username).toBe(user.username);
          expect(queriedUser.chirps).toHaveLength(0);
        }));
  });
});
