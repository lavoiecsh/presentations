export abstract class UsageError {
    readonly __typename: string;

    protected constructor(readonly message: string) {
        this.__typename = this.constructor.name;
    }
}
