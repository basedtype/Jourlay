/* IMPORTS */
const { client } = require('../../Bots/discord');
const { giveaway } = require('./_giveaway');
const { DBmanager } = require('../../DBmanager');
const { tools } = require('../../tools');
const Discord = require("discord.js");
const moment = require('moment');

/* PARAMS */
const giveaways = {};
let guild = null;

/* FUNCTIONS */
function checkRole(guild, userID, nameRole) {
    let user = null;
    const users = guild.members.cache.array();
    for (let i in users) {
        if (users[i].user.id === userID) user = users[i];
    }
    const roles = guild.roles.cache.array();
    let check = false;
    for (let i in user._roles) {
        for (let j in roles) {
            if (user._roles[i] === roles[j].id) {
                if (roles[j].name === nameRole) check = true;
            }
        }
    }
    return check;
}

/* INTERVALS */
setInterval(() => {
    for (let i in giveaways) {
        const give = giveaways[i];
        const end = give.end;
        const now = Math.floor(moment.now() / 1000);
        const time = end - now;
        if (time === 1) {
            let winners = '';
            let win = [];
            let tryCount = give.people.length * 10;
            if (give.people.length < give.amount) {
                for (let i in give.people) winners += `<@${give.people[i]}> `;
            } else {
                for (let i = 0; i < give.amount; i++) {
                    let userID = tools.randomElementFromArray(give.people);
                    if (win.includes(userID) === true) i--;
                    else {
                        winners += `<@${userID}> `;
                        win.push(userID);
                    }
                    tryCount--;
                    if (tryCount <= 0) i = give.amount + 1;
                }
            }
            const embed = new Discord.MessageEmbed()
                .setTitle(`Поздравляем с получением ${give.title}`)
                .addField('Выбрать нового победителя:', `!greroll 1 ${give.msgID}`)
                .setColor(0xd25757)
                .setImage(give.urlImage)
                .setURL(give.urlTitle)
                .setFooter(`With ❤️ by Jourloy`)
            client.channels.fetch('829888336511762452').then(channel => {
                channel.send(`${winners}`, { embed: embed }).then(mss => mss.react('🎉'));
                channel.messages.fetch(give.msgID)
                    .then(msg => msg.delete())
                    .catch(() => {})
            })
            DBmanager._poolAddBlock('Discord', 'NAMVSEYASNO', 'End giveaway')
        }
    }
}, 1000)

setInterval(() => {
    for (let i in giveaways) {
        const give = giveaways[i];
        const end = give.end;
        const now = Math.floor(moment.now() / 1000);
        const time = end - now;
        if (time <= 10) continue;
        client.channels.fetch('829888336511762452').then(channel => {
            channel.messages.fetch(give.msgID).then(msg => {
                if (msg == null) return;
                const end = give.end;
                const now = Math.floor(moment.now() / 1000);
                const time = end - now;
                const days = Math.floor(time / 60 / 60 / 24)
                const hours = Math.floor(time / 60 / 60) - (days * 24);
                const minutes = Math.floor(time / 60) - (hours * 60) - (days * 24 * 60);
                const seconds = time%60;
                const formatted = `${days}д ${hours}:${minutes}:${seconds}`;
                const embed = new Discord.MessageEmbed()
                    .setAuthor(`${give.authorUsername} запускает розыгрыш`, give.authorURL)
                    .setTitle(give.title)
                    .setDescription(`Жми на 🎁 для участия`)
                    .addField('Количество победителей:', give.amount, true)
                    .addField('Осталось до конца:', formatted, true)
                    .setColor(0xd25757)
                    .setImage(give.urlImage)
                    .setURL(give.urlTitle)
                    .setFooter(`With ❤️ by Jourloy`)
                msg.edit(`<@&829891758992523324>`, {embed: embed})
            })
        })
    }
}, 10000)

