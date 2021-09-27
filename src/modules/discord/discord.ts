/* IMPORTS */
import { manager } from "../database/main";
import { client, _guild } from "./main";
import { tools } from "../tools/main";
import { steam } from "../Steam/main";
import { buttons } from "./buttons";
import { gog } from "../GOG/main";

import { HowLongToBeatService, HowLongToBeatEntry } from 'howlongtobeat';
import { getGames } from "epic-free-games";
import * as ds from "discord.js";

/* PARAMS */
const voiceChannels = {
    duo: {
        id: '865697645920911371',
        name: 'Игровая комната [2]',
    },
    trio: {
        id: '865697670852378684',
        name: 'Игровая комната [3]',
    },
    four: {
        id: '865697708676087828',
        name: 'Игровая комната [4]',
    },
    five: {
        id: '865697728766803998',
        name: 'Игровая комната [5]',
    },
}
const sendSales = {
    steam: false,
    egs: false,
    gog: false,
}
const hltbService = new HowLongToBeatService();
const checkVoiceChannels = {};
let banVoiceUsers: string[] = [];
let voiceUsers: string[] = [];

/* INTERVALS */
/**
 * Send information about sales
 */
 setInterval(() => {
    const time = new Date();
    const hour = time.getHours();
    const minutes = time.getMinutes();

    if (hour === 15 && minutes >= 5 && minutes < 10 && sendSales.steam === false) {
        steam.getFeatured().then(async data => {
            if (data.specials.items[0].currency !==  'RUB') return;
            const sales = data.specials.items;
            const embed = new ds.MessageEmbed()
                .setTitle('Steam')
                .setColor(0xf05656)
                .setFooter(`With ❤️ by Jourloy`)

            for (let i in sales) {
                const product = sales[i];
                const oldPrice = (product.original_price * 0.01).toFixed(2);
                const price = (product.final_price * 0.01).toFixed(2);
                const percent = product.discount_percent;
                embed.addField(product.name, `**Скидка:** ${percent}%\n**Стоимость:** __${price}__\n**Старая цена:** ${oldPrice}\n[В магазин](https://store.steampowered.com/app/${product.id}/)\n`, true);
            }
            client.channels.fetch('869957685326524456').then((channel: ds.TextChannel) => { 
                channel.send({embeds: [embed]});
                sendSales.steam = true;
                setTimeout(() => {sendSales.steam}, tools.convertTime({hours: 2}));
            });
        })
    } else if (hour === 15 && minutes >= 10 && minutes < 15 && sendSales.egs === false) {
        getGames('RU')
            .then(async games => {
                const embed = new ds.MessageEmbed()
                    .setTitle('Epic Games Store')
                    .setColor(0xf05656)
                    .setFooter(`With ❤️ by Jourloy`)
                const url = 'https://www.epicgames.com/store/ru/p/';
                let thisWeek = '';
                let nextWeek = '';

                for (let i in games.currents) if (games.currents[i].price.totalPrice.discountPrice === 0) thisWeek += `${games.currents[i].title} ([В магазин](${url}${games.currents[i].productSlug}))\n`;
                for (let i in games.nexts) nextWeek += `${games.nexts[i].title} ([В магазин](${url}${tools.removeSpaces(games.nexts[i].title, '-')}))\n`
                embed.addField(`Раздается на этой неделе`, thisWeek);
                embed.addField(`Раздается на следующей неделе`, nextWeek);
                client.channels.fetch('869957685326524456').then((channel: ds.TextChannel) => { 
                    channel.send({embeds: [embed]});
                    sendSales.egs = true;
                    setTimeout(() => {sendSales.egs}, tools.convertTime({hours: 2}));
                });
            })
            .catch(err => console.log(err))
    } else if (hour === 15 && minutes >= 0 && minutes < 5 && sendSales.gog === false) {
        gog.getSales().then(async sales => {
            const embed = new ds.MessageEmbed()
                .setTitle('GOG')
                .setColor(0xf05656)
                .setFooter(`With ❤️ by Jourloy`)

            for (let i in sales) {
                const name = sales[i].title;
                const percent = sales[i].price.discount;
                const price = sales[i].price.amount;
                const oldPrice = sales[i].price.baseAmount;
                const slug = sales[i].slug;

                embed.addField(name, `**Скидка:** ${percent}%\n**Стоимость:** __${price}__\n**Старая цена:** ${oldPrice}\n[В магазин](https://www.gog.com/game/${slug})\n`, true);
            }
            client.channels.fetch('869957685326524456').then((channel: ds.TextChannel) => { 
                channel.send({embeds: [embed]});
                sendSales.gog = true;
                setTimeout(() => {sendSales.gog}, tools.convertTime({hours: 2}));
            });
        })
    }
}, 1000)

