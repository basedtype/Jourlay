/* IMPORTS */
const tmi = require('tmi.js');
const { Game } = require('../Game/Game');

/* TWITCH SETTINGS */
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
        password: 'oauth:ma45szd5jerjrbrjfhbjfjik77jwll'
    },
    channels:['#jourloy'],
};

const client = new tmi.client(options);

client.channel = options.channels[0];
function onConnectedHandler() {
    client.color("OrangeRed");
    console.log('JapanBank => Twitch => Ready');
    Game.repair(client);
}
client.on('connected', onConnectedHandler);
client.connect();

/* EXPORTS */
module.exports.JapanBank = client;