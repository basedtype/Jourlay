const tmi = require('tmi.js');
const { _tool } = require('../tools');

const options = {
    options: {
        debug: false
    },
    connection: {
        cluster: 'aws',
        reconnect: true
    },
    identity: {
        username: 'jourlay',
        password: 'oauth:q88yx70ba1uclc74xhxxv0lw3at9h7'
    },
    channels:['#jourloy'],
};

const client = new tmi.client(options);

client.channel = options.channels[0];
client.botName = options.identity.username;
client.lang = 'ru';
function onConnectedHandler() {
    client.color("BlueViolet");
    _tool.clearCli();
    console.log('>> Bot ready');
}
client.on('connected', onConnectedHandler);
client.connect();

class twitch {
    static ban(username) {
        client.ban(client.channel, username, '[ JOURLAY ]');
    }

    static timeout(username, length = 30) {
        client.timeout(client.channel, username, length, '[ JOURLAY ]');
    }

    static isMod(userstate) {
        const username = userstate['display-name'].toLowerCase();
        if (userstate.mod === true || `#${username}` === client.channel) return true;
        else return false;
    }
}

module.exports.client = client;
module.exports.twitch = twitch;