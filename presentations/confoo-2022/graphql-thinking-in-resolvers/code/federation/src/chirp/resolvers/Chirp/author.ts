import { Chirp } from '../../domain/Chirp';
import { ChirpContext } from '../../dataSources/ChirpContext';

interface User {
  id: string;
}

export function author(
  { authorId }: Chirp,
  _arguments: null,
  _context: ChirpContext,
): Promise<User> {
  return Promise.resolve({ id: authorId });
}
