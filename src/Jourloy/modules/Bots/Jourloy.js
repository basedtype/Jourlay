/* IMPORTS */
const tmi = require('tmi.js');

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
        password: 'oauth:gldj2haidimdkixeu3cax939a7wq2e'
    },
    channels:['#jourloy'],
};

const client = new tmi.client(options);

client.channel = options.channels[0];
function onConnectedHandler() {
    console.log('Twitch => Jourloy_bot => Ready');
}
client.on('connected', onConnectedHandler);
client.connect();

/* EXPORTS */
module.exports.admin = client;