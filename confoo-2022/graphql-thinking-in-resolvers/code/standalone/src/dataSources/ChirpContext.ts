import { User } from '../domain/User';
import { Chirp } from '../domain/Chirp';

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
  create(authorId: string, contents: string): Promise<Chirp>;
  getByAuthor(authorId: string): Promise<Chirp[]>;
}

export interface ChirpDataSources {
  users: UserDataSource;
  chirps: ChirpDataSource;
}
