const tmi = require('tmi.js');
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
    const array = ['передает всем привет', 'запускает свой нейронный мозг', 'приземляется в чат', 'готовит себе покушать', 'пересчитывает фолловеров', 'потерялся в космосе']
    client.color("Red");
    //client.action(options.channels[0], ` ${array[tools.RandomInt(0, array.length-1)]}.`);
}
client.on('connected', onConnectedHandler);
client.connect();

exports.start = () => client;
exports.getChannelName = () => channelName;
exports.getBotName = () => botName;

exports.say = function(text) {
    try {
        client.say(channelName, text)
        return 0;
    } catch {
        console.log(`[BOT ERROR] Can't say message: ${text}`)
        return -1 
    }
}
exports.action = function(text) {
    try {
        client.action(channelName, text)
        return 0;
    } catch {
        console.log(`[BOT ERROR] Can't action message: ${text}`)
        return -1 
    }
}

exports.timeout = function(username, length) {
    try {
        client.timeout(channelName, username, length, 'Таймаут через команду бота');
        return 0;
    } catch {
        return -1;
    }
}

exports.ban = function(username) {
    try {
        client.ban(channelName, username, 'Таймаут через команду бота');
        return 0;
    } catch {
        return -1;
    }
}