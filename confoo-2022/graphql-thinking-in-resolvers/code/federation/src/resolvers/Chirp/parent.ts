import { Chirp } from '../../domain/Chirp';
import { ChirpContext } from '../../dataSources/ChirpContext';

export function parent(
  { parentId }: Chirp,
  _arguments: null,
  { dataSources: { chirps } }: ChirpContext,
): Promise<Chirp | null> {
  return parentId ? chirps.get(parentId) : null;
}
