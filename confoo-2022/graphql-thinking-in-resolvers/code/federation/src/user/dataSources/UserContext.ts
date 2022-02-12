import { User } from '../domain/User';

export interface UserContext {
  dataSources: UserDataSources;
}

export interface UserDataSource {
  create(username: string): Promise<User>;
  get(id: string): Promise<User | null>;
  exists(username: string): Promise<boolean>;
}

export interface UserDataSources {
  users: UserDataSource;
}
