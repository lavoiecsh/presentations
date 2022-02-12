import { User } from '../../../user/domain/User';
import { Chirp } from '../../domain/Chirp';
import { ChirpContext } from '../../dataSources/ChirpContext';

export function chirps(
  { id }: User,
  _arguments: null,
  { dataSources: { chirps } }: ChirpContext,
): Promise<Chirp[]> {
  return chirps.getByAuthor(id);
}
