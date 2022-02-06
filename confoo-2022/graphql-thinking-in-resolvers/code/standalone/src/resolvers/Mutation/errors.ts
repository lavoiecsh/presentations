export abstract class UsageError {
    readonly __typename: string;

    protected constructor(readonly message: string) {
        this.__typename = this.constructor.name;
    }
}

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
