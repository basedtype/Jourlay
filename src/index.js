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
const followers = [];

/**
 * Say hello message in a chat
 * @param {string} channel 
 * @param {string} message 
 * @param {string} username 
 */
function hiMessage(channel, message, username) {
    if (timers[channel].hi == null || timers[channel].hi === 0) {
        const hi = ['привет', 'хелоу', 'хай', 'куку', 'ку-ку', 'здрасте', 'здрасти', 'здравствуйте', 'здравствуй', 'приветули', 'bonjour', 'бонжур'];
        const hello = ['привет!', 'приветули!', 'добро пожаловать!', 'вы посмотрите кто пришел!', 'хеллоу!', 'хай!', 'а я тебя ждал!'];

        if (_.checkString(message, '@')) return false;
        if (_.checkString(message.toLowerCase(), 'передай')) return false;
        if (arrays[channel].hi.includes(username)) return false;

        for (let i in hi) {
            if (_.checkString(message.toLowerCase(), hi[i]) === true) {
                client.say(channel, `@${username}, ${_.ramdom.elementFromArray(hello)} ShowOfHands`);
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

/**
 * Say answer on a ask
 * @param {string} channel 
 * @param {string} username 
 * @param {number} length 
 */
function question(channel, username, length = 20) {
    const array = ['да!','нет!','возможно','определенно нет','определенно да','50 на 50','шансы есть','без шансов','странный вопрос','я не хочу отвечать','может сменим тему?','не знаю'];
    if (twitchInfo != null && twitchInfo[channel].viewers < 1200) {
        if (timers[channel].ask == null || timers[channel].ask === 0 && message.includes('?') && message.length > 6) {
            client.say(channel, `@${username}, ${_.ramdom.elementFromArray(array)}`);
            timers[channel].ask = 1;
            const func = () => timers[channel].ask = 0;
            setTimeout(func, _.convertTime(seconds=length));
            twitchInfo.commands++;
        }
    }
}

/**
 * How long play stream
 * @param {string} channel 
 */
function uptime(channel) {
    if (twitchInfo[channel].uptime === 'оффлайн') client.say(channel, 'Стример сейчас оффлайн');
    else client.say(channel, `Стример ведет трансляцию уже ${twitchInfo[channel].uptime}. Я заметил, что на стриме сидело максимум ${twitchInfo[channel].maxViewers} зрителей.`);
}

/**
 * How long you are follow this channel
 * @param {string} channel 
 * @param {{}} userstate 
 */
function followerAge(channel, userstate) {
    const userID = userstate['user-id'];
    const myId = nodeDB.getData(`/${channel}`).id;
    const username = userstate['display-name'].toLowerCase();

    try {
        client.api({
            url: `https://api.twitch.tv/kraken/users/${userID}/follows/channels/${myId}`,
            method: "GET",
            headers: {
                'Accept': 'application/vnd.twitchtv.v5+json',
                "Client-ID": "q9hc1dfrl80y7eydzbehcp7spj6ga1",
                'Authorization': 'OAuth djzzkk9jr9ppnqucmx1ixsce7kl9ly'
            }
        }, (err, res, body) => {
            let now = new Date();
            let then = body.created_at;
            let ms = moment(now).diff(moment(then));
            let d = moment.duration(ms);
            const follow = Math.floor(d.asDays()) + moment.utc(ms).format(" дней, hh часов и mm минут");

            client.say(channel, `@${username}, ты зафоловлен(а) на канал уже ${follow}`)
        })
    } catch {}
}

/**
 * How long this user live on a twitch
 * @param {string} channel 
 * @param {string} username 
 * @param {string} target
 */
function userAge(channel, username, target) {

}

client.on("raided", (channel, username, viewers) => {
    switch(channel) {
        case '#jourloy':
            //client.action(channel, `==> ВНИМАНИЕ, НА НАС ПРОВОДИТСЯ РЕЙД. Во главе их войска стоит некий под именем "${username}". За ним пришло ${viewers} человек. ЧАТ! ПОДНЯЯЯЯЯЯТЬ ЩИТЫ`);
            client.action(channel, `==> Огромное спасибо ${username} за то, что зарейдил, а также отдельное спасибо всем ${viewers} зрителям за то, что присоединились к рейду!`);
            break;
    }
});

client.on("clearchat", (channel) => {
    switch(channel) {
        case '#jourloy':
            client.say(channel, 'Я первый Kappa');
            break;
    }
});

setInterval(function() {
    _.clearCli();

    for (i in twitchInfo) {
        const channel = twitchInfo[i];

        console.log(`
-------------
Channel name: ${i}

Uptime: ${channel.uptime}
MaxViewers: ${channel.maxViewers}
        `)
    }
}, _.convertTime(seconds=30))


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
            pc: 0,
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
                        if (body != null && body.stream != null) {
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
    } catch {}

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
        const followerOn = nodeDB.getData(`/${channel}`).followNoftification;
        if (followerOn === true && !intervals.includes(`${channel}_follows`)) {
            const data = nodeDB.getData(`/${channel}`).id;
            setInterval(function() {
                twitchClient.api({
                    url: `https://api.twitch.tv/kraken/channels/${data}/follows`,
                    method: "GET",
                    headers: {
                        'Accept': 'application/vnd.twitchtv.v5+json',
                        "Client-ID": "q9hc1dfrl80y7eydzbehcp7spj6ga1",
                        'Authorization': 'OAuth djzzkk9jr9ppnqucmx1ixsce7kl9ly'
                    }
                }, (err, res, body) => {
                    const newFollower = [];
                    if (body && body.followers) {
                        for (i in body.follows) newFollower.push(body.follows[i].user.display_name);
                        if (followers.length == 0) followers = newFollower;
                        else {
                            for (i in newFollower) {
                                if (!followers.includes(newFollower[i])) {
                                    twitch.say(`@${newFollower[i]}, ${settings.follow(twitchClient.lang)}`);
                                    followers = newFollower;
                                }
                            }
                        }
                    }
                });
            }, _.convertTime(seconds=10));
            intervals.push(`${channel}_follows`);
        }
    } catch {}
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
    //if (hiMessage(channel, message, username) === true) return;

    switch(channel) {
        case `#${client.botName}`:
            BotChannel(channel, userstate, message);
            break;
        
        case `#jourloy`:
            JOURLOYchannel(channel, userstate, message);
            break;

        case `#avatariaclub`:
            AVATARIAchannel(channel, userstate, message);
            break;
    }
})

function BotChannel(channel, userstate, message) {
    const messageSplit = message.split(' ');
    const username = userstate['display-name'].toLowerCase();
    if (username !== `jourloy`) return;

    switch(messageSplit[0]) {
        case '!addChannel':
            client.addChannel(messageSplit[1]);
            nodeDB.push(`/#${messageSplit[1]}`, {mod: false})
            client.color("Green");
            client.action(channel, '==> канал добавлен');
            client.color("BlueViolet");
            client.join(`#${messageSplit[1]}`);
            break;
        
        case '!removeChannel':
            client.removeChannel(messageSplit[1]);
            client.color("OrangeRed");
            client.action(channel, '==> канал удален');
            client.color("BlueViolet");
            client.part(`#${messageSplit[1]}`);
            break;
        
        case '!ping':
            client.color("Green");
            client.action(channel, '==> pong');
            client.color("BlueViolet");
            break;
    }
}

function JOURLOYchannel(channel, userstate, message) {
    const messageSplit = message.split(' ');
    const username = userstate['display-name'].toLowerCase();

    if (_twitch.checkMessage(username, message) === true) return;

    switch(messageSplit[0]) {
        case '!help':
            client.action(channel, '==> !up - сколько идет трансляция | !pc - про комп | !q - задать вопрос боту | !followerage - сколько ты зафоловлен(а) на меня');
            break;

        case '!q':
            question(channel, username);
            break;

        case '!pc':
            if (twitchInfo && twitchInfo.viewers > 100) {
                if (timers[channel].pc == 0 && message.includes('?') && message.length > 6) {
                    client.action(channel, `==> iMac 27" 5k retina. Играю на Windows`);
                    timers[channel].pc = 1;
                    const setQuestionTime = () => timers[channel].pc = 0;
                    setTimeout(setQuestionTime, _.convertTime(seconds = 5));
                }
            } else client.action(channel, `==> iMac 27" 5k retina. Играю на Windows`);
            break;

        case '!telegram':
        case '!tg':
            client.action(channel, '==> Вот ссылка на лучший телеграм канал, где можно узнать о всех новостях связанных со стримами: t.me/JourloyTwitch')
            break

        case '!up':
        case '!uptime':
            uptime(channel);
            break;

        case '!followerage':
            followerAge(channel, userstate);
            break;

    }
}

function AVATARIAchannel(channel, userstate, message) {
    const messageSplit = message.split(' ');
    const username = userstate['display-name'].toLowerCase();

    switch(messageSplit[0]) {
        case '!q':
            question(channel, username, 35);
            break;
        
        case '!up':
        case '!uptime':
            uptime(channel);
            break;
        
        case '!followerage':
            followerAge(channel, userstate);
            break;
    }
}