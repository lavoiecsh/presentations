import { UserContext } from '../../dataSources/UserContext';
import { User } from '../../domain/User';

export interface UserKey {
  id: string;
}

export function __resolveReference(
  { id }: UserKey,
  { dataSources: { users } }: UserContext,
): Promise<User> {
  return users.get(id);
}
