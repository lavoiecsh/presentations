import { Chirp } from '../../domain/Chirp';
import { AuthenticationError } from 'apollo-server';
import { ChirpContext } from '../../dataSources/ChirpContext';
import { UsageError } from '../../../lib/resolvers/Mutation/errors';
import { EmptyContents, TooLongContents } from './errors';

interface ChirpInput {
  contents: string;
}

interface ChirpPayload {
  chirp: Chirp | null;
  errors: UsageError[] | null;
}

export async function chirp(
  _parent: null,
  { input: { contents } }: { input: ChirpInput },
  { user, dataSources: { chirps } }: ChirpContext,
): Promise<ChirpPayload> {
  if (!user)
    throw new AuthenticationError('Unauthenticated');

  const errors = await validateContents();
  if (errors.length)
    return { chirp: null, errors };

  return chirps.create(user, contents)
    .then(chirp => ({ chirp, errors: null }));

  async function validateContents(): Promise<UsageError[]> {
    const errors = [];
    if (!contents.length)
      errors.push(new EmptyContents());

    if (contents.length > 100)
      errors.push(new TooLongContents(100, contents.length));

    return errors;
  }
}
