/* IMPORTS */
const { _ } = require('../tools');

/* PARAMS */

/* ERRORS */

/* CODE */

/* CLASSES */
class ChatDefence {
    static run(user, message, userstate) {
        user.counters.message++;
        this.resetMessage(user);
        if (this.messageCountCheck(user) === false) return false;
        if (this.lengthCheck(user, message) === false) return false;
        if (this.wordCheck(message, userstate) === false) return false;
        if (this.messageCheck(user, message) === false) return false;
        return true;
    }

    static resetUser(user) {
        user.counters.message = 0;
        user.timers.resetMessage = 0;
    }

    static resetMessage(user) {
        if (user.timers.resetMessage === 0) {
            user.timers.resetMessage = 1;
            setTimeout(function() {
                ChatDefence.resetUser(user)
            } , _.convertTime(5));
        }
    }

    static messageCountCheck(user) {
        if (user.counters.message >= 10) {
            client.timeout(client.channel, user.username, 20, 'Много сообщений, тебе не кажется?');
            console.log(`Bot => Twitch => Chat defence => Timeout (20) => ${user.username}`);
            this.resetUser(user);
            return false;
        }
        return true;
    }

    static lengthCheck(user, message) {
        let check = false
        const split = message.split(' ');
        for (let i in split) {
            let count = 0;
            let kekw = 0;
            for (let j in split) {
                if (split[j] === split[i]) count++;
                if (count > 5) check = true;
            }
            if (split[i] === 'KEKW') kekw++;
            if (kekw > 3) check = true;
        }
        if (split[0].length > 20) check = true;
        if (check === true) {
            client.timeout(client.channel, user.username, message.length, 'Давай без длинных слов, а то в чате не красиво');
            console.log(`Bot => Twitch => Chat defence => Timeout (${message.length}) => ${user.username}`);
            this.resetUser(user);
            return false;
        }
        return true;
    }

    static wordCheck(message, userstate) {
        let check = false;
        const inList = ['pr_'];
        const list = ['ava', 'аватария', 'ава', 'pogchamp', 'блять', 'хуй', 'пизда', 'уебан', 'чмо', 'чсв', 'уебок', 'еблан', 'мразь', 'член', 'ебать', 'ебу', 'выебу', 'cock', 'cunt', 'ебаль', 'хуев', 'хуёв', 'ебет', 'ебёт', 'заебал', 'заебали'];
        const splited = message.split(' ');

        for (let i in splited) if (inList.indexOf(splited[i]) !== -1) check = true;
        for (let i in splited) if (list.includes(splited[i].toLowerCase()) === true) check = true;
        
        if (check === true) {
            const id = userstate['id'];
            client.deletemessage(channel, id);
            return false;
        }
        return true;
    }

    static messageCheck(user, message) {
        let check = false;
        const bannedWords = ['ниггер', 'нигга', 'пидор', 'черножопый', 'нигретос', 'глиномес', 'пидрила', 'пидорас', 'хиджаб', 'нига', 'хохлы', 'хохол', 'гетвиверс', 'Stream Details', 
'я бы всех Ни гресов в сарай загнал и сжег нахуй', 'Ez Jebaited followers ', 'хач', 'bigfollows', 'тестJRJR', '░', '▄', '▀', '▐', '◐', '▇', '⣿', '⢡', '⡤', '⣫'];
        const split = message.split(' ');

        for (let i in split) {
            if (bannedWords.includes(split[i]) === true) check = true;
        }

        if (check === true) {
            client.timeout(client.channel, user.username, 100, 'Запрещенное слово, ай-ай');
            console.log(`Bot => Twitch => Chat defence => Timeout (100) => ${username}`);
            this.resetUser(user);
            return false;
        }
        return true;
    }
}

/* EXPORTS */
module.exports.ChatDefence = ChatDefence;