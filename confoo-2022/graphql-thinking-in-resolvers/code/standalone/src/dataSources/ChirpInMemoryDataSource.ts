import { DataSource } from 'apollo-datasource';
import { ChirpDataSource } from './ChirpContext';
import { Chirp } from '../domain/Chirp';

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
}
