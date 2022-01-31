import { DataSource } from 'apollo-datasource';
import { User } from '../domain/User';
import { UserDataSource } from './BlogDataSources';

export class UserInMemoryDataSource extends DataSource implements UserDataSource {
    private readonly users: User[];
    
    constructor() {
        super();
        this.users = [];
    }
    
    create(username: string): Promise<User> {
        const user = {
            id: (this.users.length + 1).toString(),
            username,
        };
        this.users.push(user);
        return Promise.resolve(user);
    }

    get(id: string): Promise<User | null> {
        return Promise.resolve(this.users.find(u => u.id === id));
    }
}
