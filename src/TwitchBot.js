const tmi = require('tmi.js');
var fetch = require('node-fetch');

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
const client = new tmi.client(options);
function onConnectedHandler() {
    client.color("Red");
    client.action(options.channels[0], ` приземляется в чат.`);
}
client.on('connected', onConnectedHandler);
client.connect();

async function getData() {
    const response = await fetch("https://api.twitch.tv/kraken/158466757", {
        method: 'GET',
        headers: {
            "Client-ID": "69e97d9c5613b9a139a004b305ab590c"
        },
    });
    return response.json(); // parses JSON response into native JavaScript objects
}
exports.start = () => client;
exports.getChannelName = () => options.channels[0];
exports.getBotName = () => options.identity.username;
exports.uptime = () => {
    const data = getData();
    data.on('end', (response) => console.log(response))
}
