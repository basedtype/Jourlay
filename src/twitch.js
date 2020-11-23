const tmi = require('tmi.js');
const { JsonDB } = require('node-json-db');
const { userClass } = require(`./classes`);

const DB = new JsonDB(`Data/Channels/setting`, true, true, '/');

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
    channels:DB.getData('/joinChannels').channels || ['jourlay'],
};

const client = new tmi.client(options);

client.addChannel = (channelName) => { 
    const nodeDB = new JsonDB(`Data/Channels/setting`, true, true, '/');
    client.opts.channels.push(`#${channelName}`); 
    nodeDB.push('/joinChannels', {channels: client.opts.channels});
}
client.removeChannel = (channelName) => {
    const nodeDB = new JsonDB(`Data/Channels/setting`, true, true, '/');
    const channels = nodeDB.getData(`/joinChannels`);

    const newArray = [];
    for (let i in channels) if (channels[i] !== channelName) newArray.push(channels[i]);

    client.opts.channels = newArray; 
    nodeDB.push('/joinChannels', {channels: client.opts.channels});
}

client.botName = options.identity.username;
client.lang = 'ru';
function onConnectedHandler() {
    client.color("Red");
    console.log('>> Bot ready')
}
client.on('connected', onConnectedHandler);
client.connect();

const twitch = {
    ban: (user) => { client.ban(user.channel, user.username, '[БОТ]') },
    timeout: (user, length) => { client.timeout(user.channel, user.username, length, '[БОТ]') },
    isMod: function(channel, userstate) {
        const username = userstate['display-name'].toLowerCase();
        if (userstate.mod === true || `#${username}` === channel) return true;
        else return false;
    },
    mod: function(channel) {
        try {
            const nodeDB = new JsonDB(`Data/Channels/setting`, true, true, '/');
            const data = nodeDB.getData(`/${channel}`).mod;
            return data;
        } catch {
            return false;
        }
    },
    db: {
        push: (channel, user) => {
            if (channel == null) return;
            const nodeDB = new JsonDB(`Data/${channel}`, true, true, '/');
            const username = user.username;
            const object = {
                message: user.message,
            }

            nodeDB.push(`/${username}`, object, false);
        },
        get: function(channel, username) {
            if (channel == null) return;
            const nodeDB = new JsonDB(`Data/${channel}`, true, true, '/');
            try {
                const data = nodeDB.getData(`/${username}`);
                const options = {
                    username: username,
                    message: data.message,
                }
                const user = new userClass(options);
                return user;
            } catch { return false };
        },
        delete: (channel, user) => {
            if (channel == null) return;
            const nodeDB = new JsonDB(`Data/${channel}`, true, true, '/');
            nodeDB.delete(`/${user.username}`) ;
        }
    }
}

module.exports.client = client;
module.exports.twitch = twitch;