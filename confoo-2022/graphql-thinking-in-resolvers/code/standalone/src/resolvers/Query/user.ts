import { UserInputError } from 'apollo-server-errors';

import { User } from '../../domain/User';
import { BlogContext } from '../../dataSources/BlogContext';

export function user(
    _parent: null, // parent
    { id }: { id: string }, // arguments
    { dataSources: { users } }: BlogContext, // context
): Promise<User> {
    return users.get(id)
        .then(user => user || Promise.reject(new UserInputError(`User with id ${id} not found`)));
}
