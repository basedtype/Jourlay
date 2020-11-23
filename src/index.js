const { JsonDB } = require('node-json-db');
const { _, _twitch } = require('./tools');
const { userClass } = require('./classes');
const { client, twitch } = require('./twitch');

const nodeDB = new JsonDB(`Data/Channels/setting`, true, true, '/');
const twitchInfo = {
    viewers: 0,
    maxViewers: 0,
}
const arrays = {}
const timers = {}

function hiMessage(channel, message, username) {
    if (timers[channel].hi == null || timers[channel].hi === 0) {
        const hi = ['привет', 'хелоу', 'хай', 'куку', 'ку-ку', 'здрасте', 'здрасти', 'здравствуйте', 'здравствуй', 'приветули', 'bonjour', 'бонжур'];
        const hello = ['привет!', 'приветули!', 'добро пожаловать!', 'вы посмотрите кто пришел!', 'хеллоу!', 'хай!'];

        if (_.checkString(message, '@')) return false;
        if (arrays[channel].hi.includes(username)) return false;

        for (let i in hi) {
            if (_.checkString(message.toLowerCase(), hi[i]) === true) {
                client.say(channel, `@${username}, ${_.ramdom.elementFromArray(hello)} ShowOfHands ShowOfHands`);
                arrays[channel].hi.push(username);
                timers[channel].hi = 1;
                const func = () => timers[channel].hi = 0;
                setTimeout(func, _.convertTime(seconds = 3));
                return true;
            }
        }
    }

    return false;
}

client.on('chat', (channel, userstate, message, self) => {

    if (self) {
        try {
            const data = nodeDB.getData(`/${channel}`).mod;
            if (data !== twitch.isMod(channel, userstate)) nodeDB.push(`/${channel}`, {mod: twitch.isMod(channel, userstate)})
        } catch {
            nodeDB.push(`/${channel}`, {mod: twitch.isMod(channel, userstate)})
        }
    }

    if (arrays[channel] == null) {
        arrays[channel] = {
            hi: [],
        }
    }

    if (timers[channel] == null) {
        timers[channel] = {
            hi: 0,
            ask: 0,
            basic: 0,
        }
    }
})

client.on('action', (channel, userstate, message, self) => {
    if (self) return;

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

    if (channel == `#${client.botName}` && messageSplit[0] === '!addChannel' && username === 'jourloy') {
        client.addChannel(messageSplit[1]);
        client.action(channel, '==> канал добавлен');
        client.join(`#${messageSplit[1]}`);
        client.say(`#${messageSplit[1]}`, 'всем привет!');
    }

    if (channel == `#${client.botName}` && messageSplit[0] === '!removeChannel' && username === 'jourloy') {
        client.removeChannel(messageSplit[1]);
        client.action(channel, '==> канал удален');
        client.say(`#${messageSplit[1]}`, 'всем пока!');
        client.part(`#${messageSplit[1]}`);
    }

    if (channel == `#${client.botName}` && messageSplit[0] === '!addCommand') {
        const command = `!${messageSplit[1]}`;
        let answer = [];
        for (let i in messageSplit) if (i > 1) answer.push(messageSplit[i]);
        answer = answer.join(' ');

        try {
            const data = nodeDB.getData(`/#${username}_commands`);
            if (data.command.includes(command)) {
                client.action(channel, '==> такая команда уже есть');
                return;
            }
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

        client.action(channel, `==> команда добавлена. ${command} в своем чате`);
    }

    if (channel == `#${client.botName}` && messageSplit[0] === '!removeCommand') {
        const command = `!${messageSplit[1]}`;

        try {
            const data = nodeDB.getData(`/#${username}_commands`);
            console.log(command);
            if (!data.command.includes(command)) {
                client.action(channel, '==> такой команды нет');
                return;
            }
            data.answer = _.spliceArray(data.answer, data.answer[data.command.indexOf(command)]);
            data.command = _.spliceArray(data.command, command);

            nodeDB.push(`/#${username}_commands`, {command:  data.command, answer: data.answer});

            client.action(channel, `==> команда удалена`);
        } catch {
            client.action(channel, '==> такой команды нет');
            return;
        }
    }

    if (hiMessage(channel, message, username) === true) return;
    if (messageSplit[0] === '!q') {
        const array = ['да!','нет!','возможно','определенно нет','определенно да','50 на 50','шансы есть','без шансов','странный вопрос','я не хочу отвечать','может сменим тему?','не знаю'];
        if (username === 'jourloy') client.say(channel, `@${username}, ${_.ramdom.elementFromArray(array)}`);
        else if (twitchInfo != null && twitchInfo.viewers < 1000) {
            if (timers[channel].ask == null || timers[channel].ask === 0 && message.includes('?') && message.length > 6) {
                client.say(channel, `@${username}, ${_.ramdom.elementFromArray(array)}`);
                timers[channel].ask = 1;
                const func = () => timers[channel].ask = 0;
                setTimeout(func, _.convertTime(seconds=15));
                twitchInfo.commands++;
            }
        }
        return;
    }

    if (timers[channel].basic == null || timers[channel].basic === 0) {
        try {
            const data = nodeDB.getData(`/${channel}_commands`);
            const commands = data.command;
            const answers = data.answer;

            for (let i in commands) { 
                if (commands[i] === message) {
                    client.say(channel, answers[i]);
                    timers[channel].basic = 1;
                    const func = () => timers[channel].basic = 0;
                    setTimeout(func, _.convertTime(seconds=15));
                    twitchInfo.commands++;
                }
            }
        } catch {}
    }

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