import { UserInputError } from 'apollo-server-errors';

import { User } from '../../domain/User';
import { ChirpContext } from '../../../dataSources/ChirpContext';

export function user(
  _parent: null,
  { id }: { id: string },
  { dataSources: { users } }: ChirpContext,
): Promise<User> {
  return users.get(id)
    .then(user => user || Promise.reject(new UserInputError(`User with id ${id} not found`)));
}
