/* CLASSES */
class tools {
    /**
     * Clear cli
     */
    static clear() {
        console.log('\u001B[2J');
    }

    /**
     * Convert time to ms
     * @param {{seconds?: number, minutes?:number, hours?:number, days?:number}} time
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

    /**
     * 
     * @param {number} min 
     * @param {number} max 
     */
     static randomInt(min, max) {
        min = Math.ceil(min);
        max = Math.floor(max);
        return Math.floor(Math.random() * (max - min + 1)) + min;
    }

    /**
     * 
     * @param {[string]} array 
     */
     static randomElementFromArray(array) {
        return array[this.randomInt(0, array.length-1)];
    }
}

/* EXPORTS */
module.exports.tools = tools;