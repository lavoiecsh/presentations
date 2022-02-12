import { Chirp } from '../../domain/Chirp';
import { ChirpContext } from '../../../dataSources/ChirpContext';
import { User } from '../../../user/domain/User';

export function author(
  { authorId }: Chirp,
  _arguments: null,
  { dataSources: { users } }: ChirpContext,
): Promise<User> {
  return users.get(authorId);
}
