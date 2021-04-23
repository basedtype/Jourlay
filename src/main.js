/**
 * Main file of Twitch bot
 */

/* IMPORTS */
require('./modules/server/server')
require('./modules/tools/discord');
//require('./modules/miner')
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

