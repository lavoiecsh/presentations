import { DataSource } from 'apollo-datasource';
import { Chirp } from '../domain/Chirp';
import { Connection, PageRequest } from '../../dataSources/pagination';
import { ChirpDataSource } from './ChirpContext';

export class ChirpInMemoryDataSource extends DataSource implements ChirpDataSource {
  private readonly chirps: Chirp[];

  constructor() {
    super();
    this.chirps = [];
  }

  create(authorId: string, contents: string, parentId: string = null): Promise<Chirp> {
    const chirp: Chirp = {
      id: (this.chirps.length + 1).toString(),
      authorId,
      date: new Date(),
      parentId,
      contents,
    };
    this.chirps.push(chirp);
    return Promise.resolve(chirp);
  }

  get(chirpId: string): Promise<Chirp | null> {
    return Promise.resolve(this.chirps.find(c => c.id === chirpId));
  }

  getByAuthor(authorId: string): Promise<Chirp[]> {
    return Promise.resolve(this.chirps.filter(c => c.authorId === authorId));
  }

  getByParent(parentId: string): Promise<Chirp[]> {
    return Promise.resolve(this.chirps.filter(c => c.parentId === parentId));
  }

  paginate(pageRequest: PageRequest): Promise<Connection<Chirp>> {
    if (!this.chirps.length)
      return Promise.resolve(new Connection([], { hasPreviousPage: false, hasNextPage: false, startCursor: null, endCursor: null }, () => Promise.resolve(0)));

    const copy = this.chirps.map(c => ({ ...c }));
    if (pageRequest.last || pageRequest.before)
      copy.reverse();

    const max = copy.length;
    const first = pageRequest.first ?? pageRequest.last ?? 10;
    const after = pageRequest.after ?? pageRequest.before ?? null;
    const start = after ? copy.map(c => c.id).indexOf(after) + 1 : 0;
    const end = start + first < max ? start + first : max;

    return Promise.resolve(new Connection(
      copy.slice(start, end),
      {
        hasPreviousPage: start != 0,
        hasNextPage: end != max,
        startCursor: copy[start].id,
        endCursor: copy[end - 1].id,
      },
      () => Promise.resolve(this.chirps.length),
    ));
  }
}
