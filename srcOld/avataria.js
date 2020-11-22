const tools = require('./Tools/tools');
const twitch = require('./Twitch/twitch');
const moment = require('moment');
const settings = require('./Settings/settings');
const twitchClient = twitch.start()
const channelName = twitch.getChannelName();
const botName = twitch.getBotName();

const pattern = {
    sub: false, // State of subscriber
    balance: 0, // Amount of Pixels
    message: 0, // Amount of messages
};

const timer = {
    emotion: 0,
    ask: 0,
    diskord: 0,
    minecraft: 0,
    uptime: 0,
    pc: 0,
};

const emotions = {
    timer: 0,
    array: ['Pog', 'PogChamp', 'LUL', 'Jebaited', 'CoolStoryBob', 'NotLikeThis', 'BibleThump', 'DarkMode', 'Kappa', 'LOL', ':D', 'D:', 'KEKW', 'OmegaLOL', '4HEader', '2HEader', 'Lois']
};

const oldFollowers = [];
const hiMans = [];

const twitchInfo = {
    messages: 0,
    sendMessages: 0
};

// == == == == == == == == == == == == INTERVALS == == == == == == == == == == == == \\

/**
 * Print stream information in console
 */
/* setInterval(function () {
    try {
        console.log(twitchInfo);
    } catch { ; }
}, tools.ConvertTime({seconds: 0.1})); */

/**
 * Repeat emotions in chat
 * @param {String} message
 * @returns {boolean}
 */
function SayEmoties(message) {
    let check = false;
    let emotion;
    if (emotions.timer == 0) {
        for (i in emotions.array) {
            if (message.indexOf(emotions.array[i]) != -1) {
                check = true;
                emotion = emotions.array[i]
            }
        }
        if (check) {
            twitch.say(`${emotion} ${emotion} ${emotion}`)
            twitchInfo.sendMessages++;
            emotions.timer = 1;
            const f = () => emotions.timer = 0;
            setTimeout(f, tools.ConvertTime({ minutes: 1 }));
        }
    }
}

/**
 * TODO add text in settings
 * Check message and answer user if need
 * @param {String} message
 * @param {String} username
 */
function HiMessage(message, username) {
    const array = settings.hiMessage(twitchClient.lang);
    let check = false;
    if (!hiMans.includes(username) /* && username.toLocaleLowerCase() != channelName */) {
        for (i in array) { if (message.toLowerCase().indexOf(array[i]) != -1) check = true; }
        if (check == true) {
            twitch.say(`@${username}, ${tools.ChooseHiMessage()} ShowOfHands ShowOfHands`);
            twitchInfo.sendMessages++;
            hiMans.push(username);
        }
    }
    return check;
}

/**
 * TODO add text in settings
 * Check message and ban user if need
 * @param {String} message 
 */
function CheckSetPlus(message) {
    const array = settings.setPlus(twitchClient.lang)
    let check = false;
    for (i in array) { if (message.toLowerCase().indexOf(array[i]) != -1) check = true; }
    if (check == true) {
        twitch.say(`+`);
        twitchInfo.sendMessages++;
    }
    return check;
}

twitchClient.on("message", (channel, userstate, message, self) => {
    const messageSplit = message.split(" ");
    const username = userstate['display-name'].toLowerCase();

    if (self || username === 'milena1509') return;

    let userInfo = twitch.db.get(username);
    if (userInfo == false) userInfo = pattern;
    userInfo.message++;
    twitch.db.push(username, userInfo);

    twitchInfo.messages++;
    if (HiMessage(message, username) == true) return;
    if (CheckSetPlus(message, username) == true) return;

    /* switch (messageSplit[0]) {
        
    } */

    SayEmoties(message);
});