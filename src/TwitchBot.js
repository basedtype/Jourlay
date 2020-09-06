const tmi = require('tmi.js');
const fetch = require('node-fetch');
const tools = require('./tools')

const options = {
    options: {
        debug: false
    },
    connection: {
        cluster: 'aws',
        reconnect: true
    },
    identity: {
        username: 'JOURLAY',
        password: 'oauth:q88yx70ba1uclc74xhxxv0lw3at9h7'
    },
    channels: ['jourloy']
};
const channelName = options.channels[0];
const botName = options.identity.username;
const client = new tmi.client(options);
function onConnectedHandler() {
    client.color("Red");
    client.action(options.channels[0], ` приземляется в чат.`);
}
client.on('connected', onConnectedHandler);
client.connect();

exports.start = () => client;
exports.getChannelName = () => channelName;
exports.getBotName = () => botName;