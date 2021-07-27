/* IMPORTS */
import { manager } from "../database/main";
import { loadout } from "../COD/loadouts";
import { client, _jourloy } from "./main";
import { logs } from "../tools/logs";

import * as ds from 'discord.js';
import * as _ from "lodash";
import { tools } from "../tools/main";

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
const invites = {};
let voiceUsers: string[] = [];
let banVoiceUsers: string[] = [];
let checkRules = false;
let checkRoles = false;

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
            if (channel.messages.cache.array().length === 0) {
                channel.messages.fetch().then(messArray => {
                    const mess = messArray.array();
                    for (let i in mess) mess[i].delete();

                    const embed = new ds.MessageEmbed()
                        .setColor(0xf05656)
                        .setTitle(`Роли`)
                        .setDescription(`Роли позволяют видеть каналы, которые скрыты от других, искать напарников для определенный игры и отличаться в общем чате

Для выбора роли - **жми на эмоцию под сообщением**
Для отмены роли - **жми на эмоцию еще раз**
_(имей ввиду, что бот сразу уберет твою реакцию. Так и должно быть)_

> **РОЛИ (поставь реакцию ниже)**

**Общее**
🔔 = Получать уведомление о стримах

**Игровые**
🔫 = COD: Warzone
🗡 = New World

> **РОЛИ (нельзя получить просто так)**

**Общее**
<@&869690641708351498> - по твоим приглашениям (инвайты на сервер) пришел хотя бы 1 человек
<@&869690527308726303> - по твоим приглашениям (инвайты на сервер) пришло 25 и более людей
<@&869690267203153981> - по твоим приглашениям (инвайты на сервер) пришло 50 и более людей. Эта роль показывается отдельно и делает ник красного цвета
`)
                        .setFooter(`With ❤️ by Jourloy`)

                    channel.send(embed).then(mss => {
                        mss.react('🔔');
                        mss.react('🔫');
                        mss.react('🗡');
                    })
                })
            }
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
 * Remove unused and undeleted channels
 */
setInterval(() => {
    if (_jourloy.guild == null) return;
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
            position: 10,
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
            position: 10,
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
            position: 10,
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
            position: 10,
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

/* CLASSES */
export class discord {

    public static checkName(id: string): boolean {
        const members = _jourloy.guild.members.cache.array();
        for (let i in members) {
            if (members[i].id === id) return true;
        }
        return false;
    }

    public static sendPayRemind(tag: string) {
        if (tag === 'nvy') {
            manager.nvyGetServerConfig().then(configs => {
                if (configs.pays != null && configs.pays === true) {
                    client.users.fetch(configs.creator).then(user => {
                        const embed = new ds.MessageEmbed()
                            .setColor(0xf05656)
                            .setTitle(`Здравствуйте, ${user.username}`)
                            .setDescription('Теперь я буду помогать Вам не пропустить ни одной важной детали, связанной со мной. Не беспокойтесь насчет спама, я буду писать только 1-2 раза в месяц\n\n**Подписка:**\nИзначально ваша подписка начиналась 17 числа каждого месяца, но теперь подписка будет начинаться 1 числа каждого месяца, так что половина августа Вам в подарок 😁\n\n**Оплата:**\nЕще не поступила\n\n**Не нравится спам в личных сообщениях?**\nЖаль. Отправьте мне `!close_dm` и я буду присылать важную информацию в один из каналов на вашем сервере\nДоступные мне каналы: `server_logs`\n\n**Полезные команды:**')
                            .addFields(
                                { name: 'Задать вопрос', value: 'Начните сообщение со знака `?`', inline: true },
                                { name: 'Очистить переписку', value: '`!clear_dm`', inline: true },
                                { name: 'Отписаться от уведомлений', value: '`!close_dm`', inline: true },
                                { name: 'Как оплатить?', value: '`!payment`', inline: true },
                            )
                            .setImage('https://cdn.discordapp.com/attachments/867012893157359647/867012929865383956/Payment.png')
                            .setFooter(`With ❤️ by Jourloy`)
                        user.send(embed)
                            .then(() => {
                                client.channels.fetch('867026068241383424').then((channel: ds.TextChannel) => {
                                    channel.send('Message for NAMVSEYASNO delivered');
                                })
                            })
                            .catch(err => { console.log(err) });
                    })
                }
            })
        }
    }
}

/* REACTIONS */
client.on('message', msg => {
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
    } else if (command === 'remind' && channelID === '815257750879600642') {
        msg.delete();
        const tag = messageSplit[1];
        discord.sendPayRemind(tag);
        return;
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

    if (emoji === '❌') {
        if (msg.message.guild == null) {
            msg.message.delete()
        }
    } else if (emoji === '🗡') {
        if (msg.message.author.bot === true) {
            msg.message.guild.roles.fetch('868233813183053954').then(role => {
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
                        msg.message.react('🗡')
                    })
                }
            })
        }
    } else if (emoji === '🔫') {
        if (msg.message.author.bot === true) {
            msg.message.guild.roles.fetch('825341898318151681').then(role => {
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
                        msg.message.react('🔫')
                    })
                }
            })
        }
    } else if (emoji === '🔔') {
        if (msg.message.author.bot === true) {
            msg.message.guild.roles.fetch('868513502443208704').then(role => {
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
                        msg.message.react('🔔')
                    })
                }
            })
        }
    }
})

client.on("guildMemberAdd", (member) => {
    member.guild.fetchInvites().then(guildInvites => {

        const ei = invites[member.guild.id];
        invites[member.guild.id] = guildInvites;

        const invite = guildInvites.find(i => ei.get(i.code).uses < i.uses);
        if (invite == null || invite.inviter == null) {
            client.channels.fetch('869693463510278245').then((channel: ds.TextChannel) => {
                const embed = new ds.MessageEmbed()
                    .setColor(0xf05656)
                    .setTitle('ПРИВЕТ!')
                    .setDescription(`Рад тебя видеть на моем сервере, уверяю, здесь ты найдешь много интересного
    
В <#865580513879261194> есть основная информация, которую следует соблюдать
Загляни в <#868238068283473952> и выбери себе роли, которые подходят больше всего для тебя
Передавай всем привет в <#868108110001221632>
Удачи!`)
                    .setFooter(`With ❤️ by Jourloy`)
                channel.send(`<@${member.id}>`, {embed: embed}).then(mss => mss.react('👋'));
            });
            return;
        }
        const inviter = client.users.cache.get(invite.inviter.id);

        manager.updateInviterMember(inviter.username);

        client.channels.fetch('869693463510278245').then((channel: ds.TextChannel) => {
            const embed = new ds.MessageEmbed()
                .setColor(0xf05656)
                .setTitle('ПРИВЕТ!')
                .setDescription(`Рад тебя видеть на моем сервере, уверяю, здесь ты найдешь много интересного

В <#865580513879261194> есть основная информация, которую следует соблюдать
Загляни в <#868238068283473952> и выбери себе роли, которые подходят больше всего для тебя
Передавай всем привет в <#868108110001221632>
Удачи!

───────────────

<@${inviter.id}> пригласил этого замечательного участника нашего сообщества`)
                .setFooter(`With ❤️ by Jourloy`)
            channel.send(`<@${member.id}>`, {embed: embed}).then(mss => mss.react('👋'));
        })
    });
})