/**
 * Clear voice users array every 5 minutes
 */
setInterval(() => {
    voiceUsers = [];
    banVoiceUsers = [];
}, tools.convertTime({ minutes: 2 }));

/**
 * Add member in ban for voice channels
 */
setInterval(() => {
    const warningsID = {};
    for (let i in voiceUsers) {
        if (warningsID[voiceUsers[i]] == null) {
            warningsID[voiceUsers[i]] = { count: 1 };
        } else if (warningsID[voiceUsers[i]] != null) {
            warningsID[voiceUsers[i]].count++;
        }
    }
    for (let i in warningsID) {
        if (warningsID[i].count > 3 && banVoiceUsers.includes(i) === false) {
            createLog(null, `User <@${i}> created too many channels`)
            banVoiceUsers.push(i);
        }
    }
}, 500)

/**
 * Set member count in name of channel
 * Remove unused and undeleted channels
 */
setInterval(() => {
    if (_guild == null) return;

    client.channels.fetch('871750394211090452').then((channel: ds.VoiceChannel) => {
        const memberCount = _guild.memberCount;
        const channelName = channel.name.split(' ');

        if (parseInt(channelName[1]) != memberCount) channel.setName(`Участников: ${memberCount}`)
    })

    const channels: ds.GuildChannel[] = [];
    _guild.channels.cache.forEach((channel) => { if (channel.type === 'GUILD_VOICE' && (channel.name === voiceChannels.duo.name || channel.name === voiceChannels.trio.name || channel.name === voiceChannels.four.name || channel.name === voiceChannels.five.name)) channels.push(channel)});
    for (let i in channels) {
        if (channels[i].members.first() == null) {
            channels[i].delete()
                .then(() => { ; })
                .catch(() => { ; });
        }
    }
}, 10000)

/**
 * Kick member from voice
 */
setInterval(() => {
    if (_guild == null) return;

    const channels: ds.GuildChannel[] = [];
    _guild.channels.cache.forEach((channel) => { if (channel.type === 'GUILD_VOICE' && (channel.name === voiceChannels.duo.name || channel.name === voiceChannels.trio.name || channel.name === voiceChannels.four.name || channel.name === voiceChannels.five.name)) channels.push(channel)});
    
    for (let i in channels) {
        const channel = channels[i];

        if (channel.members.toJSON().length > 1) continue;
        else {
            if (checkVoiceChannels[channel.id] == null || checkVoiceChannels[channels[i].id] != null && checkVoiceChannels[channels[i].id].check === false) {
                checkVoiceChannels[channel.id] = { check: true };
                setTimeout(() => {
                    checkVoiceChannels[channel.id].check = false;
                    if (channel.members.toJSON().length === 1) {
                        _guild.members.fetch(channel.members.first()).then(member => {
                            const userVoiceState = member.guild.voiceStates.cache.find(userFind => userFind.id === member.id);
                            userVoiceState.disconnect('Sited in channel 15 minutes');
                        })
                    };
                }, tools.convertTime({minutes: 15}));
            }
        }
    }
}, 1000)

/**
 * Create voice channels
 */
