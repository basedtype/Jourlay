const { JsonDB } = require('node-json-db');
const { _, _twitch } = require('./tools');
const { userClass } = require('./classes');
const { client, twitch } = require('./twitch');

const nodeDB = new JsonDB(`Data/Channels/setting`, true, true, '/');
const timers = {
    ask: 0,
    hi: 0,
}
const twitchInfo = {
    viewers: 0,
    maxViewers: 0,
}
const arrays = {}

function hiMessage(channel, message, username) {
    if (timers.hi === 0) {
        const hi = ['привет', 'хелоу', 'хай', 'куку', 'ку-ку', 'здрасте', 'здрасти', 'здравствуйте', 'здравствуй', 'приветули', 'bonjour', 'бонжур'];
        const hello = ['привет!', 'приветули!', 'добро пожаловать!', 'вы посмотрите кто пришел!', 'хеллоу!', 'хай!'];

        if (_.checkString(message, '@')) return false;
        if (arrays[channel].hi.includes(username)) return false;

        for (let i in hi) {
            if (_.checkString(message.toLowerCase(), hi[i]) === true) {
                client.say(channel, `@${username}, ${_.ramdom.elementFromArray(hello)} ShowOfHands ShowOfHands`);
                arrays[channel].hi.push(username);
                timers.hi = 1;
                const func = () => timers.hi = 0;
                setTimeout(func, _.convertTime(seconds = 3));
                return true;
            }
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
            nodeDB.push(`/${channel}`, {
                mod: mod
            });
            return;
        }
    }

    const username = userstate['display-name'].toLowerCase();
    let user = twitch.db.get(channel, username);
    if (user === false) user = new userClass({
        username: username,
        channel: channel
    });

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

    if (channel == `#${client.botName}` && messageSplit[0] === '!addCommand') {
        const command = `!${messageSplit[1]}`;
        let answer = [];
        for (let i in messageSplit) if (i > 1) answer.push(messageSplit[i]);
        answer = answer.join(' ');

        try {
            const data = nodeDB.getData(`/#${username}_commands`);
            data.command.push(command);
            data.answer.push(answer);
            nodeDB.push(`/#${username}_commands`, {command:  data.command, answer: data.answer});
        } catch {
            const comArray = [];
            comArray.push(command);
            const answArray = [];
            answArray.push(answer);

            nodeDB.push(`/#${username}_commands`, {command: comArray, answer: answArray});
        }

        client.action(channel, `=> команда добавлена. ${command} в своем чате`);
    }

    if (channel == `#${client.botName}` && messageSplit[0] === '!addChannel' && username === 'jourloy') {
        client.addChannel(messageSplit[1]);
        client.action(channel, 'канал добавлен')
    }

    if (hiMessage(channel, message, username) === true) return;
    if (messageSplit[0] === '!q') {
        const array = ['да!','нет!','возможно','определенно нет','определенно да','50 на 50','шансы есть','без шансов','странный вопрос','я не хочу отвечать','может сменим тему?','не знаю'];
        if (username === channelName) twitch.say(`@${username}, ${_.ramdom.elementFromArray(array)}`);
        else if (twitchInfo != null && twitchInfo.viewers < 100) {
            if (timers.ask === 0 && message.includes('?') && message.length > 6) {
                client.say(channel, `@${username}, ${_.ramdom.elementFromArray(array)}`);
                timers.ask = 1;
                const func = () => timers.ask = 0;
                setTimeout(func, );
                twitchInfo.commands++;
            }
        }
        return;
    }

    try {
        const data = nodeDB.getData(`/${channel}_commands`);
        const commands = data.command;
        const answers = data.answer;

        for (let i in commands) { 
            if (commands[i] === message) client.say(channel, answers[i]);
        }
    } catch {}

    if (twitch.mod(channel) === true) modChannel(channel, userstate, message);
    else unmodChannel(channel, userstate, message);
})

function modChannel(channel, userstate, message) {

    const messageSplit = message.split(' ');
    const username = userstate['display-name'].toLowerCase();

    let user = twitch.db.get(channel, username);
    if (user === false) user = new userClass({
        username: username,
        channel: channel
    });

    if (_twitch.checkMessage(user, message) === true) return;

    user.message++;
    twitch.db.push(channel, user);
}

function unmodChannel(channel, userstate, message) {
    const messageSplit = message.split(' ');
    const username = userstate['display-name'].toLowerCase();

    let user = twitch.db.get(channel, username);
    if (user === false) user = new userClass({
        username: username,
        channel: channel
    });

    user.message++;
    twitch.db.push(channel, user);
}