/* IMPORTS */

/* ERROR */

/* PARAMS */
const errors = {
    ERR_NOT_FIND_USER: 'ERR_NOT_FIND_USER',
    ERR_USER_ALREADY_EXIST: 'ERR_USER_ALREADY_EXIST',
    ERR_NOT_ENOUGH_SHARDS: 'ERR_NOT_ENOUGH_SHARDS',
    ERR_ALREADY_IN_RAID: 'ERR_ALREADY_IN_RAID',
    ERR_USER_IN_REST: 'ERR_USER_IN_REST',
    ERR_USER_NOT_IN_FRACTION: '',
}

/* FUNCTIONS */

/* INTERVALS */

/* CLASSES */

class Tools {
    static errorHandler(func, options) {
        try { return func(options) }
        catch (error) { return error }
    }

    static randomInt(min, max) {
        min = Math.ceil(min);
        max = Math.floor(max);
        return Math.floor(Math.random() * (max - min + 1)) + min;
    }

    /**
     * Convert time to ms
     * @param {String} time DD:HH:MM:SS 
     */
    static convertTime(time) {
        const seconds = time.seconds || 0;
        const minutes = time.minutes || 0;
        const hours = time.hours || 0;
        const days = time.days || 0;
        let total = 0;

        total += days*24*60*60;
        total += hours*60*60;
        total += minutes*60;
        total += seconds;

        return total*1000;
    }
}

/* EXPORTS */

module.exports.tools = Tools;
module.exports.errors = errors;