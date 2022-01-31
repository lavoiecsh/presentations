import { User } from '../../domain/User';
import { BlogContext } from '../../dataSources/BlogContext';
import { UsageError, EmptyUsernameError } from './errors';

interface CreateUserInput {
    username: string;
}

interface CreateUserPayload {
    user: User | null;
    errors: UsageError[] | null;
}

export function createUser(
    _: null, // parent
    { input: { username } }: { input: CreateUserInput }, // arguments
    { dataSources: { users } }: BlogContext, // context
): Promise<CreateUserPayload> {
    if (!username.length)
        return Promise.resolve({ user: null, errors: [new EmptyUsernameError()] });

    return users.create(username)
        .then(user => ({ user, errors: null }));
}
