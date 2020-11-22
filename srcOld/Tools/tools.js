const graph = require('./graph');

function sleep(millis) {
    return new Promise(resolve => setTimeout(resolve, millis));
}

function randomChar(char) {
    const string = '09863';
    if (char == '░') return `${graph.fgMagenta(string[this.RandomInt(0, string.length-1)])}`;
    else if (char == '█') return ` `;
    else if (char == ' ') return ` `;
    else return '\n'
}

const icon = {
    twitch: `
   ░░░░░░░░░░░░░░░░░░░░░░
  ░░                  ░░░
 ░░░                  ░░░
░░░░      ░░    ░░    ░░░
░░░░      ░░    ░░    ░░░
░░░░      ░░    ░░    ░░░
░░░░                  ░░░
░░░░                 ░░░
░░░░                ░░░
░░░░░░░░    ░░░░░░░░░░
░░░░░░░░░ ░░░░░░░░░░░
 ░░░░░░░░░░░░░░░░░░░
     ░░░░░
     ░░░░
     ░░░
     ░░
     ░`,
    discord: ``
}

exports.TwitchIcon = function() {
    let twitch = [];
    for (i in icon.twitch) twitch.push(this.RandomChar(icon.twitch[i]));
    twitch = twitch.join('');
    return twitch;
}

function convertTime(time) {
    const seconds = time.seconds || null;
    const minutes = time.minutes || null;
    const hours = time.minutes || null;

    if (seconds != null) return seconds*1000;
    else if (minutes != null) return minutes*60*1000;
    else if (hours != null) return hours*60*60*1000;
    else return 15*60*1000
}

function randomInt(min, max) {
    min = Math.ceil(min);
    max = Math.floor(max);
    return Math.floor(Math.random() * (max - min + 1)) + min;
}

function randomFloat(min, max) { return Math.random() * (max - min) + min }

/**
 * Choose random answer
 */
exports.ChooseAnswer = function() {
    const array = ['да!','нет!','возможно','определенно нет','определенно да','50 на 50','шансы есть','без шансов','странный вопрос','я не хочу отвечать','может сменим тему?','не знаю'];
    return array[this.RandomInt(0, array.length-1)]
}

exports.ChooseHiMessage = function() {
    const array = ['привет!', 'приветули!', 'добро пожаловать!', 'вы посмотрите кто пришел!', 'хеллоу!', 'хай!'];
    return `${array[this.RandomInt(0, array.length-1)]}`;
}

/**
 * Check string and return true if string includes banned symbols
 * @param {String} text 
 */
exports.CheckString = function(message) {
    return false;
    let check = false;
    const allowArray = []
    for (i in message) {
        const buffer = Buffer.from(message[i]);
        const json = JSON.parse(JSON.stringify(buffer))
        console.log(`${message[i]} | ${json.data.length}`)
        if (json.data.length > 2 && !allowArray.includes(message[i])) check = true;
    }
    return check;
}

/**
 * Array of banned words
 */
exports.GetBannedWords = () => ['ниггер', 'нигга', 'пидор', 'черножопый', 'нигретос', 'глиномес', 'пидрила', 'пидорас', 'конча', 'хиджаб', 'нига', 'хохлы', 'хохол', 'гетвиверс', 'Stream Details', 'я бы всех Ни гресов в сарай загнал и сжег нахуй'];


function clearCli() { console.log('\x1Bc') }

function getRandomElementFromArray(array) {
    const element = array[this.RandomInt(0, array.length-1)];
    return element;
}

exports.sortArray = function(array) {
    let newArray = [];
    for (i in array) if (array[i].balance > 0) newArray.push(array[i]);
    return newArray;
}

const _ = {
    random: {
        element: (array) => { getRandomElementFromArray(array) },
        int: (min, max) => { randomInt(min, max) },
        char: (min, max) => { randomFloat(min, max) },
    },
    convertTime: (time) => { convertTime(time) },
    clear: () => { clearCli() }
}

const _twitch = {

}

module.exports._ = _;
module.exports._twitch = _twitch;