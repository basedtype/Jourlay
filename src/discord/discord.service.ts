/* eslint-disable @typescript-eslint/ban-ts-comment */
/* eslint-disable spaced-comment */
import {Injectable, Logger} from "@nestjs/common";
import * as ds from "discord.js";
import {EgsService} from "../modules/egs/egs.service";
import {ToolsService} from "../modules/tools/tools.service";
import {Cron} from "@nestjs/schedule";
import {SteamService} from "../modules/steam/steam.service";
import {GogService} from "../modules/gog/gog.service";
// eslint-disable-next-line @typescript-eslint/no-unused-vars
import * as _ from "lodash";
import * as voice from "@discordjs/voice";
import * as play from "play-dl";
import {DMusic} from "./modules/music";
import { DTools } from "./modules/tools";
import { DVoice } from "./modules/voice";
import { DRoles } from "./modules/roles";
import {Language as lng} from "../modules/language";


@Injectable()
export class DiscordService {
	constructor(
		private readonly egsService: EgsService,
		private readonly steamService: SteamService,
		private readonly gogService: GogService,
		private readonly toolsService: ToolsService,
		private dVoice: DVoice,
		private dMusic: DMusic,
		private dRoles: DRoles,
	) {}

	private readonly logger = new Logger(DiscordService.name);

	private client: ds.Client = null;
	private _guild: ds.Guild = null;
	private tools: DTools;
	private player = voice.createAudioPlayer();
	private env = process.env;

	private footerText = `With ❤️ by Jourlay`;

	/**
	 * Init discord module
	 */
	@Cron(`*/30 * * * * *`)
	async init() {
		if (this.client == null) {
			const client = new ds.Client({
				intents: [
					ds.Intents.FLAGS.GUILDS,
					ds.Intents.FLAGS.GUILD_BANS,
					ds.Intents.FLAGS.GUILD_MEMBERS,
					ds.Intents.FLAGS.GUILD_INVITES,
					ds.Intents.FLAGS.GUILD_MESSAGES,
					ds.Intents.FLAGS.DIRECT_MESSAGES,
					ds.Intents.FLAGS.GUILD_PRESENCES,
					ds.Intents.FLAGS.GUILD_VOICE_STATES,
					ds.Intents.FLAGS.GUILD_MESSAGE_REACTIONS,
					ds.Intents.FLAGS.DIRECT_MESSAGE_REACTIONS,
					ds.Intents.FLAGS.GUILD_EMOJIS_AND_STICKERS,
				],
			});
			await client.login(this.env.DISCORD_KEY);
			const discord = await this.getInformation(client);
			this.client = discord.client;
			this._guild = discord.guild;
			this.logger.log(`✅ Discord ready`);
			this.dVoice.init(this.client, this._guild);
			this.dMusic.init(this._guild);
			this.dRoles.init(this.client, this._guild);
			this.tools = new DTools(this.client, this._guild);
			this.run();
		}
	}

	/**
	 * Get all important info
	 * @param client discord client
	 */
	private async getInformation(client: ds.Client) {
		const data = {client: client, guild: null};
		data.guild = client.guilds.cache.find(guild => guild.id === `437601028662231040`);
		return data;
	}

	/**
	 * Send information about sales in EGS
	 */
	@Cron(`0 0 13 * * *`)
	private async EGSsales() {
		if (this.client == null) return;
		const embed = new ds.MessageEmbed()
			.setTitle(`Epic Games Store`)
			.setColor(0xf05656)
			.setFooter(`With ❤️ by NidhoggBot v2.0`);

		const egs = await this.egsService.get();
		const thisWeek = egs.thisWeek;
		const nextWeek = egs.nextWeek;

		embed.addField(`Раздается на этой неделе`, thisWeek);
		embed.addField(`Раздается на следующей неделе`, nextWeek);

		this.client.channels
			.fetch(`869957685326524456`)
			.then((channel: ds.TextChannel) => {
				channel.send({embeds: [embed]});
			});
	}

	/**
	 * Send information about sales in STEAM
	 */
	@Cron(`30 0 13 * * *`)
	private async STEAMsales() {
		let embed = new ds.MessageEmbed()
			.setTitle(`Steam`)
			.setColor(0xf05656)
			.setFooter(`With ❤️ by NidhoggBot v2.0`);

		embed = await this.steamService.getSales(embed);

		this.client.channels
			.fetch(`869957685326524456`)
			.then((channel: ds.TextChannel) => channel.send({embeds: [embed]}));
	}

