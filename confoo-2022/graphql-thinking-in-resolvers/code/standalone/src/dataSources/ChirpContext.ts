import { User } from '../domain/User';
import { Chirp } from '../domain/Chirp';
import { Connection, PageRequest } from './pagination';

export interface ChirpContext {
  user: string;
  dataSources: ChirpDataSources;
}

export interface UserDataSource {
  create(username: string): Promise<User>;
  get(id: string): Promise<User | null>;
  exists(username: string): Promise<boolean>;
}

export interface ChirpDataSource {
  create(authorId: string, contents: string, parentId?: string): Promise<Chirp>;
  get(chirpId: string): Promise<Chirp | null>;
  getByAuthor(authorId: string): Promise<Chirp[]>;
  getByParent(parentId: string): Promise<Chirp[]>;
  paginate(pageRequest: PageRequest): Promise<Connection<Chirp>>;
}

export interface ChirpDataSources {
  users: UserDataSource;
  chirps: ChirpDataSource;
}