setInterval(() => {
    if (_guild == null) return;

    const deleteFunction = (channelNew: ds.GuildChannel) => {
        if (channelNew.members.first() == null) {
            channelNew.delete()
                .then(() => { ; })
                .catch(() => { ; });
            return true;
        }
        return false;
    }

    const repeatCheck = (channelNew: ds.GuildChannel) => {
        setTimeout(() => { deleteChannel(channelNew) }, 1000)
    }

    const deleteChannel = (channelNew: ds.GuildChannel) => {
        if (deleteFunction(channelNew) === false) repeatCheck(channelNew);
    }

    /**
     * Create channel with limit is 2
     */
    client.channels.fetch(voiceChannels.duo.id).then((channel: ds.VoiceChannel | null) => {
        if (channel == null || channel.full == null || channel.full === false) return;

        const parent = channel.parent;
        const guild = channel.guild;
        const name = voiceChannels.duo.name;
        const options: ds.GuildChannelCreateOptions = {
            type: 'GUILD_VOICE',
            userLimit: 2,
            position: parent.position + 10,
            parent: parent,
            reason: `Created channel for `,
        }
        const user = channel.members.first();
        options.reason += `${user.user.username}`;
        voiceUsers.push(user.id);
        if (banVoiceUsers.includes(user.id) === true) {
            let userVoiceState: ds.VoiceState = null;
            guild.members.fetch(user.id).then(member => {
                userVoiceState = member.guild.voiceStates.cache.find(userFind => userFind.id === user.id);
                userVoiceState.disconnect('User created too many channels');
                return;
            });
        } else {
            let userVoiceState: ds.VoiceState = null;
            let idNew: string = null;

            guild.members.fetch(user.id).then(member => {
                userVoiceState = member.guild.voiceStates.cache.find(userFind => userFind.id === user.id);

                guild.channels.create(name, options).then(async data => {
                    idNew = data.id;
                    const channelNew: ds.VoiceChannel = await guild.channels.fetch(idNew).then((ch: ds.VoiceChannel) => { return ch })
                    userVoiceState.setChannel(channelNew)
                        .then(res => { ; })
                        .catch(err => { ; });
                    repeatCheck(channelNew);
                });
            });
        }
    });

    /**
     * Create channel with limit is 3
     */
     client.channels.fetch(voiceChannels.trio.id).then((channel: ds.VoiceChannel | null) => {
        if (channel == null || channel.full == null || channel.full === false) return;

        const parent = channel.parent;
        const guild = channel.guild;
        const name = voiceChannels.trio.name;
        const options: ds.GuildChannelCreateOptions = {
            type: 'GUILD_VOICE',
            userLimit: 3,
            position: parent.position + 10,
            parent: parent,
            reason: `Created channel for `,
        }
        const user = channel.members.first();
        options.reason += `${user.user.username}`;
        voiceUsers.push(user.id);
        if (banVoiceUsers.includes(user.id) === true) {
            let userVoiceState: ds.VoiceState = null;
            guild.members.fetch(user.id).then(member => {
                userVoiceState = member.guild.voiceStates.cache.find(userFind => userFind.id === user.id);
                userVoiceState.disconnect('User created too many channels');
                return;
            });
        } else {
            let userVoiceState: ds.VoiceState = null;
            let idNew: string = null;

            guild.members.fetch(user.id).then(member => {
                userVoiceState = member.guild.voiceStates.cache.find(userFind => userFind.id === user.id);

                guild.channels.create(name, options).then(async data => {
                    idNew = data.id;
                    const channelNew: ds.VoiceChannel = await guild.channels.fetch(idNew).then((ch: ds.VoiceChannel) => { return ch })
                    userVoiceState.setChannel(channelNew)
                        .then(res => { ; })
                        .catch(err => { ; });
                    repeatCheck(channelNew);
                });
            });
        }
    });

    /**
     * Create channel with limit is 4
     */
     client.channels.fetch(voiceChannels.four.id).then((channel: ds.VoiceChannel | null) => {
        if (channel == null || channel.full == null || channel.full === false) return;

        const parent = channel.parent;
        const guild = channel.guild;
        const name = voiceChannels.four.name;
        const options: ds.GuildChannelCreateOptions = {
            type: 'GUILD_VOICE',
            userLimit: 4,
            position: parent.position + 10,
            parent: parent,
            reason: `Created channel for `,
        }
        const user = channel.members.first();
        options.reason += `${user.user.username}`;
        voiceUsers.push(user.id);
        if (banVoiceUsers.includes(user.id) === true) {
            let userVoiceState: ds.VoiceState = null;
            guild.members.fetch(user.id).then(member => {
                userVoiceState = member.guild.voiceStates.cache.find(userFind => userFind.id === user.id);
                userVoiceState.disconnect('User created too many channels');
                return;
            });
        } else {
            let userVoiceState: ds.VoiceState = null;
            let idNew: string = null;

            guild.members.fetch(user.id).then(member => {
                userVoiceState = member.guild.voiceStates.cache.find(userFind => userFind.id === user.id);

                guild.channels.create(name, options).then(async data => {
                    idNew = data.id;
                    const channelNew: ds.VoiceChannel = await guild.channels.fetch(idNew).then((ch: ds.VoiceChannel) => { return ch })
                    userVoiceState.setChannel(channelNew)
                        .then(res => { ; })
                        .catch(err => { ; });
                    repeatCheck(channelNew);
                });
            });
        }
    });

    /**
     * Create channel with limit is 5
     */
     client.channels.fetch(voiceChannels.five.id).then((channel: ds.VoiceChannel | null) => {
        if (channel == null || channel.full == null || channel.full === false) return;

        const parent = channel.parent;
        const guild = channel.guild;
        const name = voiceChannels.five.name;
        const options: ds.GuildChannelCreateOptions = {
            type: 'GUILD_VOICE',
            userLimit: 5,
            position: parent.position + 10,
            parent: parent,
            reason: `Created channel for `,
        }
        const user = channel.members.first();
        options.reason += `${user.user.username}`;
        voiceUsers.push(user.id);
        if (banVoiceUsers.includes(user.id) === true) {
            let userVoiceState: ds.VoiceState = null;
            guild.members.fetch(user.id).then(member => {
                userVoiceState = member.guild.voiceStates.cache.find(userFind => userFind.id === user.id);
                userVoiceState.disconnect('User created too many channels');
                return;
            });
        } else {
            let userVoiceState: ds.VoiceState = null;
            let idNew: string = null;

            guild.members.fetch(user.id).then(member => {
                userVoiceState = member.guild.voiceStates.cache.find(userFind => userFind.id === user.id);

                guild.channels.create(name, options).then(async data => {
                    idNew = data.id;
                    const channelNew: ds.VoiceChannel = await guild.channels.fetch(idNew).then((ch: ds.VoiceChannel) => { return ch })
                    userVoiceState.setChannel(channelNew)
                        .then(res => { ; })
                        .catch(err => { ; });
                    repeatCheck(channelNew);
                });
            });
        }
    });
}, 1000)

