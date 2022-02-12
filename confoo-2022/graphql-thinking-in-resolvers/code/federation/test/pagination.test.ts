import { TestClient } from './TestClient';
import { makeServer } from '../src/server/makeServer';
import { PageRequest } from './PageRequest';
import { Chirp } from './types';
import { Connection } from '../src/lib/dataSources/pagination';

describe('Chirp Pagination Scenarios', () => {
  const server = makeServer();
  const client = new TestClient();

  beforeAll(() =>
    server.listen({ port: 0 })
      .then(({ url }) => client.setUrl(url))
      .then(() => client.createUser('test'))
      .then(({ user: { id } }) => client.authenticated(id))
      .then(() => Promise.all(makeChirpContents(1, 15).map(c => client.chirp(c)))));

  afterAll(() =>
    server.stop());

  it('returns an empty connection if there are no chirps', () => {
    const s = makeServer();
    const c = new TestClient();
    return s.listen({ port: 0 })
      .then(({ url }) => c.setUrl(url))
      .then(() => c.queryChirps(new PageRequest()))
      .then(connection => {
        expect(connection.totalCount).toBe(0);
        expect(connection.pageInfo.hasPreviousPage).toBeFalsy();
        expect(connection.pageInfo.hasNextPage).toBeFalsy();
        expect(connection.pageInfo.startCursor).toBeNull();
        expect(connection.pageInfo.endCursor).toBeNull();
        expect(connection.nodes).toHaveLength(0);
      })
      .then(() => s.stop())
      .catch(error => {
        console.log(JSON.stringify(error));
      });
  });

  it('returns total count', () =>
    client.queryChirps(new PageRequest())
      .then(connection => expect(connection.totalCount).toBe(15)));

  it('returns first 10 chirps by default', () =>
    client.queryChirps(new PageRequest())
      .then(connection => expect(connection).toContainChirps(1, 10, true)));

  it('returns requested amount of chirps', () =>
    client.queryChirps(new PageRequest(5))
      .then(connection => expect(connection).toContainChirps(1, 5, true)));

  it('returns the second page', () =>
    client.queryChirps(new PageRequest(10, '10'))
      .then(connection => expect(connection).toContainChirps(11, 15, true)));

  it('returns the last page backwards', () =>
    client.queryChirps(new PageRequest(null, null, 10))
      .then(connection => expect(connection).toContainChirps(6, 15, false)));

  it('returns the second page backwards', () =>
    client.queryChirps(new PageRequest(null, null, 10, '6'))
      .then(connection => expect(connection).toContainChirps(1, 5, false)));

  it('returns an error if first is greater than 50', () =>
    expect(client.queryChirps(new PageRequest(51, null, null, null))).rejects.toMatchObject({ message: expect.stringMatching(/.*first.*50.*/i) }));

  it('returns an error if last is greater than 50', () =>
    expect(client.queryChirps(new PageRequest(null, null, 51, null))).rejects.toMatchObject({ message: expect.stringMatching(/.*last.*50.*/i) }));

  it('returns an error if first and last are set', () =>
    expect(client.queryChirps(new PageRequest(10, null, 10, null))).rejects.toMatchObject({ message: expect.stringMatching(/.*first.*last.*/i) }));

  it('returns an error if first and before are set', () =>
    expect(client.queryChirps(new PageRequest(10, null, null, '1'))).rejects.toMatchObject({ message: expect.stringMatching(/.*first.*before.*/i) }));

  it('returns an error if last and after are set', () =>
    expect(client.queryChirps(new PageRequest(null, '10', 10, null))).rejects.toMatchObject({ message: expect.stringMatching(/.*last.*after.*/i) }));

  it('returns an error if after and before are set', () =>
    expect(client.queryChirps(new PageRequest(null, '1', null, '10'))).rejects.toMatchObject({ message: expect.stringMatching(/.*after.*before.*/i) }));

  function makeChirpContents(from: number, to: number): string[] {
    return Array.from({ length: to - from + 1 }, (_, i) => `chirp # ${i + from}`);
  }

  expect.extend({
    toContainChirps(connection: Connection<Chirp>, from: number, to: number, forwards: boolean): jest.CustomMatcherResult {
      const fail = (message: string): jest.CustomMatcherResult => ({
        pass: false,
        message: () => `${message}\n\nReceived connection:\n${this.utils.printReceived(connection)}`,
      });

      const expectedHasPreviousPage = forwards ? from !== 1 : to !== 15;
      if (connection.pageInfo.hasPreviousPage !== expectedHasPreviousPage)
        return fail(`Expected hasPreviousPage to be ${expectedHasPreviousPage}, received ${connection.pageInfo.hasPreviousPage}`);

      const expectedHasNextPage = forwards ? to !== 15 : from !== 1;
      if (connection.pageInfo.hasNextPage !== expectedHasNextPage)
        return fail(`Expected hasNextPage to be ${expectedHasNextPage}, received ${connection.pageInfo.hasNextPage}`);

      const expectedStartCursor = forwards ? from : to;
      if (connection.pageInfo.startCursor !== expectedStartCursor.toString())
        return fail(`Expected startCursor to be ${expectedStartCursor}, received ${connection.pageInfo.startCursor}`);

      const expectedEndCursor = forwards ? to : from;
      if (connection.pageInfo.endCursor !== expectedEndCursor.toString())
        return fail(`Expected endCursor to be ${expectedEndCursor}, received ${connection.pageInfo.endCursor}`);

      const actualContents = connection.nodes.map(chirp => chirp.contents);
      const expectedContents = makeChirpContents(from, to);
      if (!forwards)
        expectedContents.reverse();
      if (actualContents.join(':') !== expectedContents.join(':'))
        return fail(`Expected nodes to contain ${expectedContents}, received ${actualContents}`);

      return { pass: true, message: () => '' };
    },
  });
});

declare global {
  namespace jest {
    interface Matchers<R> {
      toContainChirps(from: number, to: number, forwards: boolean): R;
    }
  }
}
