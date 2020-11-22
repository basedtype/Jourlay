class userClass {
    constructor(options) {
        if (options == null) return;

        this.username = options.username;
        this.message = options.message || 0;
        this.channel = options.channel || null;
    }
}

module.exports.userClass = userClass;