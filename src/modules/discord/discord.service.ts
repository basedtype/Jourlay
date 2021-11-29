import { Injectable, Logger } from '@nestjs/common';
import * as ds from 'discord.js';
import { DatabaseService } from 'src/database/database.service';
import { Config } from 'types';
import { EgsService } from '../egs/egs.service';
import { ToolsService } from '../tools/tools.service';
import { Cron } from '@nestjs/schedule'
import { SteamService } from '../steam/steam.service';
import { GogService } from '../gog/gog.service';
import { AnimeService } from '../anime/anime.service';
//import { AmethystService } from '../amethyst/amethyst.service';
import { WallhavenService } from '../wallhaven/wallhaven.service';
import { Service } from 'src/entity/services.entity';
import * as _ from "lodash";

@Injectable()
export class DiscordService {

    constructor(
        private readonly databaseService: DatabaseService,
        private readonly egsService: EgsService,
        private readonly steamService: SteamService,
        private readonly gogService: GogService,
        private readonly toolsService: ToolsService,
        private readonly animeService: AnimeService,
        //private readonly amethystService: AmethystService,
        private readonly wallhavenService: WallhavenService,
    ) { }

    private readonly logger = new Logger(DiscordService.name);

    private client: ds.Client = null;
    private _guild: ds.Guild = null;
    private voiceChannels = {
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
    private banVoiceUsers: string[] = [];
    private voiceUsers: string[] = [];
    private workState: boolean = true;

    /**
     * Init discord module
     */
    @Cron('*/30 * * * * *')
    async init() {
        if (this.client == null) {
            const config: Service = await this.databaseService.serviceFindOne('Discord', 'Nidhoggbot');
            if (config == null) {
                this.logger.error(`Database can't find sevice with 'Discord' name and 'Nidhoggbot' target`);
                return;
            }
            const client = new ds.Client({ intents: [ds.Intents.FLAGS.GUILDS, ds.Intents.FLAGS.GUILD_BANS, ds.Intents.FLAGS.GUILD_MESSAGES, ds.Intents.FLAGS.GUILD_MESSAGE_REACTIONS, ds.Intents.FLAGS.GUILD_PRESENCES, ds.Intents.FLAGS.GUILD_VOICE_STATES, ds.Intents.FLAGS.GUILD_INVITES, ds.Intents.FLAGS.GUILD_EMOJIS_AND_STICKERS, ds.Intents.FLAGS.DIRECT_MESSAGES, ds.Intents.FLAGS.DIRECT_MESSAGE_REACTIONS] });
            await client.login(config.api);
            const discord = await this.getInformation(client);
            this.client = discord.client;
            this._guild = discord.guild;
            this.run();
        }
    }

    /**
     * Get all important info
     * @param client discord client
     */
    private async getInformation(client: ds.Client) {
        const data = { client: client, guild: null };
        data.guild = client.guilds.cache.find(guild => guild.id === '437601028662231040');
        return data;
    }

    /**
     * Send information about sales in EGS
     */
    @Cron('0 30 21 * * *')
    private async EGSsales() {
        if (this.client == null) return;
        const embed = new ds.MessageEmbed()
            .setTitle('Epic Games Store')
            .setColor(0xf05656)
            .setFooter(`With ❤️ by Jourloy`)

        const egs = await this.egsService.get();
        const thisWeek = egs.thisWeek;
        const nextWeek = egs.nextWeek;

        embed.addField(`Раздается на этой неделе`, thisWeek);
        embed.addField(`Раздается на следующей неделе`, nextWeek);

        this.client.channels.fetch('869957685326524456').then((channel: ds.TextChannel) => { channel.send({ embeds: [embed] }) });
        this.client.channels.fetch('881988459437359135').then((channel: ds.TextChannel) => { channel.send({ embeds: [embed] }) });
    }

    /**
     * Send information about sales in STEAM
     */
    @Cron('0 31 21 * * *')
    private async STEAMsales() {
        let embed = new ds.MessageEmbed()
            .setTitle('Steam')
            .setColor(0xf05656)
            .setFooter(`With ❤️ by Jourloy`)

        embed = await this.steamService.getSales(embed);

        this.client.channels.fetch('869957685326524456').then((channel: ds.TextChannel) => channel.send({ embeds: [embed] }));
        this.client.channels.fetch('881988459437359135').then((channel: ds.TextChannel) => channel.send({ embeds: [embed] }));
    }

    /**
     * Send information about sales in GOG
     */
    @Cron('0 32 21 * * *')
    private async GOGsales() {
        if (this.client == null) return;
        const embed = new ds.MessageEmbed()
            .setTitle('GOG')
            .setColor(0xf05656)
            .setFooter(`With ❤️ by Jourloy`)

        const sales = await this.gogService.getSales();

        for (let i in sales) {
            const name = sales[i].title;
            const percent = sales[i].price.discount;
            const price = sales[i].price.amount;
            const oldPrice = sales[i].price.baseAmount;
            const slug = sales[i].slug;

            embed.addField(name, `**Скидка:** ${percent}%\n**Стоимость:** __${price}__\n**Старая цена:** ${oldPrice}\n[В магазин](https://www.gog.com/game/${slug})\n`, true);
        }
        this.client.channels.fetch('869957685326524456').then((channel: ds.TextChannel) => channel.send({ embeds: [embed] }));
        this.client.channels.fetch('881988459437359135').then((channel: ds.TextChannel) => channel.send({ embeds: [embed] }));
    }

    /**
     * Send random anime photo in channel ^-^
     */
    @Cron('0 0 */4 * * *')
    private async animePhotos() {
        if (this.client == null) return;
        const url = await this.animeService.getRandomPhoto();
        this.client.channels.fetch('898741828717789184').then((channel: ds.TextChannel) => channel.send({ files: [url] }));
    }

    @Cron('0 0 */4 * * *')
    private async animeWallpaper() {
        const sfwWallpaper = await this.wallhavenService.search();
        this.client.channels.fetch('898741499028725760').then((channel: ds.TextChannel) => channel.send({ files: [sfwWallpaper.path] }));
    }

    /**
     * Set member count in name of voice channel
     */
    @Cron('* */1 * * * *')
    private async memberCount() {
        if (this.client == null) return;
        if (this._guild == null) return;

        this.client.channels.fetch('871750394211090452').then((channel: ds.VoiceChannel) => {
            const memberCount = this._guild.memberCount;
            const channelName = channel.name.split(' ');
            if (parseInt(channelName[1]) != memberCount) channel.setName(`Участников: ${memberCount}`)
        })
    }

    /**
     * Remove unused rooms
     */
    @Cron('*/20 * * * * *')
    private async cleaner() {
        if (this._guild == null) return;

        const channels: ds.GuildChannel[] = [];
        this._guild.channels.cache.forEach((channel) => { if (channel.type === 'GUILD_VOICE' && (channel.name === this.voiceChannels.duo.name || channel.name === this.voiceChannels.trio.name || channel.name === this.voiceChannels.four.name || channel.name === this.voiceChannels.five.name)) channels.push(channel) });
        for (let i in channels) {
            if (channels[i].members.first() == null) {
                channels[i].delete()
                    .then(() => { ; })
                    .catch(() => { ; });
            }
        }
    }

    /**
     * Add user in ban list if he created too many channels
     */
    @Cron('*/5 * * * * *')
    private async addUsersInVoiceBan() {
        const warningsID = {};
        for (let i in this.voiceUsers) {
            if (warningsID[this.voiceUsers[i]] == null) {
                warningsID[this.voiceUsers[i]] = { count: 1 };
            } else if (warningsID[this.voiceUsers[i]] != null) {
                warningsID[this.voiceUsers[i]].count++;
            }
        }
        for (let i in warningsID) {
            if (warningsID[i].count > 3 && this.banVoiceUsers.includes(i) === false) {
                this.createLog(null, `User <@${i}> created too many channels`)
                this.banVoiceUsers.push(i);
            }
        }
    }

    /**
     * Remove user from ban list if his ban expired
     */
    @Cron('0 */15 * * * *')
    private async clearBanLists() {
        this.banVoiceUsers = [];
        this.voiceUsers = [];
    }

    @Cron('*/1 * * * * *')
    private async createVoiceChannel() {
        if (this._guild == null) return;

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
         this.client.channels.fetch(this.voiceChannels.duo.id).then((channel: ds.VoiceChannel | null) => {
            if (channel == null || channel.full == null || channel.full === false) return;

            const parent = channel.parent;
            const guild = channel.guild;
            const name = this.voiceChannels.duo.name;
            const options: ds.GuildChannelCreateOptions = {
                type: 'GUILD_VOICE',
                userLimit: 2,
                position: parent.position + 10,
                parent: parent,
                reason: `Created channel for `,
            }
            const user = channel.members.first();
            options.reason += `${user.user.username}`;
            this.voiceUsers.push(user.id);
            if (this.banVoiceUsers.includes(user.id) === true) {
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
         this.client.channels.fetch(this.voiceChannels.trio.id).then((channel: ds.VoiceChannel | null) => {
            if (channel == null || channel.full == null || channel.full === false) return;

            const parent = channel.parent;
            const guild = channel.guild;
            const name = this.voiceChannels.trio.name;
            const options: ds.GuildChannelCreateOptions = {
                type: 'GUILD_VOICE',
                userLimit: 3,
                position: parent.position + 10,
                parent: parent,
                reason: `Created channel for `,
            }
            const user = channel.members.first();
            options.reason += `${user.user.username}`;
            this.voiceUsers.push(user.id);
            if (this.banVoiceUsers.includes(user.id) === true) {
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
         this.client.channels.fetch(this.voiceChannels.four.id).then((channel: ds.VoiceChannel | null) => {
            if (channel == null || channel.full == null || channel.full === false) return;

            const parent = channel.parent;
            const guild = channel.guild;
            const name = this.voiceChannels.four.name;
            const options: ds.GuildChannelCreateOptions = {
                type: 'GUILD_VOICE',
                userLimit: 4,
                position: parent.position + 10,
                parent: parent,
                reason: `Created channel for `,
            }
            const user = channel.members.first();
            options.reason += `${user.user.username}`;
            this.voiceUsers.push(user.id);
            if (this.banVoiceUsers.includes(user.id) === true) {
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
         this.client.channels.fetch(this.voiceChannels.five.id).then((channel: ds.VoiceChannel | null) => {
            if (channel == null || channel.full == null || channel.full === false) return;

            const parent = channel.parent;
            const guild = channel.guild;
            const name = this.voiceChannels.five.name;
            const options: ds.GuildChannelCreateOptions = {
                type: 'GUILD_VOICE',
                userLimit: 5,
                position: parent.position + 10,
                parent: parent,
                reason: `Created channel for `,
            }
            const user = channel.members.first();
            options.reason += `${user.user.username}`;
            this.voiceUsers.push(user.id);
            if (this.banVoiceUsers.includes(user.id) === true) {
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
    }

    async createChannelByAlisa() {
        /* @ts-ignore */
        const parent: ds.CategoryChannel = await this._guild.channels.fetch('870395638276300821');
        const options: ds.GuildChannelCreateOptions = {
            type: 'GUILD_VOICE',
            position: parent.position + 10,
            parent: parent,
            reason: `Created channel for `,
        }
        const name = `Алиса (${_.random(0, 10)} | ${_.random(0, 10)})`
        this._guild.channels.create(name, options).then(async data => {
            const idNew = data.id;
            const channelNew: ds.VoiceChannel = await this._guild.channels.fetch(idNew).then((ch: ds.VoiceChannel) => { return ch })
        });
    }

    /**
     * Create log in channel
     */
    private async createLog(title?: string, text?: string) {
        const embed = new ds.MessageEmbed()
            .setColor(0xf05656)
            .setFooter(`With ❤️ by Jourloy`);
        if (title != null) embed.setTitle(title);
        if (text != null) embed.setDescription(text);
        if (text == null && title == null) return;

        this._guild.channels.fetch('818566531486187611').then((channel: ds.TextChannel) => channel.send({ embeds: [embed] }));
    }

    /**
     * Check moderation permissions
     */
    private async isMod(userID: string): Promise<boolean> {
        const userMod = await (this._guild.members.fetch(userID).then(user => { return user.roles.cache.find(role => role.id === '799561051905458176') }));
        return (userMod == null) ? false : true;
    }

    private async run() {
        this.logger.log('Discord are ready');

        this.client.on('messageCreate', async msg => {
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

            if (info.authorID === '308924864407011328' && info.command === 'switch_work') {
                if (this.workState === false) this.workState = true;
                else this.workState = false;
            }

            if (this.workState === false) return;

            /* <=========================== CROSSPOST ===========================> */

            if (info.channelID === '868517415787585656') msg.crosspost();
            if (info.channelID === '869957685326524456') msg.crosspost();
            if (info.channelID === '892576972650209311') msg.crosspost();

            if (msg.author.bot === true) return;

            /* <=========================== GLOBAL ===========================> */

            if (info.isGuild === true) {
                if (info.command === 'triggered') {
                    /* const buff = await this.amethystService.triggered(msg.author.avatarURL({format: 'png'}));
                    const attachment = new ds.MessageAttachment(buff, 'trig.gif')
                    await info.channel.send({files: [attachment]}); */
                    return;
                }
            }

            /* <=========================== MODERATOR COMMANDS ===========================> */

            if (info.isGuild === true && msg.guild.id === '437601028662231040' && await this.isMod(info.authorID) === true) {
                if (info.command === 'ping') info.channel.send('Pong');

                if (info.command === 'clear') {
                    const count = (isNaN(parseInt(info.splited[1])) === false) ? parseInt(info.splited[1]) + 1 : 100;
                    info.channel.messages.fetch({ limit: count }).then(async messages => {
                        this.createLog('ВНИМАНИЕ', `Модератор (<@${info.authorID}>) запустил очистку ${count - 1} сообщений`);
                        messages.forEach(ms => { ms.delete() });
                    })
                }
            }
        })

        this.client.on('messageDelete', msg => {
            if (this.workState === false) return;

            if (msg.guild == null || msg.guild.id !== '437601028662231040') return;
            if (msg.channel.id === '818566531486187611') return;
            this.client.channels.fetch('818566531486187611').then((channel: ds.TextChannel) => {
                let embeds = [];
                let attachments = []
                const embed = new ds.MessageEmbed()
                    .setColor(0xf05656)
                    .setTitle(`Сообщение удалено`)
                    .setDescription(`Содержание:\n\`\`\`${msg.content}\`\`\`\n\nАвтор: <@${msg.author.id}>`)
                    .setFooter(`With ❤️ by Jourloy`)
                    .setAuthor(msg.author.username, msg.author.avatarURL())
                    .setTimestamp();
                embeds.push(embed)
                if (msg.attachments.toJSON().length > 0) for (let i in msg.attachments.toJSON()) attachments.push(msg.attachments.toJSON()[i]);
                if (msg.embeds.length > 0) for (let i in msg.embeds) embeds.push(msg.embeds[i]);
                channel.send({ embeds: [embed], files: attachments });
            });
        })
    }
}
