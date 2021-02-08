/* IMPORTS */
const tmi = require('tmi.js');
const { Game } = require('../../Game/Game');

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
        password: 'oauth:ex8khmzv6549l2mmvlrvzjuu80a5ys'
    },
    channels:['#jourloy'],
};

const client = new tmi.client(options);

client.channel = options.channels[0];
function onConnectedHandler() {
    client.color("OrangeRed");
    console.log('Twitch => Admin => Ready');
    Game.repair(client);

}
client.on('connected', onConnectedHandler);
client.connect();

/* EXPORTS */
module.exports.client = client;