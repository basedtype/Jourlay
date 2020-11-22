const { JsonDB } = require('node-json-db');
const {_, _twitch} = require('./tools');
const {userClass} = require('./classes');
const {client, twitch} = require('./twitch');

const nodeDB = new JsonDB(`Data/Channels/setting`, true, true, '/');ƒ
const arrays = {}

function hiMessage(channel, message, username) {
    const hi = ['привет', 'хелоу', 'хай', 'куку', 'ку-ку', 'здрасте', 'здрасти', 'здравствуйте', 'здравствуй', 'приветули', 'bonjour', 'бонжур'];
    const hello = ['привет!', 'приветули!', 'добро пожаловать!', 'вы посмотрите кто пришел!', 'хеллоу!', 'хай!'];

    if (_.checkString(message, '@')) return false;
    if (arrays[channel].hi.includes(username)) return false;

    for (let i in hi) {
        if (_.checkString(message.toLowerCase(), hi[i]) === true) {
            client.say(channel, `@${username}, ${_.ramdom.elementFromArray(hello)} ShowOfHands ShowOfHands`);
            arrays[channel].hi.push(username);
            return true;
        }
    }

    return false;
}

client.on('chat', (channel) => {
    if (arrays[channel] == null) {
        arrays[channel] = {
            hi: [],
        }
    }
})

client.on('action', (channel, userstate, message, self) => {
    if (self) {
        try {
            const data = nodeDB.getData(`/${channel}`).mod;
            return;
        } catch {
            const mod = twitch.isMod(channel, userstate);
            nodeDB.push(`/${channel}`, {mod: mod});
            return;
        }   
    }

    const username = userstate['display-name'].toLowerCase();
    let user = twitch.db.get(channel, username);
    if (user === false) user = new userClass({username: username, channel: channel});

    if (channel === '#jourloy') {
        if (twitch.isMod(channel, userstate)) return;
        twitch.timeout(user, _.convertTime(seconds = 20));
    }
    
    user.message++;
    twitch.db.push(channel, user);
})

client.on('message', (channel, userstate, message, self) => {
    if (self) return;

    const username = userstate['display-name'].toLowerCase();
    const messageSplit = message.split(' ');
    if (message === '!reg' && username === 'jourloy') {
        try {
            const data = nodeDB.getData(`/${channel}`).mod;
            client.say(channel, data);
            return;
        } catch {
            client.action(channel, 'настраивается');
            return;
        }
    }

    if (channel == `#${client.botName}` && messageSplit[0] === '!addChannel' && username === 'jourloy') {
        client.addChannel(messageSplit[1]);
        client.action(channel, 'канал добавлен')
    }

    if (hiMessage(channel, message, username) === true) return;

    if (twitch.mod(channel) === true) modChannel(channel, userstate, message);
    else unmodChannel(channel, userstate, message);
})

function modChannel(channel, userstate, message) {

    const messageSplit = message.split(' ');
    const username = userstate['display-name'].toLowerCase();

    let user = twitch.db.get(channel, username);
    if (user === false) user = new userClass({username: username, channel: channel});

    if (_twitch.checkMessage(user, message) === true) return;

    user.message++;
    twitch.db.push(channel, user);
}

function unmodChannel(channel, userstate, message) {
    const messageSplit = message.split(' ');
    const username = userstate['display-name'].toLowerCase();

    let user = twitch.db.get(channel, username);
    if (user === false) user = new userClass({username: username, channel: channel});

    user.message++;
    twitch.db.push(channel, user);
}