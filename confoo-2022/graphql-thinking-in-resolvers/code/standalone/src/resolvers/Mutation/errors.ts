export abstract class UsageError {
    readonly __typename: string;
    
    constructor(readonly message: string) {
        this.__typename = this.constructor.name;
    }
}

export class UnknownBlogError extends UsageError {
    constructor(readonly blog: string) {
        super(`Blog with id ${blog} not found`);
    }
}

export class EmptyUsernameError extends UsageError {
    constructor() {
        super('Username cannot be empty');
    }
}

export class EmptyTitleError extends UsageError {
    constructor() {
        super('Title cannot be empty');
    }
}

export class EmptyContentsError extends UsageError {
    constructor() {
        super('Contents canno be empty');
    }
}
