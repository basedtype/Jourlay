import { Injectable, Logger } from '@nestjs/common';
import * as ds from 'discord.js';
import { DatabaseService } from 'src/database/database.service';
import { Config } from 'types';
import { EgsService } from '../egs/egs.service';
import { ToolsService } from '../tools/tools.service';
import { Cron } from '@nestjs/schedule'

@Injectable()
export class DiscordService {

    constructor(
        private readonly databaseService: DatabaseService,
        private readonly egsService: EgsService,
        private readonly toolsService: ToolsService,
    ) { }
    private readonly logger = new Logger(DiscordService.name);

    private client: ds.Client = null;
    private _guild: ds.Guild = null;

    async init() {
        const config: Config.Service = await this.databaseService.getConfig('Discord', 'Nidhoggbot');

        const client = new ds.Client({ intents: [ds.Intents.FLAGS.GUILDS, ds.Intents.FLAGS.GUILD_BANS, ds.Intents.FLAGS.GUILD_MESSAGES, ds.Intents.FLAGS.GUILD_MESSAGE_REACTIONS, ds.Intents.FLAGS.GUILD_PRESENCES, ds.Intents.FLAGS.GUILD_VOICE_STATES, ds.Intents.FLAGS.GUILD_INVITES, ds.Intents.FLAGS.GUILD_EMOJIS_AND_STICKERS, ds.Intents.FLAGS.DIRECT_MESSAGES, ds.Intents.FLAGS.DIRECT_MESSAGE_REACTIONS] });

        await client.login(config.auth.api);

        const discord = await this.getInformation(client);
        this.client = discord.client;
        this._guild = discord.guild;

        this.run();
    }

    private async getInformation(client: ds.Client) {
        const data = { client: client, guild: null };
        data.guild = client.guilds.cache.find(guild => guild.id === '437601028662231040');
        return data;
    }

    @Cron('0 30 21 * * *')
    private async sales() {
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

        this.sales()

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

            /* <=========================== CROSSPOST ===========================> */

            if (info.channelID === '868517415787585656') msg.crosspost();
            if (info.channelID === '869957685326524456') msg.crosspost();
            if (info.channelID === '892576972650209311') msg.crosspost();

            if (msg.author.bot === true) return;

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
