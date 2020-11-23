const { client, twitch } = require('./twitch');
const bannedWords = ['ниггер', 'нигга', 'пидор', 'черножопый', 'нигретос', 'глиномес', 'пидрила', 'пидорас', 
'конча', 'хиджаб', 'нига', 'хохлы', 'хохол', 'гетвиверс', 'Stream Details', 
'я бы всех Ни гресов в сарай загнал и сжег нахуй'];

function randomInt(min, max) {
    min = Math.ceil(min);
    max = Math.floor(max);
    return Math.floor(Math.random() * (max - min + 1)) + min;
}

const _ = {
    convertTime: function(seconds, minutes, hours) {
        if (seconds != null) return seconds*1000;
        else if (minutes != null) return minutes*60*1000;
        else if (hours != null) return hours*60*60*1000;
    },
    checkString: function(string, word) {
        return (string.indexOf(word) !== -1);
    },
    ramdom: {
        elementFromArray: function(array) {
            const element = array[randomInt(0, array.length-1)];
            return element;
        }
    },
    spliceArray: function(array, element) {
        const newArray = [];

        for (let i in array) if (array[i] !== element) newArray.push(array[i]);
        return newArray;
    }
}

const _twitch = {
    checkMessage: function(user, message) {
        for (let i in bannedWords) {
            if (message.toLowerCase().indexOf(bannedWords[i]) !== -1) {
                client.ban(user);
                twitch.db.delete(user);
                return true;
            }
        }
        return false;
    },
}

module.exports._ = _;
module.exports._twitch = _twitch;