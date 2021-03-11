/* IMPORTS */
const { db_manager } = require('./db_manager');
const { tools } = require('../Utils/tools');
const moment = require('moment');

/* CLASSES */
class warning {
    /**
     * Settings for warning module
     */
    static settings = {
        timeout: 600,
        value: 5,
        expire: tools.convertTime({days: 1}),
    }

    /**
     * Create a warning object
     * @param {string} sender 
     * @param {string?} reason
     * @param {{timeout: number, value: number, expire: number}?} settings
     */
    constructor(sender, settings, reason) {
        this.created_at = Math.floor(moment.now() / 1000);
        this.sender = sender;
        this.reason = reason || '';
        this.settings = settings || warning.settings;
    }

    /**
     * Gives people warnings before timing them out
     * @param {string} username
     * @param {string} sender
     * @param {string?} reason
     * @param {{timeout: number, value: number, expire: number}?} settings
     */
    static add(username, sender, settings, reason) {
        if (sender.toLowerCase() === 'jourloy_bot') sender = 'bot';
        if (sender.toLowerCase() === 'jourloy') sender = 'author';
        if (settings == null) settings = this.settings;

        const warning = new this(sender, settings, reason);
        db_manager.addWarning()
    }
}

/* EXPORTS */
module.exports.warning = warning;