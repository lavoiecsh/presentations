import { UsageError } from '../../../lib/resolvers/Mutation/errors';

export class EmptyContents extends UsageError {
  constructor() {
    super('Contents cannot be empty');
  }
}

export class TooLongContents extends UsageError {
  constructor(readonly maxLength: number, readonly length: number) {
    super(`Contents cannot exceed ${maxLength}`);
  }
}

export class ChirpNotFound extends UsageError {
  constructor(readonly chirpId: string) {
    super('Chirp not found');
  }
}
