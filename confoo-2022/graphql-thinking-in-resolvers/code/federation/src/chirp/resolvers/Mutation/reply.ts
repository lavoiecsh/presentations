import { Chirp } from '../../domain/Chirp';
import { ChirpNotFound, EmptyContents, TooLongContents, UsageError } from '../../../lib/resolvers/Mutation/errors';
import { AuthenticationError } from 'apollo-server';
import { ChirpContext } from '../../dataSources/ChirpContext';

interface ReplyInput {
  chirp: string;
  contents: string;
}

interface ReplyPayload {
  reply: Chirp | null;
  errors: UsageError[] | null;
}

export async function reply(
  _parent: null,
  { input: { chirp, contents } }: { input: ReplyInput },
  { user, dataSources: { chirps } }: ChirpContext,
): Promise<ReplyPayload> {
  if (!user)
    throw new AuthenticationError('Unauthenticated');

  const errors = await validateInput();
  if (errors.length)
    return { reply: null, errors };

  return chirps.create(user, contents, chirp)
    .then(reply => ({ reply, errors: null }));

  async function validateInput(): Promise<UsageError[]> {
    const errors = [];
    if (!contents.length)
      errors.push(new EmptyContents());

    if (contents.length > 100)
      errors.push(new TooLongContents(100, contents.length));

    if (!await chirps.get(chirp))
      errors.push(new ChirpNotFound(chirp));

    return errors;
  }
}
