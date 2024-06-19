import { ChirpContext } from '../../dataSources/ChirpContext';
import { Connection, PageRequest } from '../../dataSources/pagination';
import { Chirp } from '../../domain/Chirp';
import { UserInputError } from 'apollo-server-errors';

export function chirps(
  _parent: null,
  pageRequest: PageRequest,
  { dataSources: { chirps } }: ChirpContext
): Promise<Connection<Chirp>> {
  if (pageRequest.first > 50)
    throw new UserInputError('First cannot be greater than 50');

  if (pageRequest.last > 50)
    throw new UserInputError('Last cannot be greater than 50');

  if (pageRequest.first && pageRequest.last)
    throw new UserInputError('First and Last cannot be set at the same time');

  if (pageRequest.first && pageRequest.before)
    throw new UserInputError('First and Before cannot be set at the same time');

  if (pageRequest.last && pageRequest.after)
    throw new UserInputError('Last and After cannot be set at the same time');

  if (pageRequest.after && pageRequest.before)
    throw new UserInputError('After and Before cannot be set at the same time');

  return chirps.paginate(pageRequest);
}
