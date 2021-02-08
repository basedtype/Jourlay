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
        password: 'oauth:q88yx70ba1uclc74xhxxv0lw3at9h7'
    },
    channels:['#jourloy'],
};

const client = new tmi.client(options);

client.channel = options.channels[0];
function onConnectedHandler() {
    client.color("OrangeRed");
    console.log('Yggdrassils => Twitch => Ready');
}
client.on('connected', onConnectedHandler);
client.connect();

/* EXPORTS */
module.exports.Yggdrasills = client;