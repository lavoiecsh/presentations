import { Chirp } from '../domain/Chirp';
import { Connection, PageRequest } from '../../lib/dataSources/pagination';

export interface ChirpContext {
  user: string;
  dataSources: ChirpDataSources;
}

export interface ChirpDataSource {
  create(authorId: string, contents: string, parentId?: string): Promise<Chirp>;
  get(chirpId: string): Promise<Chirp | null>;
  getByAuthor(authorId: string): Promise<Chirp[]>;
  getByParent(parentId: string): Promise<Chirp[]>;
  paginate(pageRequest: PageRequest): Promise<Connection<Chirp>>;
}

export interface ChirpDataSources {
  chirps: ChirpDataSource;
}
