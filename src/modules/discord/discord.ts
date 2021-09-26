/* IMPORTS */
import { twitchClient } from "../twitch/main";
import { manager } from "../database/main";
import { loadout } from "../COD/loadouts";
import { client, _jourloy } from "./main";
import { defence } from "../defence/main";
import { game } from "../twitch/uptime";
import { tools } from "../tools/main";
import { steam } from "../Steam/main";
import { role } from "./description";
import { logs } from "../tools/logs";
import { buttons } from "./buttons";

import { HowLongToBeatService, HowLongToBeatEntry } from 'howlongtobeat';
import { getGames } from "epic-free-games";
import * as ytdl from 'ytdl-core';
import * as ds from '../../../discord.js';
import * as _ from "lodash";
import { gog } from "../GOG/main";

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
const hltbService = new HowLongToBeatService();
const checkVoiceChannels = {};
const checkMessages = {};
let banVoiceUsers: string[] = [];
let voiceUsers: string[] = [];
let musicType = 'lofi';
let checkRules = false;
let checkRoles = false;
let checkNSFW = false;
let sendSales = {
    steam: false,
    egs: false,
    gog: false,
}
let oldUrl = '';

/* INTERVALS */
/**
 * Check rules and roles for emoutes
 */
setInterval(async () => {
    if (checkRoles === false) {
        client.channels.fetch('868238068283473952').then((channel: ds.TextChannel) => {
            channel.messages.fetch().then(messArray => {
                const mess = messArray.first();
                channel.messages.cache.get(mess.id);
                checkRoles = true;
            })
        })
    }

    if (checkNSFW === false) {
        client.channels.fetch('887612221272784916').then((channel: ds.TextChannel) => {
            channel.messages.fetch().then(messArray => {
                const mess = messArray.first();
                channel.messages.cache.get(mess.id);
                checkNSFW = true;
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

    if (hour === 21 && minutes >= 0 && minutes < 15 && sendSales.steam === false) {
        steam.getFeatured().then(async data => {
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
            const guildSales = await manager.guildGetAll();
            for (let i in guildSales) {
                if (guildSales[i].salesID == null || guildSales[i].sended == null) {
                    //createLog(`Гильдия не объявила канал`, `guildID: ${guildSales[i].id}`);
                    manager.guildSalesSendedSteamSwitch(guildSales[i].id);
                    continue;
                };
                if (guildSales[i].sended === true) continue;
                client.channels.fetch(guildSales[i].salesID).then((channel: ds.TextChannel) => {
                    if (channel == null) {
                        createLog(`Гильдия удалила канал`, `ID: ${guildSales[i].id}`);
                        manager.guildSalesSendedSteamSwitch(guildSales[i].id);
                    } else {
                        channel.send({embeds: [embed]});
                        manager.guildSalesSendedSteamSwitch(guildSales[i].id);
                    }
                })
                    .catch(() => {
                        createLog(`Гильдия запретила писать`, `guildID: ${guildSales[i].id}`);
                        manager.guildSalesSendedSteamSwitch(guildSales[i].id);
                    })
            }
            setTimeout(async () => {
                const guildSales = await manager.guildGetAll();
                for (let i in guildSales) {
                    if (guildSales[i].sended != null) manager.guildSalesSendedSteamSwitch(guildSales[i].id);
                }
            }, tools.convertTime({ hours: 2 }));
        })
    } else if (hour === 21 && minutes >= 15 && minutes < 20 && sendSales.egs === false) {
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
                const guildSales = await manager.guildGetAll();
                for (let i in guildSales) {
                    if (guildSales[i].salesID == null || guildSales[i].sended == null) {
                        //createLog(`Гильдия не объявила канал`, `guildID: ${guildSales[i].id}`);
                        manager.guildSalesSendedEGSSwitch(guildSales[i].id);
                        continue;
                    };
                    if (guildSales[i].sended === true) continue;
                    client.channels.fetch(guildSales[i].salesID).then((channel: ds.TextChannel) => {
                        if (channel == null) {
                            createLog(`Гильдия удалила канал`, `ID: ${guildSales[i].id}`);
                            manager.guildSalesSendedEGSSwitch(guildSales[i].id);
                        } else {
                            channel.send({embeds: [embed]});
                            manager.guildSalesSendedEGSSwitch(guildSales[i].id);
                        }
                    })
                        .catch(() => {
                            createLog(`Гильдия запретила писать`, `guildID: ${guildSales[i].id}`);
                            manager.guildSalesSendedEGSSwitch(guildSales[i].id);
                        })
                }
                setTimeout(async () => {
                    const guildSales = await manager.guildGetAll();
                    for (let i in guildSales) {
                        if (guildSales[i].sended != null) manager.guildSalesSendedEGSSwitch(guildSales[i].id);
                    }
                }, tools.convertTime({ hours: 2 }));
            })
            .catch(err => console.log(err))
    } else if (hour === 21 && minutes >= 10 && minutes < 15 && sendSales.gog === false) {
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
            const guildSales = await manager.guildGetAll();
            for (let i in guildSales) {
                if (guildSales[i].salesID == null || guildSales[i].sended == null) {
                    //createLog(`Гильдия не объявила канал`, `guildID: ${guildSales[i].id}`);
                    manager.guildSalesSendedGOGSwitch(guildSales[i].id);
                    continue;
                };
                if (guildSales[i].sended === true) continue;
                client.channels.fetch(guildSales[i].salesID).then((channel: ds.TextChannel) => {
                    if (channel == null) {
                        createLog(`Гильдия удалила канал`, `ID: ${guildSales[i].id}`);
                        manager.guildSalesSendedGOGSwitch(guildSales[i].id);
                    } else {
                        channel.send({embeds: [embed]});
                        manager.guildSalesSendedGOGSwitch(guildSales[i].id);
                    }
                })
                    .catch(() => {
                        createLog(`Гильдия запретила писать`, `guildID: ${guildSales[i].id}`);
                        manager.guildSalesSendedGOGSwitch(guildSales[i].id);
                    })
            }
            setTimeout(async () => {
                const guildSales = await manager.guildGetAll();
                for (let i in guildSales) {
                    if (guildSales[i].sended != null) manager.guildSalesSendedGOGSwitch(guildSales[i].id);
                }
            }, tools.convertTime({ hours: 2 }));
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

    const channelsArray = Array.prototype.slice.call(_jourloy.guild.channels.cache, 0);
    const channels: ds.GuildChannel[] = [];
    for (let i in channelsArray) {
        if (channelsArray[i].type === 'voice' && (channelsArray[i].name === voiceChannels.duo.name || channelsArray[i].name === voiceChannels.trio.name || channelsArray[i].name === voiceChannels.four.name || channelsArray[i].name === voiceChannels.five.name)) channels.push(channelsArray[i]);
    }
    for (let i in channels) {
        if (channels[i].members.values.length === 0) {
            channels[i].delete()
                .then(() => { logs.add(`Delete created channel (interval)`) })
                .catch(() => { });
        }
    }
}, 10000)


/**
 * Kick member from voice
 */
setInterval(() => {
    if (_jourloy.guild == null) return;
    const channelsArray = Array.prototype.slice.call(_jourloy.guild.channels.cache, 0);
    const channels: ds.GuildChannel[] = [];
    for (let i in channelsArray) {
        if (channelsArray[i].type === 'voice' && (channelsArray[i].name === voiceChannels.duo.name || channelsArray[i].name === voiceChannels.trio.name || channelsArray[i].name === voiceChannels.four.name)) channels.push(channelsArray[i]);
    }
    for (let i in channels) {
        if (channels[i].members.values.length !== 1) continue;
        else {
            if (checkVoiceChannels[channels[i].id] == null || checkVoiceChannels[channels[i].id] != null && checkVoiceChannels[channels[i].id].check === false) {
                checkVoiceChannels[channels[i].id] = { check: true };
                setTimeout(() => {
                    checkVoiceChannels[channels[i].id].check = false;
                    if (channels[i].members.values.length === 1) {
                        _jourloy.guild.members.fetch(Array.prototype.slice.call(channels[i].members, 0)[0].id).then(member => {
                            let userVoiceState: ds.VoiceState = null;
                            for (let j in Array.prototype.slice.call(member.guild.voiceStates.cache, 0)) {
                                if (Array.prototype.slice.call(channels[i].members, 0)[0].id === Array.prototype.slice.call(member.guild.voiceStates.cache, 0)[j].id) userVoiceState = Array.prototype.slice.call(member.guild.voiceStates.cache, 0)[j];
                            }
                            const chan = Array.prototype.slice.call(_jourloy.guild.channels.cache, 0);
                            for (let j in chan) {
                                if (chan[j].id === '885328250157535264') {
                                    userVoiceState.setChannel(chan[j], `<@${Array.prototype.slice.call(channels[i].members, 0)[0].id}> (${Array.prototype.slice.call(channels[i].members, 0)[0].id}) sited down in channel more than 10 minutes`);
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
        if (Array.prototype.slice.call(channelNew.members, 0).length === 0) {
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
/**
 * Create log in log channel
 */
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

    public static sendNoftificationInGuild(channelID: string, username: string) {
        const embed = new ds.MessageEmbed()
            .setColor(0xf05656)
            .setTitle(`СТРИМ НАЧАЛСЯ`)
            .setDescription(`Всем привет! А стрим то уже начался и в полном разгаре. Заходите скорей, чтобы не пропустить\n**[Перейти на твич](https://www.twitch.tv/${username})**`)
            .setImage('https://cdn.discordapp.com/attachments/867012893157359647/870472217400598548/240de9630b7799f5.png')
            .setFooter(`With ❤️ by Jourloy`);
        client.channels.fetch(channelID).then((channel: ds.TextChannel) => channel.send('<@&868513502443208704>', { embed: embed }));
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
client.on('guildCreate', guild => {
    manager.guildAdd(guild.id);
})

client.on('guildDelete', guild => {
    manager.guildRemove(guild.id);
})

client.on('message', async msg => {
    if (msg.author.bot === true) return;
    const channelID = msg.channel.id;
    const authorID = msg.author.id;
    const message = msg.content;
    const messageSplit = message.split(' ');
    const command = messageSplit[0].split('!')[1];

    if (msg.guild != null && msg.guild.id === '437601028662231040') {
        const defenceCheck = await defence.check(message.toLowerCase());
        if (defenceCheck.bool === false) {
            msg.delete();
            createLog('ВНИМАНИЕ', `<@${authorID}> использовал запретное слово`);
            return;
        }
    }

    /* <=========================== GLOBAL ===========================> */

    if (command === 'game') {
        let game = '';
        for (let i in messageSplit) {
            if (messageSplit.indexOf(messageSplit[i]) < 1) continue;
            else if (messageSplit.indexOf(messageSplit[i]) === 1) game += messageSplit[i];
            else if (messageSplit.indexOf(messageSplit[i]) > 1) game += ` ${messageSplit[i]}`;
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
                msg.channel.send(embed);
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
                const data = appdetails[appid].data

                if (data.price_overview != null) {
                    let price = '';
                    if (data.is_free === true) price = 'Стоимость: Бесплатно'
                    else if (data.price_overview.final == null) price = `Стоимость: ${data.price_overview.initial_formatted}`;
                    else if (data.price_overview.final < data.price_overview.initial) price = `Стоимость: ${data.price_overview.final_formatted} (~~${data.price_overview.initial_formatted}~~)`;
                    else price = `Стоимость: ${data.price_overview.final_formatted}`;

                    let platforms = 'Платформы: ';
                    if (data.platforms.windows === true) platforms += '<:mods_windows:886933929221824572>';
                    if (data.platforms.mac === true) platforms += ' <:mods_mac:886933931331579925>';
                    if (data.platforms.linux === true) platforms += ' <:mods_linux:886934566437257267>';

                    const inStore = `[В магазин](https://store.steampowered.com/app/${appid}/)`;

                    embed.description += `\n\n> **STEAM** (${inStore})\n\n${price}\n${platforms}`;
                }

            }

            msg.channel.send(embed);
        });
    }

    /* if (command === 'clear') {
        const limit = parseInt(messageSplit[1]) || 100;
        msg.channel.messages.fetch({ limit: limit }).then(mess => {
            const messages = mess.array();
            for (let i in messages) {
                if (msg.guild == null && messages[i].author.bot === false) continue;
                messages[i].delete();
            }
        })
    } */

    /* <=========================== DM ===========================> */

    if (msg.guild == null) {
        if (command === 'help') {
            const embed = new ds.MessageEmbed()
                .setColor(0xf05656)
                .setTitle(`КОМАНДЫ`)
                .setDescription(`Параметры в [] __не обязательно__ указывать\nПараметры в <> __обязательно__ указывать\n\n**Удалить сообщения (максимум 100): \`!clear [число]\`\n_По умолчанию удаляет 100 сообщений_`)
                .setFooter(`With ❤️ by Jourloy`)
            msg.channel.send(embed);
        }

        return;
    }

    if (msg.guild == null) return;

    /* <=========================== ALL GUILDS MESSAGES ===========================> */

    if (command === 'sales_enable') {
        manager.guildSalesAdd(msg.guild.id, msg.channel.id).then(state => {
            if (state === true) msg.channel.send('Готово, канал добавлен в рассылку **скидок и раздач**. Каждый день в 9 вечера ждите сообщения');
            else msg.channel.send('Произошла ошибка, сообщите пожалуйста разработчику ||_КОД ОШИБКИ: GIANT-WHITE-DUCK_||');
        })
    }

    /* <=========================== TECH GUILD MESSAGES ===========================> */

    if (msg.guild.id === '823463145963913236') {
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
                            mss.react('🖼️');
                            mss.react('🆓');
                            mss.react('🚫');
                            mss.react('🎥');
                            mss.react('🧸');
                            mss.react('🎀');
                            mss.react('<:mods_warzone_logo:873248548316131430>');
                            mss.react('<:mods_nw_logo:874610034783453225>');
                            mss.react('<:mods_genshin_logo:873249309435527169>');
                            mss.react('<:mods_csgo_logo:873248573020573747>');
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
                (await msg.channel.send('DONE')).delete({ timeout: 100 })
            }
            msg.delete();
        } else if (channelID === '885319115705823253') {
            if (command === 'add') {
                const url = messageSplit[1];
                const type = messageSplit[2];
                const state = await manager.musicAdd(url, type);
                if (state === true) {
                    const embed = new ds.MessageEmbed()
                        .setColor(0xf05656)
                        .setTitle(`DONE`)
                        .setFooter(`With ❤️ by Jourloy`);
                    (await msg.channel.send(embed)).delete({ timeout: tools.convertTime({ seconds: 10 }) });
                } else if (state === false) {
                    const embed = new ds.MessageEmbed()
                        .setColor(0xf05656)
                        .setTitle(`ALREADY EXIST`)
                        .setFooter(`With ❤️ by Jourloy`);
                    (await msg.channel.send(embed)).delete({ timeout: tools.convertTime({ seconds: 10 }) });
                }
            } else if (command === 'remove') {
                const url = messageSplit[1];
                const state = await manager.musicDelete(url);
                if (state === true) {
                    const embed = new ds.MessageEmbed()
                        .setColor(0xf05656)
                        .setTitle(`DONE`)
                        .setFooter(`With ❤️ by Jourloy`);
                    (await msg.channel.send(embed)).delete({ timeout: tools.convertTime({ seconds: 10 }) });
                } else if (state === false) {
                    const embed = new ds.MessageEmbed()
                        .setColor(0xf05656)
                        .setTitle(`ALREADY DELETED`)
                        .setFooter(`With ❤️ by Jourloy`);
                    (await msg.channel.send(embed)).delete({ timeout: tools.convertTime({ seconds: 10 }) });
                }
            } else if (command === 'help') {
                const embed = new ds.MessageEmbed()
                    .setColor(0xf05656)
                    .setTitle(`HELP`)
                    .setDescription(`\`!add <url> <type>\` - add music\n\`!remove <url>\` - delete music`)
                    .setFooter(`With ❤️ by Jourloy`);
                (await msg.channel.send(embed)).delete({ timeout: tools.convertTime({ seconds: 10 }) });
            }
            msg.delete();
        } else if (channelID === '887612221272784916') {
            if (msg.attachments.array().length !== 1) return;
            msg.react('<:JR_Check:860041751971889162>');
            msg.react('<:JR_Cross:860041692605841408>');
        }
    }


    if (msg.guild == null || msg.guild.id == null || msg.guild.id !== '437601028662231040') return;

    /* <=========================== JOURLOY GUILD MESSAGES ===========================> */

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
    } else if (command === 'test') {
        msg.channel.send('Тестовая кнопка');
    }

    if (channelID === '886915478923128833') {
        if (command === 'connect') {
            msg.delete();
            const channelName = messageSplit[1];
            manager.scoutAdd(channelName).then(async (state) => {
                if (state === true) msg.channel.send(`Готово, твич канал [ ${channelName} ] добавлен в базу данных`)
                else msg.channel.send('Ошибка')
            });
        }
    } else if (channelID === '825341850175930368') msg.crosspost();
    else if (channelID === '869957685326524456') msg.crosspost();
    else if (channelID === '872384571386261524') msg.crosspost();
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
        else if (emoji === 'mods_minecraft_logo') giveRoleAndPlaceReaction(msg, '871764506236301332', '<:mods_minecraft_logo:874609992454524928>');
        else if (emoji === 'mods_bf_logo') giveRoleAndPlaceReaction(msg, '871764590717984798', '<:mods_bf_logo:874609931200913448>');
        else if (emoji === 'mods_apex_logo') giveRoleAndPlaceReaction(msg, '874612514451779604', '<:mods_apex_logo:873248479454060544>');
        else if (emoji === 'mods_rust_logo') giveRoleAndPlaceReaction(msg, '874612553903382529', '<:mods_rust_logo:873248505743949844>');
        else if (emoji === 'mods_valorant_logo') giveRoleAndPlaceReaction(msg, '874612578175840286', '<:mods_valorant_logo:873248522688946197>');
        else if (emoji === '🎥') giveRoleAndPlaceReaction(msg, '871765683321589760', '🎥');
        else if (emoji === '🧸') giveRoleAndPlaceReaction(msg, '871765786308526130', '🧸');
        else if (emoji === '🎀') giveRoleAndPlaceReaction(msg, '871765898652954634', '🎀');
        else if (emoji === '🔔') giveRoleAndPlaceReaction(msg, '868513502443208704', '🔔');
        else if (emoji === '🖼️') giveRoleAndPlaceReaction(msg, '884444310483902475', '🖼️');
        else if (emoji === '🆓') giveRoleAndPlaceReaction(msg, '869960789405098004', '🆓');
        else if (emoji === '🚫') giveRoleAndPlaceReaction(msg, '875895580130422824', '🚫');
    } else if (channelID === '887612221272784916') {
        if (emoji === 'JR_Check') {
            const mss = msg.message;
            const attachment = mss.attachments.array()[0];
            client.channels.fetch('887612236275789824').then((channel: ds.TextChannel) => channel.send(attachment)).then(ms => manager.nsfwAdd(ms.attachments.array()[0].url));
            mss.delete();
        } else if (emoji === 'JR_Cross') msg.message.delete();
    }
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
        channel.send(`<@${member.id}>`, { embed: embed }).then(mss => mss.react('👋'));
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
    if (message.guild == null) return;
    if (message.guild.id !== '437601028662231040') return;
    if (message.channel.id === '818566531486187611' || message.channel.id === '799562265304891392' || message.channel.id === '868238068283473952') return;
    if (message.author.id === '308924864407011328' || message.author.id === '816872036051058698') return;
    createLog('-', `Автор сообщения: <@${message.author.id}>\nУдалил сообщение:\n\`\`\`${message.content}\`\`\``)
})