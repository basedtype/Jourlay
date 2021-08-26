/* IMPORTS */
import { manager } from "../database/main";
import { loadout } from "../COD/loadouts";
import { client, _jourloy } from "./main";
import { tools } from "../tools/main";
import { steam } from "../Steam/main";
import { role } from "./description";
import { logs } from "../tools/logs";

import { getGames } from "epic-free-games";
import * as ds from 'discord.js';
import * as _ from "lodash";

/* PARAM */
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
const checkVoiceChannels = {};
const checkMessages = {};
const invites = {};
let banVoiceUsers: string[] = [];
let voiceUsers: string[] = [];
let checkRules = false;
let checkRoles = false;
let sendSales = {
    steam: false,
    egs: false,
}

/* INTERVALS */
/**
 * Check rules and roles for emoutes
 */
setInterval(() => {
    client.guilds.cache.forEach(g => {
        g.fetchInvites().then(guildInvites => {
            invites[g.id] = guildInvites;
        });
    });
    if (checkRoles === false) {
        client.channels.fetch('868238068283473952').then((channel: ds.TextChannel) => {
            channel.messages.fetch().then(messArray => {
                const mess = messArray.array();
                channel.messages.cache.get(mess[0].id);
                checkRoles = true;
            })
        })
    }
}, 1000)

/**
 * Send information about sales
 */
setInterval(() => {
    const time = new Date();
    const hour = time.getHours();
    const minutes = time.getMinutes();

    if (hour === 21 && minutes > 0 && sendSales.steam === false) {
        steam.getFeatured().then(data => {
            const sales = data.specials.items;
            if (sales[0].currency !== 'RUB') return;
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
            client.channels.fetch('869957685326524456').then((channel: ds.TextChannel) => { channel.send(`<@&869960789405098004>`, { embed: embed }) })
            sendSales.steam = true;
            setTimeout(() => { sendSales.steam = false }, tools.convertTime({ hours: 2 }));
        })
    } else if (hour === 21 && minutes > 30 && sendSales.egs === false) {
        getGames('RU')
            .then(games => {
                const embed = new ds.MessageEmbed()
                    .setTitle('Epic Games Store')
                    .setColor(0xf05656)
                    .setFooter(`With ❤️ by Jourloy`)
                for (let i in games.currents) embed.addField(games.currents[i].title, `Раздается __на этой неделе__`);
                for (let i in games.nexts) {
                    embed.addField(games.nexts[i].title, `Раздается __на следующей неделе__`);
                }
                client.channels.fetch('869957685326524456').then((channel: ds.TextChannel) => { channel.send(`<@&869960789405098004>`, { embed: embed }) })
                sendSales.egs = true;
                setTimeout(() => { sendSales.egs = false }, tools.convertTime({ hours: 2 }));
            })
            .catch(err => console.log(err))
    }
}, 1000)

/**
 * Clear voice users array every 5 minutes
 */
setInterval(() => {
    voiceUsers = [];
    banVoiceUsers = [];
}, tools.convertTime({ minutes: 2 }));

/** */
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
            logs.add(`${i} created too many channels`);
            banVoiceUsers.push(i);
        }
    }
}, 500)

/**
 * Set member count in name of channel
 * Remove unused and undeleted channels
 */
setInterval(() => {
    if (_jourloy.guild == null) return;

    client.channels.fetch('871750394211090452').then((channel: ds.VoiceChannel) => {
        const memberCount = _jourloy.guild.memberCount;
        const channelName = channel.name.split(' ');

        if (parseInt(channelName[1]) != memberCount) channel.setName(`Участников: ${memberCount}`)
    })

    const channelsArray = _jourloy.guild.channels.cache.array();
    const channels: ds.GuildChannel[] = [];
    for (let i in channelsArray) {
        if (channelsArray[i].type === 'voice' && (channelsArray[i].name === voiceChannels.duo.name || channelsArray[i].name === voiceChannels.trio.name || channelsArray[i].name === voiceChannels.four.name || channelsArray[i].name === voiceChannels.five.name)) channels.push(channelsArray[i]);
    }
    for (let i in channels) {
        if (channels[i].members.array().length === 0) {
            channels[i].delete()
                .then(() => { logs.add(`Delete created channel (interval)`) })
                .catch(() => { });
        }
    }
}, 10000)


