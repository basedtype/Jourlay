/* IMPORTS */
import { binance } from "../Binance/binance";
import { manager } from "../database/main";
import { client, _guild } from "./main";
import { tools } from "../tools/main";
import { steam } from "../Steam/main";
import { buttons } from "./buttons";
import { gog } from "../GOG/main";

import { HowLongToBeatService, HowLongToBeatEntry } from 'howlongtobeat';
const Binance = require('node-binance-api');
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
const sended = {
    crypto: false,
}
const hltbService = new HowLongToBeatService();
const checkVoiceChannels = {};
let banVoiceUsers: string[] = [];
let voiceUsers: string[] = [];

/* INTERVALS */
/**
 * Send information about sales
 * Send information about cryptocurrency
 */
setInterval(async () => {
    const time = new Date();
    const hour = time.getHours();
    const minutes = time.getMinutes();

    if (hour === 15 && minutes >= 5 && minutes < 10 && sendSales.steam === false) {
        steam.getFeatured().then(async data => {
            if (data.specials.items[0].currency !== 'RUB') return;
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
                channel.send({ embeds: [embed] });
                sendSales.steam = true;
                setTimeout(() => { sendSales.steam = false }, tools.convertTime({ hours: 2 }));
            });
            client.channels.fetch('881988459437359135').then((channel: ds.TextChannel) => { channel.send({ embeds: [embed] }) });
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
                    channel.send({ embeds: [embed] });
                    sendSales.egs = true;
                    setTimeout(() => { sendSales.egs = false }, tools.convertTime({ hours: 2 }));
                });
                client.channels.fetch('881988459437359135').then((channel: ds.TextChannel) => { channel.send({ embeds: [embed] }) });
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
                channel.send({ embeds: [embed] });
                sendSales.gog = true;
                setTimeout(() => { sendSales.gog = false }, tools.convertTime({ hours: 2 }));
            });
            client.channels.fetch('881988459437359135').then((channel: ds.TextChannel) => { channel.send({ embeds: [embed] }) });
        })
    }

    if (hour === 15 && minutes >= 0 && minutes < 10 && sended.crypto === false) {

        const bot: any = await manager.configGetBot('Nidhoggbot', 'Binance');

        const binanceClient = new Binance().options({
            APIKEY: bot.api_key,
            APISECRET: bot.oauth
        })

        await binanceClient.prices(async (err, prices) => {
            if (!err) {
                const information = {
                    BTCtoUSD: Math.round(parseFloat(prices.BTCUSDT)),
                    BTCtoRUB: Math.round(parseFloat(prices.BTCRUB)),
                    ETHtoUSD: Math.round(parseFloat(prices.ETHUSDT)),
                    ETHtoRUB: Math.round(parseFloat(prices.ETHRUB)),
                }
                const embed = new ds.MessageEmbed()
                    .setColor(0xf05656)
                    .setFooter(`With ❤️ by Jourloy`)
                    .addFields(
                        { name: `BTC`, value: `**USD:** ${information.BTCtoUSD}$\n**RUB:** ${information.BTCtoRUB}₽`, inline: true },
                        { name: `ETH`, value: `**USD:** ${information.ETHtoUSD}$\n**RUB:** ${information.ETHtoRUB}₽`, inline: true },
                    )
                client.channels.fetch('892576972650209311').then((channel: ds.TextChannel) => {
                    channel.send({ embeds: [embed] });
                    sended.crypto = true;
                    setTimeout(() => { sended.crypto = false; }, tools.convertTime({ hours: 2 }));
                });
            } else console.log(err);
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
    _guild.channels.cache.forEach((channel) => { if (channel.type === 'GUILD_VOICE' && (channel.name === voiceChannels.duo.name || channel.name === voiceChannels.trio.name || channel.name === voiceChannels.four.name || channel.name === voiceChannels.five.name)) channels.push(channel) });
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
    _guild.channels.cache.forEach((channel) => { if (channel.type === 'GUILD_VOICE' && (channel.name === voiceChannels.duo.name || channel.name === voiceChannels.trio.name || channel.name === voiceChannels.four.name || channel.name === voiceChannels.five.name)) channels.push(channel) });

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
                }, tools.convertTime({ minutes: 15 }));
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

setInterval(() => {
    manager.getAllNewWorldFishing().then(data => {
        for (let i in data) {
            const username = data[i].username;
            const times = data[i].times;

            const embed = new ds.MessageEmbed()
                .setColor(0xf05656)
                .setDescription(`${username} поймал рыбу\n\`\`\`Ожидание рыбы: ${times.wait}с\nЛовля: ${times.fish}с\nОбщее время: ${times.total}с\`\`\``)
                .setFooter(`With ❤️ by Jourloy`);
            client.channels.fetch('894522943881744384').then((channel: ds.TextChannel) => channel.send({embeds: [embed]}));
            manager.addFishToUserNewWorld(username);
        }
    })
}, 1000)

/* CLASSES */
export class discord {
    /**
     * Send noftification about starting stream
     */
    public static sendNoftification() {
        const embed = new ds.MessageEmbed()
            .setColor(0xf05656)
            .setTitle('СТРИМ ЗАПУЩЕН')
            .setDescription('Мы сидим на стриме и ждем когда ты уже прийдешь и напишешь в чат. Где ты?')
            .setImage('https://cdn.discordapp.com/attachments/867012893157359647/870472217400598548/240de9630b7799f5.png')
            .setFooter(`With ❤️ by Jourloy`);
        const button = buttons.createURLButton('ПЕРЕЙТИ НА ТРАНСЛЯЦИЮ', 'LINK', 'https://www.twitch.tv/jourloy');
        client.channels.fetch('868517415787585656').then((channel: ds.TextChannel) => channel.send({ content: '<@&868513502443208704>', components: [button], embeds: [embed] }));
    }
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

    /* <=========================== CROSSPOST ===========================> */

    if (info.channelID === '868517415787585656') msg.crosspost();
    if (info.channelID === '869957685326524456') msg.crosspost();
    if (info.channelID === '892576972650209311') msg.crosspost();

    if (msg.author.bot === true) return;

    /* <=========================== MODERATOR COMMANDS ===========================> */

    if (info.isGuild === true && msg.guild.id === '437601028662231040' && await isMod(info.authorID) === true) {
        if (info.command === 'ping') info.channel.send('Pong');

        if (info.command === 'test') {
            const button = buttons.createButton('Тест', 'PRIMARY', 'test-id');
            info.channel.send({ content: 'test', components: [button] })
        }

        if (info.command === 'clear') {
            const count = (isNaN(parseInt(info.splited[1])) === false) ? parseInt(info.splited[1]) + 1 : 100;
            info.channel.messages.fetch({ limit: count }).then(async messages => {
                createLog('ВНИМАНИЕ', `Модератор (<@${info.authorID}>) запустил очистку ${count} сообщений`);
                messages.forEach(ms => { ms.delete() });
            })
        }
    }

    /* <=========================== GLOBAL ===========================> */

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
                        console.log(data)
                        let price = '';
                        if (data.is_free === true) price = 'Стоимость: Бесплатно'
                        else if (data.price_overview.final == null) price = `Стоимость: ${data.price_overview.initial_formatted}`;
                        else if (data.price_overview.final < data.price_overview.initial) price = `Стоимость: ${data.price_overview.final_formatted} (~~${data.price_overview.initial_formatted}~~)`;
                        else price = `Стоимость: ${data.price_overview.final_formatted}`;

                        const achiv = `Количество достижений: ${data.achievements.total}`;

                        let platforms = 'Платформы: ';
                        if (data.platforms.windows === true) platforms += '<:mods_windows:886933929221824572>';
                        if (data.platforms.mac === true) platforms += ' <:mods_mac:886933931331579925>';
                        if (data.platforms.linux === true) platforms += ' <:mods_linux:886934566437257267>';

                        embed.description += `\n\n> **STEAM**\n\n${price}\n${achiv}\n${platforms}`;

                        const button = buttons.createURLButton('STEAM', 'LINK', `https://store.steampowered.com/app/${appid}/`);
                        components.push(button);
                    }
                }
                msg.channel.send({ embeds: [embed], components: components });
            });
        }
    }

    /* <=========================== TECH GUILD ===========================> */

    /* <=========================== MY GUILD ===========================> */

    if (info.isGuild === true && msg.guildId === '437601028662231040') {
        if (info.command === 'чего') {
            const alphabet = {
                'q': 'й',
                'w': 'ц',
                'e': 'у',
                'r': 'к',
                't': 'е',
                'y': 'н',
                'u': 'г',
                'i': 'ш',
                'o': 'щ',
                'p': 'з',
                '[': 'х',
                ']': 'ъ',
                'a': 'ф',
                's': 'ы',
                'd': 'в',
                'f': 'а',
                'g': 'п',
                'h': 'р',
                'j': 'о',
                'k': 'л',
                'l': 'д',
                ';': 'ж',
                '\'': 'э',
                '\\': 'ё',
                'z': 'я',
                'x': 'ч',
                'c': 'с',
                'v': 'м',
                'b': 'и',
                'n': 'т',
                'm': 'ь',
                ',': 'б',
                '.': 'ю',
            }
            let ms = '';
            for (let i in info.splited) {
                if (info.splited.indexOf(info.splited[i]) < 1) continue;
                else if (info.splited.indexOf(info.splited[i].toLocaleLowerCase()) === 1) ms += info.splited[i];
                else if (info.splited.indexOf(info.splited[i].toLocaleLowerCase()) > 1) ms += ` ${info.splited[i]}`;
            }
            const newMs = ms.split('');
            let formated = '';
            for (let i in newMs) {
                if (alphabet[newMs[i]] == null) formated += newMs[i];
                else if (alphabet[newMs[i]] != null) formated += alphabet[newMs[i]];
            }
            const embed = new ds.MessageEmbed()
                .setColor(0xf05656)
                .setDescription(`Было: \`${ms}\`\nСтало: \`${formated}\``)
                .setFooter(`With ❤️ by Jourloy`)
            info.channel.send({embeds: [embed]});
        } else if (info.command === 'nw') {
            const nickname = info.splited[1];
            manager.getUserNewWorld(nickname).then(user => {
                if (user == null) return;
                const embed = new ds.MessageEmbed()
                    .setColor(0xf05656)
                    .setTitle(user.username)
                    .setDescription(`Наловил рыбы: ${user.fishCount}`)
                    .setFooter(`With ❤️ by Jourloy`)
                info.channel.send({embeds: [embed]})
            })
        }
    }

})

