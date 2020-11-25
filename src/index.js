const { JsonDB } = require('node-json-db');
const { _, _twitch } = require('./tools');
const { userClass } = require('./classes');
const { client, twitch } = require('./twitch');
const moment = require('moment');

const nodeDB = new JsonDB(`Data/Channels/setting`, true, true, '/');
const twitchInfo = {}
const arrays = {}
const timers = {}
const intervals = [];

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

    const username = userstate['display-name'].toLowerCase();
    if (channel === `#${client.botName}` && username === 'jourloy' && !twitch.isMod(channel, userstate)) client.mod(channel, username);

    if (arrays[channel] == null) {
        arrays[channel] = {
            hi: [],
        }
    }

    if (twitchInfo[channel] == null) {
        twitchInfo[channel] = {
            viewers: 0,
            maxViewers: 0,
            uptime: 0,
        }
    }

    if (timers[channel] == null) {
        timers[channel] = {
            hi: 0,
            ask: 0,
            basic: 0,
        }
    }

    if (self) {
        try {
            const data = nodeDB.getData(`/${channel}`).mod;
            if (data !== twitch.isMod(channel, userstate)) nodeDB.push(`/${channel}`, {mod: twitch.isMod(channel, userstate)})
        } catch {
            nodeDB.push(`/${channel}`, {mod: twitch.isMod(channel, userstate)})
        }
    }

    try {
        const data = nodeDB.getData(`/${channel}`).id;
        if (data == null) {
            client.api({
                url: `https://api.twitch.tv/kraken/users?login=${channel.slice(1)}`,
                method: "GET",
                headers: {
                    'Accept': 'application/vnd.twitchtv.v5+json',
                    "Client-ID": "q9hc1dfrl80y7eydzbehcp7spj6ga1",
                    'Authorization': 'OAuth djzzkk9jr9ppnqucmx1ixsce7kl9ly'
                }
            }, (err, res, body) => {
                nodeDB.push(`/${channel}`, {id: body.users[0]._id}, false)
            })
        }
    } catch {}

    try {
        const data = nodeDB.getData(`/${channel}`).id;
        if (data != null && channel !== `#${client.botName}`) {
            if (!intervals.includes(`${channel}_uptime`)) {
                setInterval(function () {
                    client.api({
                        url: `https://api.twitch.tv/kraken/streams/${data}`,
                        method: "GET",
                        headers: {
                            'Accept': 'application/vnd.twitchtv.v5+json',
                            "Client-ID": "q9hc1dfrl80y7eydzbehcp7spj6ga1",
                            'Authorization': 'OAuth djzzkk9jr9ppnqucmx1ixsce7kl9ly'
                        }
                    }, (err, res, body) => {
                        if (body.stream != null) {
                            twitchInfo[channel].viewers = body.stream.viewers;
                            if (twitchInfo[channel].viewers > twitchInfo[channel].maxViewers) twitchInfo[channel].maxViewers = body.stream.viewers;
                            let now = new Date();
                            let then = body.stream.created_at;
                            let ms = moment(now).diff(moment(then));
                            let d = moment.duration(ms);
                            twitchInfo[channel].uptime = Math.floor(d.asHours()) + moment.utc(ms).format(" ч. mm мин.");
                        } else {
                            twitchInfo[channel].uptime = 'оффлайн';
                        }
                    })
                }, _.convertTime(seconds=1));
                intervals.push(`${channel}_uptime`)
            }
        }
    } catch (err) { console.log(err) }
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
        if (twitch.isMod(channel, userstate) == true) return;
        twitch.timeout(user, _.convertTime(seconds = 20));
    }

    user.message++;
    twitch.db.push(channel, user);
})

client.on('message', (channel, userstate, message, self) => {
    if (self) return;

    const username = userstate['display-name'].toLowerCase();
    const messageSplit = message.split(' ');

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
                    setTimeout(func, _.convertTime(seconds=30));
                    twitchInfo.commands++;
                }
            }
        } catch {}
    }

    if (twitch.mod(channel) === true) modChannel(channel, userstate, message);
    else unmodChannel(channel, userstate, message);
})