/**
 * Give inviter role
 */
setInterval(() => {
    if (_jourloy.guild == null) return;

    manager.getInviterMembers().then(members => {
        for (let i in members) {
            const member = members[i];

            if (member.inviteUses >= 1 && member.inviteUses < 25) {
                _jourloy.guild.roles.fetch('869690641708351498').then(role => {
                    _jourloy.guild.members.fetch(member.username)
                        .then(guildMember => {
                            const memberRoles = guildMember.roles.cache.array();
                            if (memberRoles.includes(role) !== true) {
                                guildMember.roles.add(role);
                                client.channels.fetch('868108110001221632').then((channel: ds.TextChannel) => {
                                    const embed = new ds.MessageEmbed()
                                        .setColor(0xf05656)
                                        .setTitle('Поздравляю и говорю спасибо!')
                                        .setDescription(`По твоим приглашениям пришел как минимум 1 человек! За это держи новую роль :)`)
                                        .setFooter(`With ❤️ by Jourloy`)
                                    channel.send(`${guildMember.displayName}`, { embed: embed }).then(mss => mss.react('🎉'));
                                })
                            }
                        })
                        .catch(err => { createLog(`ВНИМАНИЕ`, `Пользователь (ID: ${member.username}) есть в базе данных, но отсутствует на сервере`) })
                })
            } else if (member.inviteUses >= 25 && member.inviteUses < 50) {
                _jourloy.guild.roles.fetch('869690527308726303').then(role => {
                    _jourloy.guild.members.fetch(member.username)
                        .then(guildMember => {
                            const memberRoles = guildMember.roles.cache.array();
                            if (memberRoles.includes(role) !== true) {
                                guildMember.roles.add(role);
                                client.channels.fetch('868108110001221632').then((channel: ds.TextChannel) => {
                                    const embed = new ds.MessageEmbed()
                                        .setColor(0xf05656)
                                        .setTitle('Поздравляю и говорю спасибо!')
                                        .setDescription(`По твоим приглашениям пришло уже как минимум 25 человек! За это держи новую роль :)`)
                                        .setFooter(`With ❤️ by Jourloy`)
                                    channel.send(`${guildMember.displayName}`, { embed: embed }).then(mss => mss.react('🎉'));
                                })
                            }
                        })
                        .catch(err => { createLog(`ВНИМАНИЕ`, `Пользователь (ID: ${member.username}) есть в базе данных, но отсутствует на сервере`) })
                })
            } else if (member.inviteUses >= 50) {
                _jourloy.guild.roles.fetch('869690267203153981').then(role => {
                    _jourloy.guild.members.fetch(member.username)
                        .then(guildMember => {
                            const memberRoles = guildMember.roles.cache.array();
                            if (memberRoles.includes(role) !== true) {
                                guildMember.roles.add(role);
                                client.channels.fetch('868108110001221632').then((channel: ds.TextChannel) => {
                                    const embed = new ds.MessageEmbed()
                                        .setColor(0xf05656)
                                        .setTitle('Поздравляю и говорю спасибо!')
                                        .setDescription(`По твоим приглашениям пришло уже как минимум 50 человек! За это держи новую роль :)`)
                                        .setFooter(`With ❤️ by Jourloy`)
                                    channel.send(`${guildMember.displayName}`, { embed: embed }).then(mss => mss.react('🎉'));
                                })
                            }
                        })
                        .catch(err => { createLog(`ВНИМАНИЕ`, `Пользователь (ID: ${member.username}) есть в базе данных, но отсутствует на сервере`) })
                })
            }
        }
    })

    const channelsArray = _jourloy.guild.channels.cache.array();
    const channels: ds.GuildChannel[] = [];
    for (let i in channelsArray) {
        if (channelsArray[i].type === 'voice' && (channelsArray[i].name === voiceChannels.duo.name || channelsArray[i].name === voiceChannels.trio.name || channelsArray[i].name === voiceChannels.four.name)) channels.push(channelsArray[i]);
    }
    for (let i in channels) {
        if (channels[i].members.array().length !== 1) continue;
        else {
            if (checkVoiceChannels[channels[i].id] == null || checkVoiceChannels[channels[i].id] != null && checkVoiceChannels[channels[i].id].check === false) {
                checkVoiceChannels[channels[i].id] = { check: true };
                setTimeout(() => {
                    checkVoiceChannels[channels[i].id].check = false;
                    if (channels[i].members.array().length === 1) {
                        _jourloy.guild.members.fetch(channels[i].members.array()[0].id).then(member => {
                            let userVoiceState: ds.VoiceState = null;
                            for (let j in member.guild.voiceStates.cache.array()) {
                                if (channels[i].members.array()[0].id === member.guild.voiceStates.cache.array()[j].id) userVoiceState = member.guild.voiceStates.cache.array()[j];
                            }
                            const chan = _jourloy.guild.channels.cache.array();
                            for (let j in chan) {
                                if (chan[j].id === '406560230454067211') {
                                    userVoiceState.setChannel(chan[j], `<@${channels[i].members.array()[0].id}> (${channels[i].members.array()[0].id}) sited down in channel more than 10 minutes`);
                                    return;
                                }
                            }
                            return;
                        });
                    }
                }, tools.convertTime({ minutes: 10 }));
            }
        }
    }
}, 1000)

