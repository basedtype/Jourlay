/* IMPORTS */
const tmi = require('tmi.js');
const config = require('./config');

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
        password: config.jourloy_bot,
    },
    channels:['#jourloy'],
};

const client = new tmi.client(options);

client.channel = options.channels[0];
function onConnectedHandler() {
    client.color("OrangeRed");
    console.log('Twitch => Jourloy_bot => Ready');
}
client.on('connected', onConnectedHandler);
client.connect();

/* EXPORTS */
module.exports.client = client;