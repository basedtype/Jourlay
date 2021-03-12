/* IMPORTS */
const { tools } = require('../Utils/tools');
const moment = require('moment');
const { db_manager } = require('./db_manager');

/* CLASSES */
class del {
    /**
     * Settings for delete module
     */
    static settings = {
        expire: tools.convertTime({hours: 12})
    }

    /**
     * Create delete object
     * @param {string} word 
     * @param {string} author 
     * @param {{expire: number}} settings 
     */
    constructor(word, author, settings) {
        this.created_at = Math.floor(moment.now() / 1000);
        this.author = author;
        this.word = word || '';
        this.settings = settings || del.settings;
    }

    /**
     * Add word in delete filter
     * @param {string} word 
     * @param {string} author 
     * @param {{expire: number}} settings 
     */
    static add(channel, word, author, settings) {
        if (sender.toLowerCase() === 'jourloy_bot') sender = 'bot';
        if (sender.toLowerCase() === 'jourloy') sender = 'author';
        if (settings == null) settings = this.settings;

        const del = new this(word, author, settings);
        db_manager.addDeletetWord(channel, del);
    }
}

class timeout {
    /**
     * Settings for timeout module
     */
    static settings = {
        timeout: 600,
        expire: tools.convertTime({hours: 12})
    }

    /**
     * Create timeout object
     * @param {string} word 
     * @param {string} author 
     * @param {{timeout: number, expire: number}} settings 
     */
    constructor(word, author, settings) {
        this.created_at = Math.floor(moment.now() / 1000);
        this.author = author;
        this.word = word || '';
        this.settings = settings || timeout.settings;
    }

    /**
     * Add word in timeout filter
     * @param {string} word 
     * @param {string} author 
     * @param {{timeout: number, expire: number}} settings 
     */
    static add(channel, word, author, settings) {
        if (sender.toLowerCase() === 'jourloy_bot') sender = 'bot';
        if (sender.toLowerCase() === 'jourloy') sender = 'author';
        if (settings == null) settings = this.settings;

        const timeout = new this(word, author, settings);
        db_manager.addTimeoutWord(channel, timeout);
    }
}

/* EXPORTS */
module.exports.del = del;
module.exports.timeout = timeout;