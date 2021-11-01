export class BadDataException {
    private message: string[];

    constructor(message: string | string[]) {
        if (typeof message === 'string') {
            message = [message];
        }
        this.message = message;
    }

    getMessage(): string[] {
        return this.message;
    }
}