function BotChannel(channel, userstate, message) {
    if (channel == `#${client.botName}` && messageSplit[0] === '!addChannel' && username === 'jourloy') {
        client.addChannel(messageSplit[1]);
        nodeDB.push(`/#${messageSplit[1]}`, {mod: false})
        client.color("Green");
        client.action(channel, '==> канал добавлен');
        client.color("BlueViolet");
        client.join(`#${messageSplit[1]}`);
    }

    if (channel == `#${client.botName}` && messageSplit[0] === '!reg') {
        client.addChannel(username);
        nodeDB.push(`/#${username}`, {mod: false})
        client.color("Green");
        client.action(channel, '==> канал добавлен');
        client.color("BlueViolet");
        client.join(`#${username}`);
    }

    if (channel == `#${client.botName}` && messageSplit[0] === '!removeChannel' && username === 'jourloy') {
        client.removeChannel(messageSplit[1]);
        client.color("OrangeRed");
        client.action(channel, '==> канал удален');
        client.color("BlueViolet");
        client.part(`#${messageSplit[1]}`);
    }

    if (channel == `#${client.botName}` && messageSplit[0] === '!addUser' && username === 'jourloy') {
        try {
            const data = nodeDB.getData('/allowusers').users;
            data.push(messageSplit[1]);
            nodeDB.push('allowusers', data);
            client.color("Green");
            client.action(channel, '==> пользователь добавлен');
            client.color("BlueViolet");
        } catch {
            const data = [];
            data.push(messageSplit[1]);
            nodeDB.push('allowusers', data);
            client.color("Green");
            client.action(channel, '==> пользователь добавлен');
            client.color("BlueViolet");
        }
    }

    if (channel == `#${client.botName}` && messageSplit[0] === '!removeUser' && username === 'jourloy') {
        try {
            const data = nodeDB.getData('/allowusers').users;
            const newData = _.spliceArray(data, messageSplit[1]);
            nodeDB.push('allowusers', newData);
            client.color("OrangeRed");
            client.action(channel, '==> пользователь удален');
            client.color("BlueViolet");
        } catch {
            client.color("Red");
            client.action(channel, '==> пользователь уже удален');
            client.color("BlueViolet");
        }
    }

    if (channel == `#${client.botName}` && messageSplit[0] === '!addCommand') {
        const command = `!${messageSplit[1]}`;
        let answer = [];
        for (let i in messageSplit) if (i > 1) answer.push(messageSplit[i]);
        answer = answer.join(' ');

        try {
            const data = nodeDB.getData(`/#${username}_commands`);
            let users = [];
            try {
                const data = nodeDB.getData('/allowusers').users;
                users = data;
            } catch {};
            if (!users.includes(username) && data.command.length == 5) {
                client.color("Red");
                client.action(channel, '==> кажется ты достиг(ла) лимита бесплатных команд. За 500р / месяц ты можешь получить безлимитное количество бесплатных команд, а за 1000р / месяц можно получить собственного бота (уникальное имя, любые команды, отправка сообщений по таймеру и прочее)');
                client.color("BlueViolet");
                return;
            }
            if (data.command.includes(command)) {
                client.color("OrangeRed");
                client.action(channel, '==> такая команда уже есть');
                client.color("BlueViolet");
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

        client.color("Green");
        client.action(channel, `==> команда добавлена. ${command} в своем чате`);
        client.color("BlueViolet");
    }

    if (channel == `#${client.botName}` && messageSplit[0] === '!removeCommand') {
        const command = `!${messageSplit[1]}`;

        try {
            const data = nodeDB.getData(`/#${username}_commands`);
            console.log(command);
            if (!data.command.includes(command)) {
                client.color("Red");
                client.action(channel, '==> такой команды нет');
                client.color("BlueViolet");
                return;
            }
            data.answer = _.spliceArray(data.answer, data.answer[data.command.indexOf(command)]);
            data.command = _.spliceArray(data.command, command);

            nodeDB.push(`/#${username}_commands`, {command:  data.command, answer: data.answer});

            client.color("OrangeRed");
            client.action(channel, `==> команда удалена`);
            client.color("BlueViolet");
        } catch {
            client.color("OrangeRed");
            client.action(channel, '==> такой команды нет');
            client.color("BlueViolet");
            return;
        }
    }

    if (channel == `#${client.botName}` && messageSplit[0] === '!removeAllCommands') {
        if (messageSplit[1] == null) {
            try {
                nodeDB.delete(`/#${username}_commands`)
                client.color("OrangeRed");
                client.action(channel, '==> все команды удалены');
                client.color("BlueViolet");
            } catch {
                client.color("Red");
                client.action(channel, '==> такой канал не найден');
                client.color("BlueViolet");
            }
        } else if (messageSplit[1] != null && username === 'jourloy') {
            try {
                nodeDB.delete(`/#${messageSplit[1]}_commands`)
                client.color("OrangeRed");
                client.action(channel, '==> все команды удалены');
                client.color("BlueViolet");
            } catch {
                client.color("Red");
                client.action(channel, '==> такой канал не найден');
                client.color("BlueViolet");
            }
        }
    }
}

function JOURLOYchannel(channel, userstate, message) {

}

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