	/**
	 * Send information about sales in GOG
	 */
	@Cron(`0 1 13 * * *`)
	private async GOGsales() {
		if (this.client == null) return;
		const embed = new ds.MessageEmbed()
			.setTitle(`GOG`)
			.setColor(0xf05656)
			.setFooter(`With ❤️ by NidhoggBot v2.0`);

		const sales = await this.gogService.getSales();

		for (const i in sales) {
			const name = sales[i].title;
			const percent = sales[i].price.discount;
			const price = sales[i].price.amount;
			const oldPrice = sales[i].price.baseAmount;
			const slug = sales[i].slug;

			embed.addField(
				name,
				`**Скидка:** ${percent}%\n**Стоимость:** __${price}__\n**Старая цена:** ${oldPrice}\n[В магазин](https://www.gog.com/game/${slug})\n`,
				true
			);
		}
		this.client.channels
			.fetch(`869957685326524456`)
			.then((channel: ds.TextChannel) => channel.send({embeds: [embed]}));
	}


	/**
	 * Create log in channel
	 */
	private async createLog(title?: string, text?: string) {
		const embed = new ds.MessageEmbed()
			.setColor(0xf05656)
			.setFooter(`With ❤️ by NidhoggBot v2.0`);
		if (title != null) embed.setTitle(title);
		if (text != null) embed.setDescription(text);
		if (text == null && title == null) return;

		this._guild.channels
			.fetch(`818566531486187611`)
			.then((channel: ds.TextChannel) => channel.send({embeds: [embed]}));
	}

	private async playSong(url: string) {
		const stream = await play.stream(url);
		const resource = voice.createAudioResource(stream.stream, {
			inputType: stream.type,
		});
		this.player.play(resource);
		return voice.entersState(this.player, voice.AudioPlayerStatus.Playing, 5e3);
	}

	private async connectToChannel(channel: ds.VoiceChannel | ds.StageChannel) {
		const connection = voice.joinVoiceChannel({
			channelId: channel.id,
			guildId: channel.guild.id,
			//@ts-ignore
			adapterCreator: channel.guild.voiceAdapterCreator,
		});
		try {
			await voice.entersState(connection, voice.VoiceConnectionStatus.Ready, 30e3);
			return connection;
		} catch (error) {
			connection.destroy();
			throw error;
		}
	}

