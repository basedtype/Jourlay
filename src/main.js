const tmi = require('tmi.js');
const chatterInfo = [];
const options = {
    options: {
        debug: true
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

const rules = ` Правила в чате: Не спамить. Не обсуждать других стримеров. Не говорить на тему политики. Не оскорблять. Не стримснайпить. Быть хорошим чатером.`


client.on('connected', onConnectedHandler);
client.connect();

function CheckMod(userstate) {
    return (userstate['user-type'] != 'mod' && userstate['display-name'] != options.channels[0]);
}

console.log(client)

function onConnectedHandler() {
    client.color("Red");
    client.action(options.channels[0], ` приземляется в чат.`);
}

function ConvertTime(time) {
    const seconds = time.seconds || null;
    const minutes = time.minutes || null;
    const hours = time.minutes || null;

    if (seconds != null) return seconds*1000;
    else if (minutes != null) return minutes*60*1000;
    else if (hours != null) return hours*60*60*1000;
    else return 15*60*1000
}

setInterval(function () {
    client.action(options.channels[0], rules);
}, ConvertTime({minutes: 15}));

client.on("join", function (channel, username, self) {
    client.action(channel, `@${username} привет, обустраивайся :)`);
 });

client.on("ban", (channel, username, reason, userstate) => {
    if (chatterInfo.length == 0) {
        chatterInfo.push({username: username, timeouts: 0, bans: 1});
    } else {
        for (i in chatterInfo) {
            if (chatterInfo[i].username == userstate['display-name']) chatterInfo[i].bans++;
            return;
        }
        chatterInfo.push({username: userstate['display-name'], timeouts: 0, bans: 1});
    }
});

client.on("timeout", (channel, username, reason, duration, userstate) => {
    if (chatterInfo.length == 0) {
        chatterInfo.push({username: userstate['display-name'], timeouts: 1, bans: 0});
    } else {
        for (i in chatterInfo) {
            if (chatterInfo[i].username == userstate['display-name']) chatterInfo[i].timeouts++;
            return;
        }
        chatterInfo.push({username: userstate['display-name'], timeouts: 1, bans: 0});
    }
});

client.on("clearchat", (channel) => {
    client.say(channel, `первый`)
});

client.on("action", (channel, userstate, message, self) => {
    if (self) return;
    if (userstate['user-type'] != 'mod' && userstate['display-name'] != options.channels[0]) {
        client.timeout(channel, userstate['display-name'], 20, "/me в сообщении");
        client.say(options.channels[0], `@${userstate['display-name']} у нас не принято использовать /me в чате!`)
    }
});

client.on("chat", (channel, userstate, message, self) => {
    if (self) return;
    messageSplit = message.split(" ");

    switch (messageSplit[0]) {
        case '!dos':
            if (CheckMod(userstate)) {
                if (messageSplit[1]) {
                    for (i in chatterInfo) {
                        if (chatterInfo[i].username == messageSplit[1]) {
                            client.say(channel, `@${userstate['display-name']}, у ${messageSplit[1]} количество таймаутов: ${chatterInfo[i].timeouts} | количество банов: ${chatterInfo[i].bans}`)
                            return;
                        };
                    }
                    client.say(channel, `@${userstate['display-name']}, Такого человека нет`)
                } else client.say(channel, `@${userstate['display-name']}, Такого человека нет`)
            }
            break;
    }
});