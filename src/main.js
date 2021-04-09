/**
 * Main file of Twitch bot
 */

/* IMPORTS */
require('./modules/NAMVSEYASNO/start');
require('./modules/miner')
require('./modules/server')
const { colors } = require('./modules/colors');

/* PARAMETERS */
global.pool = [];

/* CODE */

/* CLASSES */
class main {
    static logs = [];
    static twitch = {
        commands: false,
        defence: false,
    };
    static discord = {
        voices: false,
        defence: false,
        
    };

    static run() {

    }
}

