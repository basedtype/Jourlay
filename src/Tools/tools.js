const graph = require('./graph');

function sleep(millis) {
    return new Promise(resolve => setTimeout(resolve, millis));
}

exports.RandomChar = function(char) {
    const string = '098630986309863098630986309863098630986309863098630986309863';
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

/**
 * 
 * @param {Number} time in ms
 * @returns {Number} time in seconds, mitutes or hours
 */
exports.ConvertTime = function(time) {
    const seconds = time.seconds || null;
    const minutes = time.minutes || null;
    const hours = time.minutes || null;

    if (seconds != null) return seconds*1000;
    else if (minutes != null) return minutes*60*1000;
    else if (hours != null) return hours*60*60*1000;
    else return 15*60*1000
}

/**
 * Return random int between min and max
 * @param {Number} min minimal number
 * @param {Number} max maximal number
 * @returns {Number} random int between min and max
 */
exports.RandomInt = function(min, max) {
    min = Math.ceil(min);
    max = Math.floor(max);
    return Math.floor(Math.random() * (max - min + 1)) + min;
}

exports.RandomFloat = function(min, max) { return Math.random() * (max - min) + min }

/**
 * Exit from program
 * @param {Number} status 
 */
exports.exit = function(status) {
    throw `Bot finished. Status: ${status}`;
}

/**
 * Choose random answer
 */
exports.ChooseAnswer = function() {
    const array = ['да!','нет!','возможно','определенно нет','определенно да','50 на 50','шансы есть','без шансов','странный вопрос','я не хочу отвечать','может сменим тему?','не знаю'];
    return array[this.RandomInt(0, array.length-1)]
}

exports.ChooseHiMessage = function() {
    const array = ['привет!', 'приветули!', 'добро пожаловать!', 'вы посмотрите кто пришел!', 'вот ваш напиток!', 'хеллоу!', 'хай!'];
    return `${array[this.RandomInt(0, array.length-1)]}`;
}

/**
 * Check string and return true if string includes banned symbols
 * @param {String} text 
 */
exports.CheckString = function(message) {
    let check = false;
    for (i in message) {
        const buffer = Buffer.from(message[i]);
        const json = JSON.parse(JSON.stringify(buffer))
        if (json.data.length > 2 && message[i] != '▬') check = true;
    }
    return check;
}

/**
 * Array of banned words
 */
exports.GetBannedWords = () => ['ниггер', 'нигга', 'пидор', 'черножопый', 'нигретос', 'глиномес', 'пидрила', 'пидорас', 'конча', 'хиджаб', 'нига', 'хохлы', 'хохол', 'гетвиверс', 'Stream Details', 'я бы всех Ни гресов в сарай загнал и сжег нахуй'];

/**
 * Clear console
 */
exports.ClearCli = function() { console.log('\x1Bc') }

/**
 * Return random element from array
 * @param {Array} array 
 */
exports.GetRandomElementFromArray = function(array) {
    const element = array[this.RandomInt(0, array.length-1)];
    return element;
}

/**
 * Sort array by balance
 * @param {[]} array 
 * @return {[]} sorted array
 */
exports.sortArray = function(array) {
    let newArray = [];
    for (i in array) if (array[i].balance > 0) newArray.push(array[i]);
    return newArray;
}