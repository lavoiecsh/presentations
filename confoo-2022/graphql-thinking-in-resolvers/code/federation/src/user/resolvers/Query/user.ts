import { UserInputError } from 'apollo-server-errors';

import { User } from '../../domain/User';
import { UserContext } from '../../dataSources/UserContext';

export function user(
  _parent: null,
  { id }: { id: string },
  { dataSources: { users } }: UserContext,
): Promise<User> {
  return users.get(id)
    .then(user => user || Promise.reject(new UserInputError(`User with id ${id} not found`)));
}
