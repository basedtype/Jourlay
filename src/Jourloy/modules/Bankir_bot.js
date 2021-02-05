/* IMPORTS */
const tmi = require('tmi.js');
const moment = require('moment');
const { _ } = require('../tools');
const { Database } = require('../Utils/Database');
const { Coins } = require('../Utils/Coins');
const { Game } = require('../Game/Game');
const { tools, errors } = require('../Utils/Tools');

/* TWITCH SETTINGS */
const options = {
    options: {
        debug: false
    },
    connection: {
        cluster: 'aws',
        reconnect: true
    },
    identity: {
        username: 'jourlay',
        password: 'oauth:wqw74p6gjtb7cs478vmb8snbeyfskk'
    },
    channels:['#jourloy'],
};

const client = new tmi.client(options);

client.channel = options.channels[0];
client.botName = options.identity.username;
client.lang = 'ru';
function onConnectedHandler() {
    client.color("OrangeRed");
    console.log('JapanBank => Twitch => Ready');
}
client.on('connected', onConnectedHandler);
client.connect();

/* PARAMS */
let stopRaid = true;
let stopBet = true;

const betInfo = {
    k: 0,
    users: 0,
}

/* FUNCTIONS */

/* INTERVALS */

/* REACTIONS */
client.on('redeem', (channel, username, rewardType, tags) => {
    if (rewardType === '6aa74658-1b0a-49ed-8bc2-2ff0de3f6cef') {
        client.say(channel, `@${username}, отлично, я перевел 10 осколоков душ на ваш счет. Проверить кошелек можно командой !wallet`);
        Database.addCoins(username, 10);
    }
});

client.on("resub", (channel, username, months, message, userstate, methods) => {
    const amount = 500 + (months*20);
    client.say(channel, `@${username}, огромное спасибо за ресаб, это отличная помощь, на ваш счет в JapanBank начислено ${amount} осколков душ`);
    Database.addCoins(username, amount);
});

client.on("subscription", (channel, username, method, message, userstate) => {
    client.say(channel, `@${username}, огромное спасибо за подписку на канал, на ваш счет в JapanBank начислено 500 осколков душ`);
    Database.addCoins(username, 500);
});

client.on("subgift", (channel, username, streakMonths, recipient, methods, userstate) => {
    let senderCount = ~~userstate["msg-param-sender-count"];
    const amount = 500 * senderCount;
    client.say(channel, `@${username}, огромное спасибо за подарочную подписку на канал, на ваш счет в JapanBank начислено ${amount} осколков душ`);
    Database.addCoins(username, amount);
});

client.on("timeout", (channel, username, reason, duration) => {
    //const coins = Database.getCoins(username);
    //let amount = 0;
    //if (coins - duration >= 5) amount = duration;
    //else amount = coins - 5;
    //client.say(channel, `@${username}, кажется, вас отправили в таймут. С вашего счета списано ${amount} осколков душ`);
    //Database.removeCoins(username, amount);
})

