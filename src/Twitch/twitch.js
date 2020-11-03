const tmi = require('tmi.js');
const { JsonDB } = require('node-json-db');

var nodeDB = new JsonDB('Data/chatters', true, true, '/');

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
    console.log('>> Bot ready')
}

client.on('connected', onConnectedHandler);
client.connect();

/**
 * @return {{}} client
 */
exports.start = () => client;

/**
 * @return {String} channelName
 */
exports.getChannelName = () => channelName;

/**
 * @return {String} bot name
 */
exports.getBotName = () => botName;

/**
 * Send {text} in chat
 * @param {String} text 
 * @return {number} status (0 — OK, -1 — ERROR)
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
 * @return {number} status (0 — OK, -1 — ERROR)
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
 * @return {number} status (0 — OK, -1 — ERROR)
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
 * @return {number} status (0 — OK, -1 — ERROR)
 */
exports.ban = function(username, reason) {
    try {
        client.ban(channelName, username, reason);
        return 0;
    } catch { return -1 };
}

/**
 * Clear chat
 * @return {number} status (0 — OK, -1 — ERROR)
 */
exports.clearChat = function() {
    try {
        client.clear(channelName);
        return 0;
    } catch { return -1 };
}

/**
 * If user is moderator or author return true, else return false
 * @param {Array} userstate
 * @returns {boolean} user type (true — mod, false — not mod)
 */
exports.checkMod = function(userstate) {
    if (userstate['user-type'] == 'mod' || userstate['display-name'].toLowerCase() == channelName) return true;
    else return false;
}

/**
 * Object with functions for database
 */
exports.db = {
    /**
     * Add {object} in database
     * @param {{}} object 
     */
    push: function(username, object) { nodeDB.push(`/${username}`, object, false) },
    /**
     * Get information from database
     * @param {String} username 
     * @return {[]} info
     */
    get: function(username) { 
        if (!username) return nodeDB.getData('/');
        else {
            try {
                data = nodeDB.getData(`/${username}`);
                return data
            } catch {return false};
        }
    },
    /**
     * Delete information from database
     * @param {String} username 
     */
    delete: function(username) { nodeDB.delete(`/${username}`)}
}