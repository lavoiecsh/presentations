import { DataSource } from 'apollo-datasource';
import { ChirpDataSource } from './ChirpContext';
import { Chirp } from '../domain/Chirp';

export class ChirpInMemoryDataSource extends DataSource implements ChirpDataSource {
  private readonly chirps: Chirp[];

  constructor() {
    super();
    this.chirps = [];
  }

  create(authorId: string, contents: string): Promise<Chirp> {
    const chirp: Chirp = {
      id: (this.chirps.length + 1).toString(),
      authorId,
      parentId: null,
      contents,
    };
    this.chirps.push(chirp);
    return Promise.resolve(chirp);
  }

  getByAuthor(authorId: string): Promise<Chirp[]> {
    return Promise.resolve(this.chirps.filter(c => c.authorId === authorId));
  }
}