client.on('message', (channel, userstate, message, self) => {
    if (self) return;
    const username = userstate['display-name'].toLowerCase();
    const messageSplit = message.split(' ');

    if (messageSplit[0] === '!stop') {

        if (username !== 'jourloy') return;
        throw 'Exit';

    } else if (messageSplit[0] === '!raid') {

        if (username !== 'jourloy') return;
        const result = Game.toRaid(username, client);
        if (result === errors.ERR_NOT_FIND_USER) client.say(channel, `@${username}, кажется вы не зарегистрированы в нашей базе данных. Для начала необходимо указать свою фракцию командой !fraction`);
        else if (result === errors.ERR_USER_NOT_IN_FRACTION) client.say(channel, `@JOURLOY, у пользователя [${username}] ошибка с данными (fraction error)`);
        else if (result === errors.ERR_ALREADY_IN_RAID) client.say(channel, `@${username}, вы уже в рейде. Проверить время до возвращения можно командой !status`);
        else if (result === errors.ERR_NOT_ENOUGH_SHARDS) client.say(channel, `@${username}, у вас не достаточно осколов для похода в рейд`);
        return;

    } else if (messageSplit[0] === '!fraction') {

        if (username !== 'jourloy') return;
        const game = Database.get.game(username);
        if (game === errors.ERR_NOT_FIND_USER || game.fraction === '') {
            if (messageSplit[1] == null || (messageSplit[1] !== 'V' && messageSplit[1] !== 'J' && messageSplit[1] !== 'C' && (messageSplit[1] !== 'K' && username !== 'jourloy'))) client.say(channel, `@${username}, после !fraction необходимо указать букву фракции`);
            else if (messageSplit[1] === 'V') {
                client.say(channel, `@${username}, хорош боец, нам как раз такие нужны! У нас все просто, видишь добро - забираешь, я думаю ты быстро освоишься. Захочешь отправиться за добычей - пиши !raid`);
                Database.add.user(username, messageSplit[1]);
            } else if (messageSplit[1] === 'C') {
                client.say(channel, `@${username}, смирно! Теперь это твой новый дом. У нас много боевых задач, как будешь готов - пиши !raid`);
                Database.add.user(username, messageSplit[1]);
            } else if (messageSplit[1] === 'J') {
                client.say(channel, `@${username} добро пожаловать. Отныне ты - самурай. Оберегай катану, как жену, и используй вакидзаси, как перо. Как будешь готов отправиться в путешествие, пиши !raid`);
                Database.add.user(username, messageSplit[1]);
            } else if (messageSplit[1] === 'K' && username === 'jourloy') {
                client.action(channel, `==> @${username}, теперь ты не просто человек. Теперь ты имеешь преимущество над другими. Ты представляешь особый класс. Отныне ты - мастер душ. Как будешь готов к новым приключениям, пиши !raid`);
                Database.add.user(username, messageSplit[1]);
            }
        } else {
            if (game.fraction === 'C') client.say(client.channel, `@${username}, вашей фракцией является: Боевая группа "Цезарь" `);
            else if (game.fraction === 'V') client.say(client.channel, `@${username}, вашей фракцией является: Викинги`);
            else if (game.fraction === 'J') client.say(client.channel, `@${username}, вашей фракцией является: Клан самураев "Сакура"`);
            else if (game.fraction === 'K') client.say(client.channel, `@${username}, вашей фракцией является: Мастера душ`);
        }
        return;

    } else if (messageSplit[0] === '!wallet' || messageSplit[0] === '!w') {

        if (username !== 'jourloy') return;
        const hero = Database.get.hero(username);
        const game = Database.get.game(username);
        if (hero === errors.ERR_NOT_FIND_USER || game.fraction === '') client.say(channel, `@${username}, кажется вы не зарегистрированы в нашей базе данных. Для начала необходимо указать свою фракцию командой !fraction`);
        else {
            if (game.fraction === 'C') client.say(channel, `@${username}, на вашем счету ${hero.wallet} купюр`);
            else if (game.fraction === 'V') client.say(channel, `@${username}, на вашем счету ${hero.wallet} золотых монет`);
            else if (game.fraction === 'J') client.say(channel, `@${username}, на вашем счету ${hero.wallet} слитков Великой стали`);
            else if (game.fraction === 'K') client.say(channel, `@${username}, на вашем счету ${hero.wallet} осколков душ`);
        }
        return;

    } else if (messageSplit[0] === '!xp') {

        if (username !== 'jourloy') return;
        const hero = Database.get.hero(username);
        const game = Database.get.game(username);
        if (hero === errors.ERR_NOT_FIND_USER || game.fraction === '') client.say(channel, `@${username}, кажется вы не зарегистрированы в нашей базе данных. Для начала необходимо указать свою фракцию командой !fraction`);
        else client.say(channel, `@${username}, у вас ${hero.level} уровень и ${hero.xp} очков опыта`);
        return;

    } else if (messageSplit[0] === '!hp') {

        if (username !== 'jourloy') return;
        const hero = Database.get.hero(username);
        const game = Database.get.game(username);
        if (hero === errors.ERR_NOT_FIND_USER || game.fraction === '') client.say(channel, `@${username}, кажется вы не зарегистрированы в нашей базе данных. Для начала необходимо указать свою фракцию командой !fraction`);
        else client.say(channel, `@${username}, у вас ${hero.hp} очков здоровья`);
        return;

    } else if (messageSplit[0] === '!buy' || messageSplit[0] === '!b') {

        if (username !== 'jourloy') return;
        const hero = Database.get.hero(username);
        const game = Database.get.game(username);
        if (hero === errors.ERR_NOT_FIND_USER || game.fraction === '') {
            client.say(channel, `@${username}, кажется вы не зарегистрированы в нашей базе данных. Для начала необходимо указать свою фракцию командой !fraction`);
            return;
        }
        if (hero.inventoryLimit === hero.inventory.length) {
            client.say(channel, `@${username}, ваш склад уже максимально полон`);
            return;
        }
        if (hero.inventory.includes(`${messageSplit[1]} - ${messageSplit[2]}`) === true) {
            client.say(channel, `@${username}, этот предмет уже куплен вами`);
            return;
        }
        const items = Database.get.items(game.fraction);
        if (items[messageSplit[1]] == null || items[messageSplit[1]][messageSplit[2]] == null) client.say(channel, `@${username}, такого предмета в продаже нет`);
        else {
            if (hero.wallet >= items[messageSplit[1]][messageSplit[2]].price) {
                Database.remove.wallet(username, items[messageSplit[1]][messageSplit[2]].price);
                Database.add.inventory(username, `${messageSplit[1]} - ${messageSplit[2]}`);
                client.say(channel, `@${username}, вы успешно купили ${messageSplit[1]}, которое имеет ${messageSplit[2]} уровень`);
            } else client.say(channel, `@${username}, на вашем счету не достаточно средств`);
        }
        return;

    } else if (messageSplit[0] === '!inventory' || messageSplit[0] === '!i') {
        if (username !== 'jourloy') client.say(channel, `@${username}, склад в данный момент не доступен`);
        return;
    } else if (messageSplit[0] === '!stock') {
        if (username !== 'jourloy') client.say(channel, `@${username}, акции в данный момент не доступны`);
        return;
    } else if (messageSplit[0] === '!send') {
        const receiver = messageSplit[2];
        const amount = messageSplit[1];
        const coins = Database.getCoins(username);
        const to = Database.getUser(receiver);

        if (to == null) {
            client.say(channel, `@${username}, такого человека нет в нашей базе данных`);
            return;
        } else if (coins < amount) {
            client.say(channel, `@${username}, у вас недостаточно осколков для совершения данного действия`);
            return;
        } else {
            const sum = amount - Math.floor(amount/100*15);
            Database.removeCoins(username, amount);
            Database.addCoins(receiver, sum);
            client.say(channel, `@${username}, перевод успешно совершен, переведено ${sum} осколков душ`);
            return;
        }
    } else if (messageSplit[0] === '!addShards') {
        if (username !== 'jourloy') return;
        const shards = parseInt(messageSplit[1]);
        const to = messageSplit[2];
        Database.addCoins(to, shards);
        client.say(channel, `@${username}, ${shards} осколков душ зачислено на счет, владельцем которого является ${to}`);
        return;
    } else if (messageSplit[0] === '!removeShards') {
        if (username !== 'jourloy') return;
        const shards = parseInt(messageSplit[1]);
        const to = messageSplit[2];
        Database.removeCoins(to, shards);
        client.say(channel, `@${username}, ${shards} осколков душ убрано со счета, владельцем которого является ${to}`);
        return;
    } else if (messageSplit[0] === '!курс') {
        client.action(channel, `==> Текущий курс йен по отношению к осколкам душ: 100 йен на 1 осколок`);
        return;
    } else if (messageSplit[0] === '!top') {
        const user = Database.getTop();
        client.action(channel, `==> Самый большой счет у ${user.username} на котором лежит ${user.wallet} осколков душ`);
        return;
    } else if (messageSplit[0] === '!stopRaid') {
        if (username !== 'jourloy') return;
        client.action(channel, `==> Ворота из города ЗАКРЫТЫ, установлены посты охраны`);
        stopRaid = true;
        return;
    } else if (messageSplit[0] === '!allowRaid') {
        if (username !== 'jourloy') return;
        client.action(channel, `==> Ворота из города ОТКРЫТЫ, посты охраны убраны`);
        stopRaid = false;
        return;
    } else if (messageSplit[0] === '!return') {
        Coins.returnRaid(username, false, client);
        return;
    } else if (messageSplit[0] === '!pay' || messageSplit[0] === '!p') {
        Coins.returnRaid(username, true, client);
        return;
    }  else if (messageSplit[0] === '!status' || messageSplit[0] === '!s') {
        if (username === 'jourloy') {
            const raid = Database.getRaid(messageSplit[1]);
            if (raid.bool === true && raid.rest === false && (raid.return === false || (raid.return === true && raid.pay > 0))) {
                const now = Math.floor(moment.now() / 1000);
                const created_at = raid.created_at;
                const time = raid.time;

                let about = Math.floor((created_at + time) - now);
                let hours = Math.floor(about/60/60);
                let minutes = Math.floor(about/60)-(hours*60);
                let seconds = about%60

                const formatted = [
                    hours.toString().padStart(2, '0'),
                    minutes.toString().padStart(2, '0'),
                    seconds.toString().padStart(2, '0')
                ].join(':');

                client.say(channel, `@${username}, ${messageSplit[1]} находится в рейде. До возвращения еще ${formatted}`);
            } else if (raid.bool === true && raid.rest === true && (raid.return === false || (raid.return === true && raid.pay > 0))) {
                const now = Math.floor(moment.now() / 1000);
                const created_at = raid.created_at;
                const time = raid.time;

                let about = Math.floor((created_at + time) - now);
                let hours = Math.floor(about/60/60);
                let minutes = Math.floor(about/60)-(hours*60);
                let seconds = about%60

                const formatted = [
                    hours.toString().padStart(2, '0'),
                    minutes.toString().padStart(2, '0'),
                    seconds.toString().padStart(2, '0')
                ].join(':');

                client.say(channel, `@${username}, ${messageSplit[1]} восстанавливает силы. До полного восстановления ${formatted}`);
            } else if (raid.bool === true && raid.return === true && raid.pay === 0) {
                const now = Math.floor(moment.now() / 1000);
                const created_at = raid.created_at;
                const time = raid.time;

                let about = Math.floor((created_at + time) - now);
                let hours = Math.floor(about/60/60);
                let minutes = Math.floor(about/60)-(hours*60);
                let seconds = about%60

                const formatted = [
                    hours.toString().padStart(2, '0'),
                    minutes.toString().padStart(2, '0'),
                    seconds.toString().padStart(2, '0')
                ].join(':');

                client.say(channel, `@${username}, ${messageSplit[1]} возвращается отрядом. До возвращения еще ${formatted}`);
            } else client.say(channel, `@${username}, ${messageSplit[1]} готов отправиться в запретные земли`);
        } else {
            const raid = Database.getRaid(username);
            if (raid.bool === true && raid.rest === false && (raid.return === false || (raid.return === true && raid.pay > 0))) {
                const now = Math.floor(moment.now() / 1000);
                const created_at = raid.created_at;
                const time = raid.time;

                let about = Math.floor((created_at + time) - now);
                let hours = Math.floor(about/60/60);
                let minutes = Math.floor(about/60)-(hours*60);
                let seconds = about%60

                const formatted = [
                    hours.toString().padStart(2, '0'),
                    minutes.toString().padStart(2, '0'),
                    seconds.toString().padStart(2, '0')
                ].join(':');

                client.say(channel, `@${username}, вы находитесь в рейде. До возвращения еще ${formatted}`);
            } else if (raid.bool === true && raid.rest === true && (raid.return === false || (raid.return === true && raid.pay > 0))) {
                const now = Math.floor(moment.now() / 1000);
                const created_at = raid.created_at;
                const time = raid.time;

                let about = Math.floor((created_at + time) - now);
                let hours = Math.floor(about/60/60);
                let minutes = Math.floor(about/60)-(hours*60);
                let seconds = about%60

                const formatted = [
                    hours.toString().padStart(2, '0'),
                    minutes.toString().padStart(2, '0'),
                    seconds.toString().padStart(2, '0')
                ].join(':');

                client.say(channel, `@${username}, вы восстанавливаете силы. До полного восстановления ${formatted}`);
            } else if (raid.bool === true && raid.return === true && raid.pay === 0) {
                const now = Math.floor(moment.now() / 1000);
                const created_at = raid.created_at;
                const time = raid.time;

                let about = Math.floor((created_at + time) - now);
                let hours = Math.floor(about/60/60);
                let minutes = Math.floor(about/60)-(hours*60);
                let seconds = about%60

                const formatted = [
                    hours.toString().padStart(2, '0'),
                    minutes.toString().padStart(2, '0'),
                    seconds.toString().padStart(2, '0')
                ].join(':');

                client.say(channel, `@${username}, вы возвращаетесь отрядом. До возвращения еще ${formatted}`);
            } else client.say(channel, `@${username}, вы готовы отправиться в запретные земли. Пропуск стоит 10 осколков душ. Отправиться в рейд можно командой !raid`);
        }
        return;
    } else if (messageSplit[0] === '!openBet') {
        if (username !== 'jourloy') return;
        stopBet = false;
        client.action(channel, `==> Банк начинает принимать ставки. При положительном результате вы получите на счет обратно свою ставку + коэффициент. Коэффициент будет оглашен после закрытия ставок. Сделать ставку можно командой !bet [количество]`);
        return;
    } else if (messageSplit[0] === '!bet') {
        if (stopBet === true) return;
        const bet = Database.getBet(username);
        const raid = Database.getRaid(username);

        if (raid.bool === true) {
            client.say(channel, `@${username}, вы находитесь в рейде, у вас нет доступа к операциям со своим счетом`);
            return;
        } else {
            let amount = null;
            try { amount = parseInt(messageSplit[1]) }
            catch { return }

            const coins = Database.getCoins(username);
            if (coins < amount) {
                client.say(channel, `@${username}, у вас недостаточно средств сделать такую ставку. Проверить кошелек можно командой !wallet`);
                return;
            }
            bet.join = true;
            bet.amount = amount;
            Database.updateBet(username, bet);
            client.say(channel, `@${username}, ставка принята`);
            return;
        }
    } else if (messageSplit[0] === '!closeBet') {
        if (username !== 'jourloy') return;
        const bets = Database.getBets();
        for (i in bets) Database.removeCoins(i, bets[i].amount);
        const k = 1.5;
        betInfo.k = k;
        client.action(channel, `==> Банк закрывает прием ставок. Осколки душ сняты со счетов пользователей. Коээфициент победы: ${k}`);
        return;
    } else if (messageSplit[0] === '!finishBet') {
        if (username !== 'jourloy') return;
        const result = messageSplit[1];
        if (result === '1') {
            let sum = 0;
            const bets = Database.getBets();
            for (i in bets) {
                const userBet = Database.getBet(i);
                userBet.join = false;
                userBet.amount = 0;
                Database.updateBet(i, userBet);
                Database.addCoins(i, Math.floor(bets[i].amount * betInfo.k));
                sum += Math.floor(bets[i].amount * betInfo.k);
            }
            client.action(channel, `==> Позддравляем победителей. Всего выплачено игрокам ${sum} осколков душ`)
        } else {
            let sum = 0;
            const bets = Database.getBets();
            const userBet = Database.getBet(i);
            userBet.join = false;
            userBet.amount = 0;
            Database.updateBet(i, userBet);
            for (i in bets) sum += Math.floor(bets[i].amount)
            client.action(channel, `==> К сожалению ставки завершены с негативным результатом. Пользователи потеряли ${sum} осколков душ`)
        }
        stopBet = false;
        return;
    }
});