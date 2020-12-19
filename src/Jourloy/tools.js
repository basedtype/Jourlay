const { client, twitch } = require('./twitch');

const bannedWords = ['ниггер', 'нигга', 'пидор', 'черножопый', 'нигретос', 'глиномес', 'пидрила', 'пидорас', 
'конча', 'хиджаб', 'нига', 'хохлы', 'хохол', 'гетвиверс', 'Stream Details', 
'я бы всех Ни гресов в сарай загнал и сжег нахуй', 'Ez Jebaited followers '];

function randomInt(min, max) {
    min = Math.ceil(min);
    max = Math.floor(max);
    return Math.floor(Math.random() * (max - min + 1)) + min;
}

class _tool {
    static convertTime(seconds, minutes, hours) {
        if (seconds != null) return seconds*1000;
        else if (minutes != null) return minutes*60*1000;
        else if (hours != null) return hours*60*60*1000;
    }

    static checkString(string, word) {
        return (string.indexOf(word) !== -1);
    }

    static randomElementFromArray(array) {
        return array[randomInt(0, array.length-1)];
    }

    static sliceArray(array, element) {
        const newArray = [];
        for (let i in array) if (array[i] !== element) newArray.push(array[i]);
        return newArray;
    }
    
    static clearCli() {
        console.log('\x1Bc');
    }
}

class _twitch {
    static checkMessage(user, message) {
        for (let i in bannedWords) {
            if (message.toLowerCase().indexOf(bannedWords[i]) !== -1) {
                client.ban(user);
                twitch.db.delete(user);
                return true;
            }
        }
        return false;
    }
}

module.exports._ = _tool;
module.exports._twitch = _twitch;