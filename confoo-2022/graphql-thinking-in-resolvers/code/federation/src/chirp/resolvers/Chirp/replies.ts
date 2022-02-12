import { Chirp } from '../../domain/Chirp';
import { ChirpContext } from '../../../dataSources/ChirpContext';

export function replies(
  { id }: Chirp,
  _arguments: null,
  { dataSources: { chirps } }: ChirpContext,
): Promise<Chirp[]> {
  return chirps.getByParent(id);
}