client.on('messageDelete', msg => {
    if (msg.guild == null || msg.guild.id !== '437601028662231040') return;
    if (msg.channel.id === '818566531486187611') return;
    client.channels.fetch('818566531486187611').then((channel: ds.TextChannel) => {
        let embeds = [];
        let attachments = []
        const embed = new ds.MessageEmbed()
            .setColor(0xf05656)
            .setDescription(`Содержание:\n\`\`\`${msg.content}\`\`\``)
            .setFooter(`With ❤️ by Jourloy`)
        embeds.push(embed)
        if (msg.attachments.toJSON().length > 0) for (let i in msg.attachments.toJSON()) attachments.push(msg.attachments.toJSON()[i]);
        if (msg.embeds.length > 0) for (let i in msg.embeds) embeds.push(msg.embeds[i]);
        channel.send({ content: `<@${msg.author.id}> удалил свое сообщение`, embeds: [embed], files: attachments });
    });
})

client.on("guildMemberAdd", (member) => {
    if (member.guild.id !== '437601028662231040') return;

    client.channels.fetch('869693463510278245').then((channel: ds.TextChannel) => {
        const embed = new ds.MessageEmbed()
            .setColor(0xf05656)
            .setTitle('ПРИВЕТ!')
            .setDescription(`Рад тебя видеть на моем сервере, уверяю, здесь ты найдешь много интересного

В <#865580513879261194> есть основная информация, которую можешь прочитать
Загляни в <#868238068283473952> и выбери себе роли, которые подходят больше всего для тебя
Передавай всем привет в <#868108110001221632>
Удачи!`)
            .setFooter(`With ❤️ by Jourloy`)
        channel.send({ content: `<@${member.id}>`, embeds: [embed] }).then(mss => mss.react('👋'));
    });
})

client.on('guildMemberRemove', (member) => {
    if (member.guild.id !== '437601028662231040') return;
    createLog('-', `Пользователь ${member.displayName} (ID: ${member.id}) покинул сервер`)
})

client.on('guildBanAdd', ban => {
    const guild = ban.guild;
    const user = ban.user;
    const reason = (ban.reason != null) ? ban.reason : '';
    if (guild.id !== '437601028662231040') return;
    createLog('-', `Пользователь ${user.username} (ID: ${user.id}) был __забанен__ на сервере.\nПричина: \`${reason}\``)
})

client.on('guildBanRemove', unban => {
    const guild = unban.guild;
    const user = unban.user;
    if (guild.id !== '437601028662231040') return;
    createLog('-', `Пользователь ${user.username} (ID: ${user.id}) был __разбанен__ на сервере`)
})