/* CLASSES */
export class discord {

}

/* FUNCTIONS */
/**
 * Check moderation permissions
 */
async function isMod(userID: string): Promise<boolean> {
    const userMod = await (_guild.members.fetch(userID).then(user => { return user.roles.cache.find(role => role.id === '799561051905458176') }));
    return (userMod == null) ? false : true;
}

/**
 * Create log in channel
 */
async function createLog(title?: string, text?: string) {
    const embed = new ds.MessageEmbed()
        .setColor(0xf05656)
        .setFooter(`With ❤️ by Jourloy`);
    if (title != null) embed.setTitle(title);
    if (text != null) embed.setDescription(text);
    if (text == null && title == null) return;

    _guild.channels.fetch('818566531486187611').then((channel: ds.TextChannel) => channel.send({ embeds: [embed] }));
}

/* REACTIONS */
client.on('messageCreate', async msg => {
    if (msg.author.bot === true) return;

    const info = {
        isGuild: (msg.guild == null) ? false : true,
        channelID: msg.channel.id,
        channel: msg.channel,
        authorID: msg.author.id,
        author: msg.author,
        content: msg.content,
        splited: msg.content.split(' '),
        command: msg.content.split(' ')[0].split('!')[1],
    }

    /* <=========================== MODERATOR COMMANDS ===========================> */

    if (info.isGuild === true && await isMod(info.authorID) === true) {
        if (info.command === 'ping') info.channel.send('Pong');

        if (info.command === 'test') {
            const button = buttons.createButton('Тест', 'PRIMARY', 'test-id');
            info.channel.send({ content: 'test', components: [button] })
        }

        if (info.command === 'clear') {
            const count = (isNaN(parseInt(info.splited[1])) === false) ? 100 : parseInt(info.splited[1]);
            info.channel.messages.fetch({ limit: count }).then(async messages => {
                createLog('ВНИМАНИЕ', `Модератор (<@${info.authorID}>) запустил очистку ${count} сообщений`);
                let counter = 0;
                messages.forEach(ms => {
                    counter++;
                    ms.delete()
                    if (counter === count) return;
                });
            })
        }
    }

    /* <=========================== MY GUILD ===========================> */

    if (info.isGuild === true) {
        if (info.command === 'game') {
            const components = [];
            let game = '';
            for (let i in info.splited) {
                if (info.splited.indexOf(info.splited[i]) < 1) continue;
                else if (info.splited.indexOf(info.splited[i]) === 1) game += info.splited[i];
                else if (info.splited.indexOf(info.splited[i]) > 1) game += ` ${info.splited[i]}`;
            }
            if (game === '' || game.length < 3) return;
            hltbService.search(game).then(async result => {
                const games = [];
                const array = result;
                for (let i in array) {
                    const gameResult = array[i];
                    let match = gameResult.similarity;
                    match = Math.floor(match * 100)
                    if (match > 5) games.push({ match: match, result: gameResult });
                }
                let maxMatch = 0;
                let gameResult = null;
                for (let i in games) {
                    if (games[i].match > maxMatch) {
                        maxMatch = games[i].match;
                        gameResult = games[i].result;
                    }
                }
                if (gameResult == null) {
                    const embed = new ds.MessageEmbed()
                        .setColor(0xf05656)
                        .setTitle(`Игра не найдена`)
                        .setFooter(`With ❤️ by Jourloy`)
                    msg.channel.send({ embeds: [embed] });
                    return;
                }
                const embed = new ds.MessageEmbed()
                    .setColor(0xf05656)
                    .setTitle(`${gameResult.name}`)
                    .setDescription(`Сходство: ${maxMatch}%\n\n**Только сюжет:** ${gameResult.gameplayMain} часов\n**Сюжет и побочки:** ${gameResult.gameplayMainExtra} часов\n**100% прохождение:** ${gameResult.gameplayCompletionist} часов`)
                    .setFooter(`With ❤️ by Jourloy`)
                    .setImage('https://howlongtobeat.com' + gameResult.imageUrl)
                const appid = await steam.getAppID(gameResult.name);
                if (appid != null) {
                    const appdetails = await steam.getAppDetails(appid);
                    const data = appdetails[appid].data;

                    if (data != null && data.price_overview != null) {
                        let price = '';
                        if (data.is_free === true) price = 'Стоимость: Бесплатно'
                        else if (data.price_overview.final == null) price = `Стоимость: ${data.price_overview.initial_formatted}`;
                        else if (data.price_overview.final < data.price_overview.initial) price = `Стоимость: ${data.price_overview.final_formatted} (~~${data.price_overview.initial_formatted}~~)`;
                        else price = `Стоимость: ${data.price_overview.final_formatted}`;

                        let platforms = 'Платформы: ';
                        if (data.platforms.windows === true) platforms += '<:mods_windows:886933929221824572>';
                        if (data.platforms.mac === true) platforms += ' <:mods_mac:886933931331579925>';
                        if (data.platforms.linux === true) platforms += ' <:mods_linux:886934566437257267>';

                        embed.description += `\n\n> **STEAM**\n\n${price}\n${platforms}`;

                        const button = buttons.createURLButton('STEAM', 'LINK', `https://store.steampowered.com/app/${appid}/`);
                        components.push(button);
                    }
                }
                msg.channel.send({ embeds: [embed], components: components });
            });
        }
    }
})