	private async run() {
		this.client.on(`messageCreate`, async msg => {
			if (msg.author.bot) return;

			const info = {
				isGuild: msg.guild == null ? false : true,
				channelID: msg.channel.id,
				channel: msg.channel,
				authorID: msg.author.id,
				author: msg.author,
				content: msg.content,
				splited: msg.content.split(` `),
				command: msg.content.split(` `)[0].split(`!`)[1],
			};

			/* <=========================== CROSSPOST ===========================> */

			if (info.channelID === `868517415787585656`) msg.crosspost();
			if (info.channelID === `869957685326524456`) msg.crosspost();
			if (info.channelID === `892576972650209311`) msg.crosspost();

			if (msg.author.bot === true) return;

			/* <=========================== GLOBAL ===========================> */

			if (info.isGuild === true) {
				if (info.command === `triggered`) {
					/*
					 * const buff = await this.amethystService.triggered(msg.author.avatarURL({format: 'png'}));
					 *             const attachment = new ds.MessageAttachment(buff, 'trig.gif')
					 *             await info.channel.send({files: [attachment]}); 
					 */
					return;
				}
			}

			/* <=========================== MODERATOR COMMANDS ===========================> */

			if (
				info.isGuild === true &&
				msg.guild.id === `437601028662231040` &&
				(await this.tools.isMod(info.authorID)) === true
			) {
				if (info.command === `ping`) info.channel.send(`Pong`);

				if (info.command === `clear`) {
					const count =
						isNaN(parseInt(info.splited[1])) === false
							? parseInt(info.splited[1]) + 1
							: 100;
					info.channel.messages.fetch({limit: count}).then(async messages => {
						this.createLog(
							`ВНИМАНИЕ`,
							`Модератор (<@${info.authorID}>) запустил очистку ${
								count - 1
							} сообщений`
						);
						messages.forEach(ms => {
							ms.delete();
						});
					});
				}

				if (info.channelID === `799562265304891392`) {
					if (info.command === `send`) {
						const channelID = info.splited[1];
						const text: string[] = [];
						for (const t of info.splited) {
							if (info.splited.indexOf(t) > 1) text.push(t);
						}
						this.tools.sendInChannel({channelID: channelID, message: text.join(` `)});
					}
				}
			}

			/* DEV GUILD */

			if (info.isGuild === true && msg.guild.id === `823463145963913236`) {
				if (info.command === `test`) {
					const embed = this.tools.createEmbed({
						color: 0x44adab,
						title: `Привет!`,
						description: `Давай покажу что и как у нас\n\n<#868108110001221632> - тут мы общаемся 🤗\n<#880036048162402304> - тут мы шутим 😁\n<#875430878489227335> - тут мы общаемся если сообщения не пропускает дискорд 😉`,
						footer: {
							text: this.footerText,
						},
						timestamp: true,
					});
					info.channel.send({content: `<@${info.authorID}>`, embeds: [embed]});
				}
			}

			/* MY GUILD */

			/**
			 * Translate english to russian
			 */
			if (
				!lng.checkDuplicate(info.splited) &&
				lng.checkEn(info.splited) && 
				msg.content.length > 2
			) {
				const data = await lng.checkWords(info.splited);
				if (data.count > 0) {
					const message = `Полагаю ты имел ввиду что-то вроде этого: \n> ${data.text}`;
					this.tools.sendInChannel({channelID: info.channelID, message: message});
				}
			}

			if (info.isGuild === true && msg.guild.id === `437601028662231040`) {
				/* MUSIC CHANNEL */
				if (info.channelID === `917132649603162212`) {
					const force = await this.tools.isMod(info.authorID);

					if (info.command === `play` || info.command === `p`) {
						const result = await this.dMusic.play({
							authorID: info.authorID,
							channel: msg.member.voice.channel,
							channelID: msg.member.voice.channelId,
							url: info.splited[1],
							force: force,
							client: this.client,
						});
						if (result.error) {
							await info.channel
								.send({
									content: `<@${info.authorID}>, ${result.errorMessage}`,
								})
								.then(msg => this.tools.msgDelete(msg, 5000));
						} else {
							await info.channel
								.send({
									content: `<@${info.authorID}>, ${result.content}`,
								})
								.then(msg => this.tools.msgDelete(msg, 5000));
						}
					} else if (info.command === `stop` || info.command === `s`) {
						const result = await this.dMusic.stop(info.authorID, force);
						await info.channel
							.send({
								content: `<@${info.authorID}>, ${result}`,
							})
							.then(msg => this.tools.msgDelete(msg, 5000));
					} else if (info.command === `pause`) {
						const result = await this.dMusic.pause({
							channelID: msg.member.voice.channelId,
							force: force,
						});
						if (result.error) {
							await info.channel
								.send({
									content: `<@${info.authorID}>, ${result.errorMessage}`,
								})
								.then(msg => this.tools.msgDelete(msg, 5000));
						} else {
							await info.channel
								.send({
									content: `<@${info.authorID}>, ${result.content}`,
								})
								.then(msg => this.tools.msgDelete(msg, 5000));
						}
					} else if (info.command === `unpause`) {
						const result = await this.dMusic.unPause({
							channelID: msg.member.voice.channelId,
							force: force,
						});
						if (result.error) {
							await info.channel
								.send({
									content: `<@${info.authorID}>, ${result.errorMessage}`,
								})
								.then(msg => this.tools.msgDelete(msg, 5000));
						} else {
							await info.channel
								.send({
									content: `<@${info.authorID}>, ${result.content}`,
								})
								.then(msg => this.tools.msgDelete(msg, 5000));
						}
					} else if (info.command === `skip`) {
						const result = await this.dMusic.skip({
							channelID: msg.member.voice.channelId,
							force: force,
						});
						if (result.error) {
							await info.channel
								.send({
									content: `<@${info.authorID}>, ${result.errorMessage}`,
								})
								.then(msg => this.tools.msgDelete(msg, 5000));
						} else {
							await info.channel
								.send({
									content: `<@${info.authorID}>, ${result.content}`,
								})
								.then(msg => this.tools.msgDelete(msg, 5000));
						}
					} else if (info.command === `drop`) {
						const result = await this.dMusic.clearQueue(
							info.authorID,
							force
						);
						await info.channel
							.send({
								content: `<@${info.authorID}>, ${result}`,
							})
							.then(msg => this.tools.msgDelete(msg, 5000));
					} else if (info.command === `queue` || info.command === `q`) {
						const result = await this.dMusic.getQueue();
						this.tools.msgDelete(msg, 1000);
						if (result === `Музыка не активна`) {
							await info.channel
								.send({
									content: `<@${info.authorID}>, ${result}`,
								})
								.then(msg => this.tools.msgDelete(msg, 5000));
							return;
						} else if (result === `Очередь пуста`) {
							await info.channel
								.send({
									content: `<@${info.authorID}>, ${result}`,
								})
								.then(msg => this.tools.msgDelete(msg, 5000));
							return;
						}
						let qu = ``;
						for (const i in result) {
							qu += `${result[i].url} | <@${result[i].authorID}>\n`;
						}
						const embed = new ds.MessageEmbed().addField(`Очередь`, qu);
						await info.channel
							.send({
								content: `<@${info.authorID}>`,
								embeds: [embed],
							})
							.then(msg => this.tools.msgDelete(msg, 5000));
					} else if (info.command === `now` || info.command === `n`) {
						const result = await this.dMusic.getNowSong();
						if (result.error) {
							await info.channel
								.send({
									content: `<@${info.authorID}>, ${result.errorMessage}`,
								})
								.then(msg => this.tools.msgDelete(msg, 5000));
						} else {
							const embed = new ds.MessageEmbed().addField(
								`Сейчас играет`,
								`${result.content.url}\nДобавил: <@${result.content.authorID}>`
							);
							await info.channel
								.send({
									content: `<@${info.authorID}>`,
									embeds: [embed],
								})
								.then(msg => this.tools.msgDelete(msg, 5000));
						}
					} else if (info.command === `change`) {
						const result = await this.dMusic.changeQueueOwner({
							ownerID: info.authorID,
							nextOwnerID: info.splited[1],
							force: force,
						});
						if (result.error) {
							await info.channel
								.send({
									content: `<@${info.authorID}>, ${result.errorMessage}`,
								})
								.then(msg => this.tools.msgDelete(msg, 5000));
						} else {
							await info.channel
								.send({
									content: `<@${info.authorID}>, ${result.content}`,
								})
								.then(msg => this.tools.msgDelete(msg, 5000));
						}
					}
					this.tools.msgDelete(msg, 1000);
				}
			}
		});

		this.client.on(`guildMemberAdd`, member => {
			if (member.guild.id !== `437601028662231040`) return;

			this.client.channels
				.fetch(`869693463510278245`)
				.then((channel: ds.TextChannel) => {
					const embed = this.tools.createEmbed({
						color: 0x44adab,
						title: `Привет!`,
						description: `Давай покажу что и как у нас\n\n<#868108110001221632> - тут мы общаемся 🤗\n<#880036048162402304> - тут мы шутим 😁\n<#875430878489227335> - тут мы общаемся если сообщения не пропускает дискорд 😉`,
						footer: {
							text: this.footerText,
						},
						timestamp: true,
					});
					channel.send({content: `<@${member.id}>`, embeds: [embed]});
				});
		});

		this.client.on(`guildMemberRemove`, member => {
			if (member.guild.id !== `437601028662231040`) return;
			this.client.channels
				.fetch(`818566531486187611`)
				.then((channel: ds.TextChannel) => {
					const embed = this.tools.createEmbed({
						color: 0x341331,
						title: `User leave from server.`,
						description: `<@${member.id}> (${member.id}) leave from server.`,
						footer: {
							text: this.footerText,
						},
						timestamp: true
					});
					channel.send({embeds: [embed]});
				});
		});

		this.client.on(`messageDelete`, msg => {
			if (msg.guild == null || msg.guild.id !== `437601028662231040`) return;
			if (msg.channel.id === `818566531486187611`) return;
			if (msg.channel.id === `917132649603162212`) return;
			if (msg.author.id === `308924864407011328`) return;
			this.client.channels
				.fetch(`818566531486187611`)
				.then((channel: ds.TextChannel) => {
					const embeds = [];
					const attachments = [];
					const embed = this.tools.createEmbed({
						title: `Message deleted.`,
						description: `Content:\n\`\`\`${msg.content}`,
						author: {
							name: msg.author.username,
							iconURL: msg.author.avatarURL()
						},
						footer: {
							text: this.footerText,
						},
						timestamp: true,
					});
					embeds.push(embed);
					if (msg.attachments.toJSON().length > 0)
						for (const i in msg.attachments.toJSON())
							attachments.push(msg.attachments.toJSON()[i]);
					if (msg.embeds.length > 0)
						for (const i in msg.embeds) embeds.push(msg.embeds[i]);
					channel.send({embeds: [embed], files: attachments});
				});
		});

		// this.client.on(`messageReactionAdd`, async (reaction, user) => {});
	}
}
