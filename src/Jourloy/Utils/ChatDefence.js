/* IMPORTS */
const { _ } = require('../tools');
const { Database } = require('./Database');

/* PARAMS */

/* ERRORS */

/* CODE */

/* CLASSES */
class ChatDefence {
    static run(username, message, userstate, client) {
        this.resetMessage(username)
        if (this.messageCountCheck(username, client) === false) return false;
        if (this.lengthCheck(username, message, client) === false) return false;
        if (this.wordCheck(username, message, userstate, client) === false) return false;
        if (this.messageCheck(username, message, client) === false) return false;
        return true;
    }

    static resetMessage(username) {
        const user = Database.get.chatDefence(username);
        if (user.timer === 0) {
            user.timer = 1;
            Database.update.chatDefence(username, user);
            setTimeout(function() { Database.reset.messages(username) }, _.convertTime(5));
        }
        return true;
    }

    static messageCountCheck(username, client) {
        const user = Database.get.chatDefence(username);
        if (user.messages >= 6) {
            if (username !== 'jourloy') client.timeout(client.channel, username, 20, 'Много сообщений, тебе не кажется?');
            console.log(`Jourlay => Twitch => Chat defence => Timeout (20) => ${username}`);
            return false;
        }
        return true;
    }

    static lengthCheck(username, message, client) {
        let check = false
        const split = message.split(' ');
        for (let i in split) {
            let count = 0;
            for (let j in split) {
                if (split[j] === split[i]) count++;
                if (count > 5) check = true;
            }
        }
        if (split[0].length > 20) check = true;
        if (check === true) {
            if (username !== 'jourloy') client.timeout(client.channel, username, message.length, 'Давай без длинных слов, а то в чате не красиво');
            console.log(`Jourlay => Twitch => Chat defence => Timeout (${message.length}) => ${username}`);
            return false;
        }
        return true;
    }

    static wordCheck(username, message, userstate, client) {
        let check = false;
        const inList = ['pr_'];
        const list = ['ava', 'аватария', 'ава', 'блять', 'хуй', 'пизда', 'уебан', 'чмо', 'чсв', 'уебок', 'еблан', 'мразь', 'член', 'ебать', 'ебу', 'выебу', 'cock', 'cunt', 'ебаль', 'хуев', 'хуёв', 'ебет', 'ебёт', 'заебал', 'заебали', 'cvmask',
                    'fuck', 'cunt', 'fucking', 'shitted', 'piss', 'bugger', 'bloody hell', 'bastard', 'wanker', 'toser', 'bollocks', 'retard', 'dick', 'asshole', 'bitch', 'choad', 'twat'];
        const splited = message.split(' ');

        for (let i in splited) if (inList.indexOf(splited[i]) !== -1) check = true;
        for (let i in splited) if (list.includes(splited[i].toLowerCase()) === true) check = true;
        
        if (check === true) {
            const id = userstate['id'];
            if (username !== 'jourloy') client.deletemessage(client.channel, id);
            console.log(`Jourlay => Twitch => Chat defence => Delete message => ${username} => ${message}`);
            return false;
        }
        return true;
    }

    static messageCheck(username, message, client) {
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
            if (username !== 'jourloy') client.timeout(client.channel, username, 100, 'Запрещенное слово, ай-ай');
            console.log(`Jourlay => Twitch => Chat defence => Timeout (100) => ${username}`);
            return false;
        }
        return true;
    }
}

/* EXPORTS */
module.exports.ChatDefence = ChatDefence;