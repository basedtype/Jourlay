export class twitchOptions {
    constructor(options) {
        if (options == null) return;

        this.debug = false;
        this.cluster = 'aws';
        this.reconnect = true;

        this.username = options.username;
        this.password = options.password;
        this.channels = options.channels;
    }
}

export class user {
    constructor(options) {
        if (options == null) return;

        this.username = options.username;
        this.sub = null;
        this.mod = 
        this.message = 0;
    }
}