/* IMPORTS */
const { tools } = require('./tools');

/* PARAMS */
const ru_alphabet = 'йцукенгшщзхъфывапролджэёячсмитьбюё';

/* CLASSES */
class defence {
    static checkBanWords(message, username, client) {
        let check = false;
        const bannedWords = ['ниггер', 'нигга', 'пидор', 'черножопый', 'нигретос', 'глиномес', 'пидрила', 'пидорас', 'хиджаб', 'нига', 'хохлы', 'хохол', 'гетвиверс', 'Stream Details',
            'я бы всех Ни гресов в сарай загнал и сжег нахуй', 'Ez Jebaited followers ', 'хач', 'тестJRJR', '░', '▄', '▀', '▐', '◐', '▇', '⣿', '⢡', '⡤', '⣫', 'bigfollows', '.com', 'W̪', 'n͓', 'путин',
            'навальный', 'навэльный', 'нэвэльный', 'митинг', 'путинлох', 'свободнаяроссия', 'навальному', 'зиповская', 'карякина', 'байбакова',
            'niggers', 'nigga', 'niga', 'niger', 'gay', 'putin', 'navalny', 'freerussia', 'zipovskaya', 'baibakova', 'karykina'];
        const split = message.split(' ');

        for (let i in split) {
            if (bannedWords.includes(split[i]) === true) check = true;
        }

        if (check === true) {
            if (username !== 'jourloy') client.timeout(client.channel, username, 100, 'Banned word');
            return false;
        }
        return true;
    }

    static checkDeleteWords(message, username, client) {
        let check = false;
        const inList = ['pr_'];
        const list = ['ava', 'cvmask', 'cvhazmat', 'cunt', 'bugger', 'bloody hell', 'bastard', 'wanker', 'toser', 'bollocks', 'retard', 'asshole', 'bitch', 'choad', 'twat'];
        const splited = message.split(' ');

        for (let i in splited) if (inList.indexOf(splited[i]) !== -1) check = true;
        for (let i in splited) if (list.includes(splited[i].toLowerCase()) === true) check = true;

        if (check === true) {
            const id = userstate['id'];
            if (username !== 'jourloy') client.deletemessage(client.channel, id);
            return false;
        }
        return true;
    }

    static checkLength(message, username, client) {
        let check = false
        const split = message.split(' ');
        for (let i in split) {
            let count = 0;
            for (let j in split) {
                if (split[j] === split[i]) count++;
                if (count > 5) check = true;
            }
            if (split[i].length > 20) check = true;
        }
        if (check === true) {
            if (username !== 'jourloy') client.timeout(client.channel, username, message.length);
            return false;
        }
        return true;
    }

    static run(message, userstate, client) {
        const username = userstate['username'];
        for (let i in message) {
            if (ru_alphabet.includes(message[i]) === true) {
                client.deletemessage(channel, userstate['id']);
                return false;
            }
        }
        if (this.checkBanWords(message, username, client) === false) return false;
        if (this.checkDeleteWords(message, username, client) === false) return false;
        if (this.checkLength(message, username, client) === false) return false;
    }
}

/* class discord {
    static run() {
        const { client } = require('../modules/Bots/Jourlay');
        client.on('message', msg => {
            if (msg.author.bot) return;
            const channel = msg.channel;
            const username = msg.author.username;
            const message = msg.content;
            const category = msg.channel.parent.name;

            if (username === 'jourloy') return;
            if (category !== 'Russia' && channel.name !== 'bot') {
                for (let i in message) {
                    if (ru_alphabet.includes(message[i]) === true) {
                        msg.delete();
                        return;
                    }
                }
            }
        });
    }
} */

/* EXPORTS */
module.exports.defence = defence;