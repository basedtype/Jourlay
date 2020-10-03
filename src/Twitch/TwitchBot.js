const tmi = require('tmi.js');
const tools = require('../Tools/tools')

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

/**
 * Send {text} in chat
 * @param {String} text 
 */
exports.say = function(text) {
    try {
        client.say(channelName, text)
        return 0;
    } catch { return -1 };
}

/**
 * Send {test} in chat as action
 * @param {String} text 
 */
exports.action = function(text) {
    try {
        client.action(channelName, text)
        return 0;
    } catch { return -1 };
}

/**
 * Timeout {username} at {length}s
 * @param {String} username 
 * @param {Number} length 
 */
exports.timeout = function(username, length) {
    try {
        client.timeout(channelName, username, length, 'Таймаут через команду бота');
        return 0;
    } catch { return -1 };
}

/**
 * Ban {username}
 * @param {String} username 
 * @param {String} reason 
 */
exports.ban = function(username, reason) {
    try {
        client.ban(channelName, username, reason);
        return 0;
    } catch { return -1 };
}

/**
 * Clear chat
 */
exports.clearChat = function() {
    try {
        client.clear(channelName);
        return 0;
    } catch { return -1 };
}