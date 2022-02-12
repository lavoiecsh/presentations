import { User } from '../../../user/domain/User';
import { ChirpContext } from '../../../dataSources/ChirpContext';
import { Chirp } from '../../domain/Chirp';

export function chirps(
  { id }: User,
  _arguments: null,
  { dataSources: { chirps } }: ChirpContext,
): Promise<Chirp[]> {
  return chirps.getByAuthor(id);
}
