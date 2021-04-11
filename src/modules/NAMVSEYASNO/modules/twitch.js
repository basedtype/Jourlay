/* IMPORTS */
const { client } = require('../start');
const { DBmanager } = require('../../DBmanager');

/* CLASS */
class commands {
    static _adminCheckCommand(channel, userstate, command, message) {
        if (command === 'ping') {
            client.say(channel, 'pong');
            DBmanager._poolAddBlock('Twitch', 'NAMVSEYASNO', '!ping')
            return true;
        }
        else return false;
    }
}

client.on('message', (channel, userstate, message, self) => {
    if (self) return;
    const username = userstate['username'].toLowerCase();
    const messageSplit = message.split(' ');
    const msSplit = messageSplit[0].split('!');
    const command = msSplit[1];

    if (username === 'jourloy' || username === channel) {
        if (commands._adminCheckCommand(channel, userstate, command, message) === true) return;
    }
})