import { Chirp } from '../../domain/Chirp';
import { ChirpContext } from '../../../dataSources/ChirpContext';
import { UserInputError } from 'apollo-server-errors';

export function chirp(
  _parent: null,
  { id }: { id: string },
  { dataSources: { chirps } }: ChirpContext,
): Promise<Chirp> {
  return chirps.get(id)
    .then(chirp => chirp || Promise.reject(new UserInputError(`Chirp with id ${id} not found`)));
}