/**
 * Create voice channels
 */
setInterval(() => {
    if (_jourloy.guild == null) return;
    const deleteFunction = (channelNew: ds.GuildChannel) => {
        if (channelNew.members.array().length === 0) {
            channelNew.delete()
                .then(() => { logs.add(`Delete created channel (function)`) })
                .catch(() => { });
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
        const options: ds.GuildCreateChannelOptions = {
            type: 'voice',
            userLimit: 2,
            position: parent.position + 10,
            parent: parent,
        }
        const user = channel.members.array()[0].user;
        voiceUsers.push(user.id);
        if (banVoiceUsers.includes(user.id) === true) {
            let userVoiceState: ds.VoiceState = null;
            guild.members.fetch(user.id).then(member => {
                for (let i in member.guild.voiceStates.cache.array()) {
                    if (user.id === member.guild.voiceStates.cache.array()[i].id) userVoiceState = member.guild.voiceStates.cache.array()[i];
                }
                userVoiceState.kick(`Created too many channels`);
                logs.add(`Kick ${user.id} from voice channel`, true);
                return;
            });
        } else {
            let userVoiceState: ds.VoiceState = null;
            let channelNew: ds.GuildChannel = null;
            let idNew: string = null;

            guild.members.fetch(user.id).then(member => {
                for (let i in member.guild.voiceStates.cache.array()) {
                    if (user.id === member.guild.voiceStates.cache.array()[i].id) userVoiceState = member.guild.voiceStates.cache.array()[i];
                }

                guild.channels.create(name, options).then(data => {
                    idNew = data.id;
                    const guildChannels = guild.channels.cache.array();
                    for (let i in guildChannels) if (guildChannels[i].id === idNew) channelNew = guildChannels[i];
                    userVoiceState.setChannel(channelNew)
                        .then(res => { logs.add(`Create channel for ${user.id} with limit 2`) })
                        .catch(err => { logs.add(`${user.id} fast leaved from channel`, true, true) });
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
        const options: ds.GuildCreateChannelOptions = {
            type: 'voice',
            userLimit: 3,
            position: parent.position + 10,
            parent: parent,
        }
        const user = channel.members.array()[0].user;
        voiceUsers.push(user.id);
        if (banVoiceUsers.includes(user.id) === true) {
            let userVoiceState: ds.VoiceState = null;
            guild.members.fetch(user.id).then(member => {
                for (let i in member.guild.voiceStates.cache.array()) {
                    if (user.id === member.guild.voiceStates.cache.array()[i].id) userVoiceState = member.guild.voiceStates.cache.array()[i];
                }
                userVoiceState.kick(`Created too many channels`);
                logs.add(`Kick ${user.id} from voice channel`, true);
                return;
            });
        } else {
            let userVoiceState: ds.VoiceState = null;
            let channelNew: ds.GuildChannel = null;
            let idNew: string = null;

            guild.members.fetch(user.id).then(member => {
                for (let i in member.guild.voiceStates.cache.array()) {
                    if (user.id === member.guild.voiceStates.cache.array()[i].id) userVoiceState = member.guild.voiceStates.cache.array()[i];
                }

                guild.channels.create(name, options).then(data => {
                    idNew = data.id;
                    const guildChannels = guild.channels.cache.array();
                    for (let i in guildChannels) if (guildChannels[i].id === idNew) channelNew = guildChannels[i];
                    userVoiceState.setChannel(channelNew)
                        .then(res => { logs.add(`Create channel for ${user.id} with limit 3`) })
                        .catch(err => { logs.add(`${user.id} fast leaved from channel`, true, true) });
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
        const options: ds.GuildCreateChannelOptions = {
            type: 'voice',
            userLimit: 4,
            position: parent.position + 10,
            parent: parent,
        }
        const user = channel.members.array()[0].user;
        voiceUsers.push(user.id);
        if (banVoiceUsers.includes(user.id) === true) {
            let userVoiceState: ds.VoiceState = null;
            guild.members.fetch(user.id).then(member => {
                for (let i in member.guild.voiceStates.cache.array()) {
                    if (user.id === member.guild.voiceStates.cache.array()[i].id) userVoiceState = member.guild.voiceStates.cache.array()[i];
                }
                userVoiceState.kick(`Created too many channels`);
                logs.add(`Kick ${user.id} from voice channel`, true);
                return;
            });
        } else {
            let userVoiceState: ds.VoiceState = null;
            let channelNew: ds.GuildChannel = null;
            let idNew: string = null;

            guild.members.fetch(user.id).then(member => {
                for (let i in member.guild.voiceStates.cache.array()) {
                    if (user.id === member.guild.voiceStates.cache.array()[i].id) userVoiceState = member.guild.voiceStates.cache.array()[i];
                }

                guild.channels.create(name, options).then(data => {
                    idNew = data.id;
                    const guildChannels = guild.channels.cache.array();
                    for (let i in guildChannels) if (guildChannels[i].id === idNew) channelNew = guildChannels[i];
                    userVoiceState.setChannel(channelNew)
                        .then(res => { logs.add(`Create channel for ${user.id} with limit 4`) })
                        .catch(err => { logs.add(`${user.id} fast leaved from channel`, true, true) });
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
        const options: ds.GuildCreateChannelOptions = {
            type: 'voice',
            userLimit: 5,
            position: parent.position + 10,
            parent: parent,
        }
        const user = channel.members.array()[0].user;
        voiceUsers.push(user.id);
        if (banVoiceUsers.includes(user.id) === true) {
            let userVoiceState: ds.VoiceState = null;
            guild.members.fetch(user.id).then(member => {
                for (let i in member.guild.voiceStates.cache.array()) {
                    if (user.id === member.guild.voiceStates.cache.array()[i].id) userVoiceState = member.guild.voiceStates.cache.array()[i];
                }
                userVoiceState.kick(`Created too many channels`);
                logs.add(`Kick ${user.id} from voice channel`, true);
                return;
            });
        } else {
            let userVoiceState: ds.VoiceState = null;
            let channelNew: ds.GuildChannel = null;
            let idNew: string = null;

            guild.members.fetch(user.id).then(member => {
                for (let i in member.guild.voiceStates.cache.array()) {
                    if (user.id === member.guild.voiceStates.cache.array()[i].id) userVoiceState = member.guild.voiceStates.cache.array()[i];
                }

                guild.channels.create(name, options).then(data => {
                    idNew = data.id;
                    const guildChannels = guild.channels.cache.array();
                    for (let i in guildChannels) if (guildChannels[i].id === idNew) channelNew = guildChannels[i];
                    userVoiceState.setChannel(channelNew)
                        .then(res => { logs.add(`Create channel for ${user.id} with limit 5`) })
                        .catch(err => { logs.add(`${user.id} fast leaved from channel`, true, true) });
                    repeatCheck(channelNew);
                });
            });
        }
    });

}, 1000)

/* FUNCTIONS */
function createLog(title: string, description: string) {
    client.channels.fetch('818566531486187611').then((channel: ds.TextChannel) => {
        const embed = new ds.MessageEmbed()
            .setColor(0xf05656)
            .setDescription(description)
            .setFooter(`With ❤️ by Jourloy`);
        if (title != '-') embed.setTitle(title);
        channel.send(embed);
    });
}

function giveRoleAndPlaceReaction(msg: ds.MessageReaction, roleID: string, reaction: string) {
    _jourloy.guild.roles.fetch(roleID).then(role => {
        const users = msg.users.cache.array();
        for (let i in users) {
            const user = users[i];
            const guild = msg.message.guild;

            if (user.id === '816872036051058698') continue;

            guild.members.fetch(user.id).then(member => {
                const roles = member.roles.cache.array();
                let check = false;
                for (let j in roles) {
                    if (roles[j].id === role.id) {
                        check = true;
                        member.roles.remove(role);
                    }
                }
                if (check === false) {
                    member.roles.add(role);
                }

                msg.remove();
                msg.message.react(reaction)
            })
        }
    })
}

async function isModerator(userID: string): Promise<boolean> {
    const member = await _jourloy.guild.members.fetch(userID);
    const role = await _jourloy.guild.roles.fetch('799561051905458176')
    if (member.roles.cache.array().includes(role) === true) return true;
    else return false;
}

/* CLASSES */
export class discord {

    public static checkName(id: string): boolean {
        const members = _jourloy.guild.members.cache.array();
        for (let i in members) {
            if (members[i].id === id) return true;
        }
        return false;
    }

    public static sendNoftification() {
        const embed = new ds.MessageEmbed()
            .setColor(0xf05656)
            .setTitle(`СТРИМ НАЧАЛСЯ`)
            .setDescription('Всем привет! А стрим то уже начался и в полном разгаре. Заходите скорей, чтобы не пропустить\n**[Перейти на твич](https://www.twitch.tv/jourloy)**')
            .setImage('https://cdn.discordapp.com/attachments/867012893157359647/870472217400598548/240de9630b7799f5.png')
            .setFooter(`With ❤️ by Jourloy`);
        client.channels.fetch('868517415787585656').then((channel: ds.TextChannel) => channel.send('<@&868513502443208704>', { embed: embed }));
    }

    public static sendCommercialLog() {
        const embed = new ds.MessageEmbed()
            .setColor(0xf05656)
            .setDescription('Реклама была запущена')
            .setFooter(`With ❤️ by Jourloy`);
        client.channels.fetch('874628758504636476').then((channel: ds.TextChannel) => channel.send(embed));
    }
}

/* REACTIONS */
client.on('message', async msg => {
    if (msg.author.bot === true) return;
    const channelID = msg.channel.id;
    const authorID = msg.author.id;
    const message = msg.content;
    const messageSplit = message.split(' ');
    const command = messageSplit[0].split('!')[1];

    /* <=========================== DM ===========================> */

    if (command === 'clear_dm' && msg.guild == null) {
        const limit = parseInt(messageSplit[1]) || 100;
        msg.channel.messages.fetch({ limit: limit }).then(mess => {
            const messages = mess.array();
            for (let i in messages) {
                if (messages[i].author.bot === false) continue;
                messages[i].delete();
            }
        })
    } else if (command === 'payment' && msg.guild == null) {
        const embed = new ds.MessageEmbed()
            .setColor(0xf05656)
            .setTitle(`Payments`)
            .addFields(
                { name: 'Card', value: '4274 3200 4873 8408' },
            )
            .setFooter(`With ❤️ by Jourloy`)
        msg.channel.send(embed);
    }

    if (msg.content[0] === '?' && msg.guild == null) {
        client.users.fetch('308924864407011328').then(user => {
            user.send(`MSG FROM **${msg.author.username} (${msg.author.id})**:\n\n${msg.content}`)
        })
    }

    if (authorID !== '308924864407011328') return;

    /* <=========================== DM FROM ME ===========================> */

    if (command === 'help' && msg.guild == null) {
        const embed = new ds.MessageEmbed()
            .setColor(0xf05656)
            .setTitle(`HELP`)
            .addFields(
                { name: 'Help', value: '`!jrly_help`\n`!nvy_help`' }
            )
            .setFooter(`With ❤️ by Jourloy`)
        msg.channel.send(embed);
    }

    /* <=========================== TECH GUILD MESSAGES ===========================> */

    if (msg.guild != null && msg.guild.id === '823463145963913236') {
        if (channelID === '871701756650868766') {
            msg.delete();
            const embed = new ds.MessageEmbed()
                .setColor(0xf05656)
                .setTitle(`АНОНС СТРИМА`)
                .setDescription(msg.content)
                .setImage('https://cdn.discordapp.com/attachments/867012893157359647/870472217400598548/240de9630b7799f5.png')
                .setFooter(`With ❤️ by Jourloy`);
            client.channels.fetch('868517415787585656').then((channel: ds.TextChannel) => {
                channel.send('<@&868513502443208704>', { embed: embed }).then(mss => {
                    const msgEmbed = new ds.MessageEmbed()
                        .setColor(0xf05656)
                        .setTitle('<:JR_Check:860041751971889162>')
                        .setDescription(`[Перейти к сообщению](${mss.url})`);
                    msg.channel.send(msgEmbed);
                })
            })
        } else if (channelID === '874246854869676083') {
            msg.delete();
            manager.defenceAddWord(msg.content).then(state => {
                if (state === true) {
                    const msgEmbed = new ds.MessageEmbed()
                        .setColor(0xf05656)
                        .setTitle('<:JR_Check:860041751971889162>')
                        .setDescription(`Слово добавлено в запрещенные`);
                    msg.channel.send(msgEmbed);
                } else {
                    const msgEmbed = new ds.MessageEmbed()
                        .setColor(0xf05656)
                        .setTitle('<:JR_Check:860041751971889162>')
                        .setDescription(`Слово не добавлено в запрещенные`);
                    msg.channel.send(msgEmbed);
                }
            });
        } else if (channelID === '875892575180030012') {
            if (command === 'help') {
                const embed = new ds.MessageEmbed()
                    .setColor(0xf05656)
                    .setDescription(`\`!update_roles\` - обновить сообщение о ролях`)
                    .setFooter(`With ❤️ by Jourloy`)
                msg.channel.send(embed);
            } else if (command === 'update_roles') {
                client.channels.fetch('868238068283473952').then((channel: ds.TextChannel) => {
                    channel.messages.fetch().then(messArray => {
                        const mess = messArray.array();
                        for (let i in mess) mess[i].delete().catch(() => { });

                        const embed = new ds.MessageEmbed()
                            .setColor(0xf05656)
                            .setTitle(`Роли`)
                            .setDescription(role)
                            .setFooter(`With ❤️ by Jourloy`)

                        channel.send(embed).then(mss => {
                            mss.react('🔔');
                            mss.react('🆓');
                            mss.react('🚫');
                            mss.react('👴');
                            mss.react('🎥');
                            mss.react('🧸');
                            mss.react('🎀');
                            mss.react('<:mods_warzone_logo:873248548316131430>');
                            mss.react('<:mods_nw_logo:874610034783453225>');
                            mss.react('<:mods_genshin_logo:873249309435527169>');
                            mss.react('<:mods_csgo_logo:873248573020573747>');
                            mss.react('<:mods_gta_logo:873248535112470619>');
                            mss.react('<:mods_bf_logo:874609931200913448>');
                            mss.react('<:mods_minecraft_logo:874609992454524928>');
                            mss.react('<:mods_valorant_logo:873248522688946197>');
                            mss.react('<:mods_rust_logo:873248505743949844>');
                            mss.react('<:mods_apex_logo:873248479454060544>');
                        })
                    })
                })
            }
        } else if (channelID === '880481554265157642') {
            const split = message.split(' | ');
            if (command === 'create') {
                manager.createRedirect(split[1], split[2]);
                msg.delete();
                (await msg.channel.send('DONE')).delete({timeout: 100})
            }
        }
    }


    if (msg.guild == null || msg.guild.id !== '437601028662231040') return;

    /* <=========================== GUILD MESSAGES ===========================> */

    if (command === 'create_embed' && channelID === '815257750879600642') {
        const splited = message.split(' | ');
        const chanID = splited[1];
        const title = splited[2];
        const description = splited[3];

        client.channels.fetch(chanID).then((channel: ds.TextChannel) => {
            const embed = new ds.MessageEmbed()
                .setColor(0xf05656)
                .setTitle(title)
                .setDescription(description)
                .setFooter(`With ❤️ by Jourloy`)
            channel.send(embed);
            msg.delete();
        })
    } else if (command === 'help' && channelID === '815257750879600642') {
        const embed = new ds.MessageEmbed()
            .setColor(0xf05656)
            .setTitle('ПОМОЩЬ')
            .addFields(
                { name: 'Send embed in channel', value: '`!create_embed | ID | Title | Description`' }
            )
            .setFooter(`With ❤️ by Jourloy`)
        msg.channel.send(embed);
        msg.delete();
    } else if (command === 'clear') {
        isModerator(msg.author.id).then(result => {
            if (result === false) return;
            let count = 100;
            if (isNaN(parseInt(messageSplit[1])) === false) count = parseInt(messageSplit[1]);
            msg.channel.messages.fetch({ limit: count }).then(async msgs => {
                let counter = 0;
                const messages = msgs.array();
                createLog('-', `Модератор <@${msg.author.id}> (ID: ${msg.author.id}) запустил очистку сообщений`)
                for (let i in messages) {
                    await messages[i].delete();
                    counter++;
                }
                createLog('-', `Было удалено: ${counter}`)
            })
        })
    }

    if (channelID === '816104930443395072') {
        const embed = loadout.getWeapon(command);
        msg.channel.send(embed);
    }
})

client.on('messageReactionAdd', (msg) => {
    const channelID = msg.message.channel.id;
    const emoji = msg.emoji.name;

    if (msg.me === true) return;

    if (emoji === '❌' && msg.message.guild == null) {
        if (msg.message.guild == null) msg.message.delete()
    }

    if (msg.message.guild == null) return;

    if (channelID === '868238068283473952') {
        if (emoji === 'mods_nw_logo') giveRoleAndPlaceReaction(msg, '868233813183053954', '<:mods_nw_logo:874610034783453225>');
        else if (emoji === 'mods_warzone_logo') giveRoleAndPlaceReaction(msg, '825341898318151681', '<:mods_warzone_logo:873248548316131430>');
        else if (emoji === 'mods_genshin_logo') giveRoleAndPlaceReaction(msg, '869757372917235742', '<:mods_genshin_logo:873249309435527169>');
        else if (emoji === 'mods_csgo_logo') giveRoleAndPlaceReaction(msg, '869947396816244766', '<:mods_csgo_logo:873248573020573747>');
        else if (emoji === 'mods_gta_logo') giveRoleAndPlaceReaction(msg, '871764416012640337', '<:mods_gta_logo:873248535112470619>');
        else if (emoji === 'mods_minecraft_logo') giveRoleAndPlaceReaction(msg, '871764506236301332', '<:mods_minecraft_logo:874609992454524928>');
        else if (emoji === 'mods_bf_logo') giveRoleAndPlaceReaction(msg, '871764590717984798', '<:mods_bf_logo:874609931200913448>');
        else if (emoji === 'mods_apex_logo') giveRoleAndPlaceReaction(msg, '874612514451779604', '<:mods_apex_logo:873248479454060544>');
        else if (emoji === 'mods_rust_logo') giveRoleAndPlaceReaction(msg, '874612553903382529', '<:mods_rust_logo:873248505743949844>');
        else if (emoji === 'mods_valorant_logo') giveRoleAndPlaceReaction(msg, '874612578175840286', '<:mods_valorant_logo:873248522688946197>');
        else if (emoji === '🎥') giveRoleAndPlaceReaction(msg, '871765683321589760', '🎥');
        else if (emoji === '🧸') giveRoleAndPlaceReaction(msg, '871765786308526130', '🧸');
        else if (emoji === '🎀') giveRoleAndPlaceReaction(msg, '871765898652954634', '🎀');
        else if (emoji === '🔔') giveRoleAndPlaceReaction(msg, '868513502443208704', '🔔');
        else if (emoji === '🆓') giveRoleAndPlaceReaction(msg, '869960789405098004', '🆓');
        else if (emoji === '👴') giveRoleAndPlaceReaction(msg, '870474144813289502', '👴');
        else if (emoji === '🚫') giveRoleAndPlaceReaction(msg, '875895580130422824', '🚫');
    }
})

client.on("guildMemberAdd", (member) => {
    if (member.guild.id !== '437601028662231040') return;

    member.guild.fetchInvites().then(guildInvites => {

        const ei = invites[member.guild.id];
        invites[member.guild.id] = guildInvites;

        const invite = guildInvites.find(i => ei.get(i.code).uses < i.uses);
        if (invite == null || invite.inviter == null || invite.inviter.username.toLowerCase() === 'jourloy') {
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
                channel.send(`<@${member.id}>`, { embed: embed }).then(mss => mss.react('👋'));
            });
            return;
        }
        const inviter = client.users.cache.get(invite.inviter.id);

        manager.updateInviterMember(inviter.id);

        client.channels.fetch('869693463510278245').then((channel: ds.TextChannel) => {
            const embed = new ds.MessageEmbed()
                .setColor(0xf05656)
                .setTitle('ПРИВЕТ!')
                .setDescription(`Рад тебя видеть на моем сервере, уверяю, здесь ты найдешь много интересного

В <#865580513879261194> есть основная информация, которую можешь прочитать
Загляни в <#868238068283473952> и выбери себе роли, которые подходят больше всего для тебя
Передавай всем привет в <#868108110001221632>
Удачи!

───────────────

<@${inviter.id}> пригласил этого замечательного участника нашего сообщества`)
                .setFooter(`With ❤️ by Jourloy`)
            channel.send(`<@${member.id}>`, { embed: embed }).then(mss => mss.react('👋'));
        })
    });
})

client.on('guildBanAdd', (guild, user) => {
    if (guild.id !== '437601028662231040') return;
    createLog('-', `Пользователь ${user.username} (ID: ${user.id}) был __забанен__ на сервере`)
})

client.on('guildBanRemove', (guild, user) => {
    if (guild.id !== '437601028662231040') return;
    createLog('-', `Пользователь ${user.username} (ID: ${user.id}) был __разбанен__ на сервере`)
})

client.on('guildMemberRemove', (member) => {
    if (member.guild.id !== '437601028662231040') return;
    createLog('-', `Пользователь ${member.displayName} (ID: ${member.id}) покинул сервер`)
})

client.on('messageDelete', (message) => {
    if (message.guild.id !== '437601028662231040') return;
    if (message.channel.id === '818566531486187611' || message.channel.id === '799562265304891392' || message.channel.id === '868238068283473952') return;
    if (message.author.id === '308924864407011328' || message.author.id === '816872036051058698') return;
    createLog('-', `Автор сообщения: <@${message.author.id}>\nУдалил сообщение:\n\`\`\`${message.content}\`\`\``)
})