import { User } from '../domain/User';

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

}

export interface ChirpDataSources {
    users: UserDataSource;
    chirps: ChirpDataSource;
}
