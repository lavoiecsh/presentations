import { User } from '../../domain/User';
import { EmptyUsername, InvalidUsername, UsageError, UsernameTaken } from '../../../lib/resolvers/Mutation/errors';
import { UserContext } from '../../dataSources/UserContext';

interface CreateUserInput {
  username: string;
}

interface CreateUserPayload {
  user: User | null;
  errors: UsageError[] | null;
}

export async function createUser(
  _parent: null,
  { input: { username } }: { input: CreateUserInput },
  { dataSources: { users } }: UserContext,
): Promise<CreateUserPayload> {
  const errors = await validateUsername();
  if (errors.length)
    return { user: null, errors };

  return users.create(username)
    .then(user => ({ user, errors: null }));

  async function validateUsername(): Promise<UsageError[]> {
    const errors = [];
    if (!username.length)
      errors.push(new EmptyUsername());

    if (username.match(/\s/))
      errors.push(new InvalidUsername(username));

    if (await users.exists(username))
      errors.push(new UsernameTaken(username));

    return errors;
  }
}