/* REACTIONS */
client.on('message', msg => {
    if (msg.guild.id !== '827928792424775740') return;
    if (guild == null) guild = msg.guild;
    const channel = msg.channel;
    const messageSplit = msg.content.split(' ');
    const msSplit = messageSplit[0].split('!');
    const command = msSplit[1];

    if (channel.name === giveaway.config.nameChannel && checkRole(msg.guild, msg.author.id, giveaway.config.nameRole) === true) {
        if (command === giveaway.config.start) {
            // !gstart % time % amount % title % url % imageUrl
            const commandSplit = msg.content.split('%');
            const time = commandSplit[1];
            let amount = commandSplit[2];
            const title = commandSplit[3];
            const urlTitle = commandSplit[4] || '';
            const urlImage = commandSplit[5] || '';
            let msTime = null;
            if (time.includes('s') === true) {
                const timeSplit = time.split('s')[0]
                msTime = tools.convertTime({ seconds: timeSplit });
            } else if (time.includes('m') === true) {
                const timeSplit = time.split('m')[0]
                msTime = tools.convertTime({ minutes: timeSplit });
            } else if (time.includes('h') === true) {
                const timeSplit = time.split('h')[0]
                msTime = tools.convertTime({ hours: timeSplit });
            } else if (time.includes('d') === true) {
                const timeSplit = time.split('d')[0]
                msTime = tools.convertTime({ days: timeSplit });
            }
            msTime = Math.floor(msTime / 1000)
            const days = Math.floor(msTime / 60 / 60 / 24)
            const hours = Math.floor(msTime / 60 / 60) - (days * 24);
            const minutes = Math.floor(msTime / 60) - (hours * 60) - (days * 24 * 60);
            const seconds = msTime%60;
            const formatted = `${days}д ${hours}:${minutes}:${seconds}`;

            if (amount === '' || amount === []) amount = 1;
            amount = parseInt(amount);

            const embed = new Discord.MessageEmbed()
                .setAuthor(`${msg.author.username} запускает розыгрыш`, msg.author.avatarURL())
                .setTitle(title)
                .setDescription(`Жми на 🎁 для участия`)
                .addField('Количество победителей:', amount, true)
                .addField('Осталось до конца:', formatted, true)
                .setColor(0xd25757)
                .setImage(urlImage)
                .setURL(urlTitle)
                .setFooter(`With ❤️ by Jourloy`)
            channel.send(`<@&829891758992523324>`, { embed: embed }).then(mss => {
                const give = {
                    msgID: mss.id,
                    amount: amount,
                    length: msTime,
                    end: Math.floor(moment.now() / 1000) + msTime,
                    created: Math.floor(moment.now() / 1000),
                    people: [],
                    urlTitle: urlTitle,
                    urlImage: urlImage,
                    title: title,
                    authorUsername: msg.author.username,
                    authorURL: msg.author.avatarURL(),
                }
                giveaways[mss.id] = give;
                mss.react('🎁')
            });
            msg.delete();
            DBmanager._poolAddBlock('Discord', 'NAMVSEYASNO', 'Start giveaway')
        } else if (command === giveaway.config.end) {
            const ID = messageSplit[1];
            giveaways[ID].end = Math.floor(moment.now() / 1000) + 5;
            msg.delete();
        } else if (command === giveaway.config.reroll) {
            const amount = messageSplit[1];
            const ID = messageSplit[2];
            giveaways[ID].amount = amount;
            giveaways[ID].end = Math.floor(moment.now() / 1000) + 5;
            msg.delete();
        } else if (command === giveaway.config.setting) {
            const commandSplit = msg.content.split('%');
            const id = commandSplit[1];
            const type = commandSplit[2];
            const data = commandSplit[3];

            if (type === 'time') {
                let msTime = null;
                if (data.includes('s') === true) {
                    const timeSplit = data.split('s')[0]
                    msTime = tools.convertTime({ seconds: timeSplit });
                } else if (data.includes('m') === true) {
                    const timeSplit = data.split('m')[0]
                    msTime = tools.convertTime({ minutes: timeSplit });
                } else if (data.includes('h') === true) {
                    const timeSplit = data.split('h')[0]
                    msTime = tools.convertTime({ hours: timeSplit });
                } else if (data.includes('d') === true) {
                    const timeSplit = data.split('d')[0]
                    msTime = tools.convertTime({ days: timeSplit });
                }
                msTime = Math.floor(msTime / 1000)
                giveaways[id].end = giveaways[id].created + msTime;
                giveaways[id].length = msTime;
            } else if (type === 'amount') {
                giveaways[id].amount = parseInt(data);
            } else if (type === 'title') {
                giveaways[id].title = data
            } else if (type === 'url') {
                giveaways[id].urlTitle = data
            } else if (type === 'urlImage') {
                giveaways[id].urlImage = data
            }
            msg.delete()
        }
    }
})

client.on('messageReactionAdd', msg => {
    if (msg._emoji.name !== '🎁') return;
    if (giveaways[msg.message.id] == null) {
        console.log('ERROR with giveaways');
        return;
    }
    const users = msg.users.cache.array();
    for (let i in users) {
        if (users[i].username === 'Nidhoggbot') continue;
        const id = users[i].id
        if (giveaways[msg.message.id].people.includes(id) === false) giveaways[msg.message.id].people.push(id);
    }
})