import { UsageError } from '../../../lib/resolvers/Mutation/errors';

export class EmptyUsername extends UsageError {
  constructor() {
    super('Username cannot be empty');
  }
}

export class InvalidUsername extends UsageError {
  constructor(readonly username: string) {
    super('Username must not contain whitespace characters');
  }
}

export class UsernameTaken extends UsageError {
  constructor(readonly username: string) {
    super('Username is already taken');
  }
}
