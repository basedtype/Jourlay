import { Injectable, Logger } from '@nestjs/common';
import * as ds from 'discord.js';
import { DatabaseService } from 'src/database/database.service';
import { Config } from 'types';
import { EgsService } from '../modules/egs/egs.service';
import { ToolsService } from '../modules/tools/tools.service';
import { Cron } from '@nestjs/schedule';
import { SteamService } from '../modules/steam/steam.service';
import { GogService } from '../modules/gog/gog.service';
import { AnimeService } from './modules/anime/anime.service';
//import { AmethystService } from '../amethyst/amethyst.service;
import { WallhavenService } from '../modules/wallhaven/wallhaven.service';
import { Service } from 'src/entity/services.entity';
import * as _ from 'lodash';
import * as voice from '@discordjs/voice';
import * as play from 'play-dl';
import { DiscordMusic } from './modules/music';
import { DiscordUser } from 'src/entity/discord.entity';

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
		private readonly wallhavenService: WallhavenService
	) {}

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
	};
	private banVoiceUsers: string[] = [];
	private voiceUsers: string[] = [];
	private player = voice.createAudioPlayer();
	private memberInVoice = {};

	/**
	 * Send any message in channel
	 */
	private async sendInChannel(opt: {
		channelID: string;
		message: string | ds.MessagePayload | ds.MessageOptions;
	}): Promise<{ error: boolean; errorMessage?: string }> {
		const channel = await this.client.channels.fetch(opt.channelID);

		if (channel.isText()) {
			channel.send(opt.message);
			return { error: false };
		} else if (channel.isThread()) {
			this.logger.error('Bot cannot send message in threads');
			return { error: true, errorMessage: 'This is thread' };
		} else if (channel.isVoice()) {
			this.logger.error('Bot cannot send message in voice');
			return { error: true, errorMessage: 'This is voice channel' };
		} else {
			this.logger.error('Unknown type of channel');
			return { error: true, errorMessage: 'Unknown type of channel' };
		}
	}

	/**
	 * Init discord module
	 */
	@Cron('*/30 * * * * *')
	async init() {
		if (this.client == null) {
			const config: Service = await this.databaseService.serviceFindOne(
				'Discord',
				'Nidhoggbot'
			);
			if (config == null) {
				this.logger.error(
					`Database can't find sevice with 'Discord' name and 'Nidhoggbot' target`
				);
				return;
			}
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
		data.guild = client.guilds.cache.find((guild) => guild.id === '437601028662231040');
		return data;
	}

	/**
	 * Check and give basic role
	 */
	@Cron('* */1 * * * *')
	private async setBasicRole(): Promise<void> {
		if (this._guild == null) return;

		const members = (await this._guild.members.fetch()).toJSON();

		for (let i in members) {
			const member = members[i];

			if (!member.user.bot) {
				const databaseMember = await this.databaseService.discordUserFindOneByUserID(
					member.id
				);
				if (databaseMember == null) {
					const user = new DiscordUser();
					user.userID = member.id;
					user.warnings = 0;
					user.bans = 0;
					user.messages = 0;
					await this.databaseService.discordUserInsertOne(user);
					if (member.roles.cache.has('918778640869773334') === false) {
						const roleAdd = this._guild.roles.cache.find(
							(role, key, collection) => role.id === '918778640869773334'
						);
						await member.roles.add(roleAdd);
						this.logger.log(`${member.id} (${member.displayName}) не наш`);
					}
				} else if (databaseMember.messages >= 1) {
					if (member.roles.cache.has('918626848274002050') === false) {
						const roleAdd = this._guild.roles.cache.find(
							(role, key, collection) => role.id === '918626848274002050'
						);
						await member.roles.add(roleAdd);
						this.logger.log(`${member.id} (${member.displayName}) наш`);
					}
					if (member.roles.cache.has('918778640869773334') === true) {
						const roleRemove = this._guild.roles.cache.find(
							(role, key, collection) => role.id === '918778640869773334'
						);
						await member.roles.remove(roleRemove);
					}
				} else {
					if (member.roles.cache.has('918778640869773334') === false) {
						const roleAdd = this._guild.roles.cache.find(
							(role, key, collection) => role.id === '918778640869773334'
						);
						await member.roles.add(roleAdd);
						this.logger.log(`${member.id} (${member.displayName}) не наш`);
					}
					if (member.roles.cache.has('918626848274002050') === true) {
						const roleRemove = this._guild.roles.cache.find(
							(role, key, collection) => role.id === '918626848274002050'
						);
						await member.roles.remove(roleRemove);
					}
				}
			}
		}
	}

	/**
	 * Add a second for users which in voice channels
	 * Increase voice limit
	 */
	@Cron('*/1 * * * * *')
	private async minutesInVoice() {
		if (this.client == null) return;
		const allChannels = this._guild.channels.cache.toJSON();
		const channels = _.filter(allChannels, (channel) => channel.isVoice());
		_.forEach(channels, (channel: ds.VoiceChannel) => {
			if (channel.members.toJSON().length > 0) {
				_.forEach(channel.members.toJSON(), async (member) => {
					if (!this.memberInVoice[member.id]) {
						this.memberInVoice[member.id] = { channelID: channel.id, seconds: 1 };
					} else {
						if (this.memberInVoice[member.id].channelID === channel.id)
							this.memberInVoice[member.id].seconds++;
						else this.memberInVoice[member.id] = { channelID: channel.id, seconds: 1 };
					}
					const discordUser = await this.databaseService.discordUserFindOneByUserID(
						member.id
					);
					if (discordUser == null || discordUser.minutesInVoice == null) {
						const user = new DiscordUser();
						user.userID = member.id;
						user.warnings = 0;
						user.bans = 0;
						user.messages = 0;
						user.minutesInVoice = 1;
						await this.databaseService.discordUserInsertOne(user);
						return;
					}
					discordUser.minutesInVoice++;
					await this.databaseService.discordUserRepository.save(discordUser);
				});

				if (
					channel.name.startsWith('Игровая') &&
					channel.members.toJSON().length > channel.userLimit
				) {
					channel.setName(`Игровая комната [${channel.members.toJSON().length}]`);
					channel.setUserLimit(channel.members.toJSON().length);
				}
			}
		});
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
			.setFooter(`With ❤️ by NidhoggBot v2.0`);

		const egs = await this.egsService.get();
		const thisWeek = egs.thisWeek;
		const nextWeek = egs.nextWeek;

		embed.addField(`Раздается на этой неделе`, thisWeek);
		embed.addField(`Раздается на следующей неделе`, nextWeek);

		this.client.channels.fetch('869957685326524456').then((channel: ds.TextChannel) => {
			channel.send({ embeds: [embed] });
		});
		this.client.channels.fetch('881988459437359135').then((channel: ds.TextChannel) => {
			channel.send({ embeds: [embed] });
		});
	}

	/**
	 * Send information about sales in STEAM
	 */
	@Cron('0 31 21 * * *')
	private async STEAMsales() {
		let embed = new ds.MessageEmbed()
			.setTitle('Steam')
			.setColor(0xf05656)
			.setFooter(`With ❤️ by NidhoggBot v2.0`);

		embed = await this.steamService.getSales(embed);

		this.client.channels
			.fetch('869957685326524456')
			.then((channel: ds.TextChannel) => channel.send({ embeds: [embed] }));
		this.client.channels
			.fetch('881988459437359135')
			.then((channel: ds.TextChannel) => channel.send({ embeds: [embed] }));
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
			.setFooter(`With ❤️ by NidhoggBot v2.0`);

		const sales = await this.gogService.getSales();

		for (let i in sales) {
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
			.fetch('869957685326524456')
			.then((channel: ds.TextChannel) => channel.send({ embeds: [embed] }));
		this.client.channels
			.fetch('881988459437359135')
			.then((channel: ds.TextChannel) => channel.send({ embeds: [embed] }));
	}

	/**
	 * Send random anime photo in channel ^-^
	 */
	@Cron('0 0 */1 * * *')
	private async animePhotos() {
		if (this.client == null) return;
		const url = await this.animeService.getAnimePhoto();
		this.client.channels
			.fetch('898741828717789184')
			.then((channel: ds.TextChannel) => channel.send({ files: [url] }))
			.catch((err) => {
				this.logger.error(`Can't send photo in chat. (URL: ${url})`);
				this.logger.error(err);
			});
	}

	/**
	 * Send random real photo in channel
	 */
	//@Cron('0 0 */1 * * *')
	private async realPhotos() {
		if (this.client == null) return;
		const url = await this.animeService.getRealPhoto();
		this.client.channels
			.fetch('920639086077833226')
			.then((channel: ds.TextChannel) => channel.send({ files: [url] }));
	}

	/**
	 * Set member count in name of voice channel
	 */
	@Cron('* */5 * * * *')
	private async memberCount() {
		if (this.client == null) return;
		if (this._guild == null) return;

		const names = ['Тянок', 'Ебейших', 'Викингов', 'Участников', 'Ботов'];

		this.client.channels.fetch('871750394211090452').then((channel: ds.VoiceChannel) => {
			const memberCount = this._guild.memberCount;
			channel.setName(`${_.sample(names)}: ${memberCount}`);
		});
	}

	/**
	 * Remove unused rooms
	 */
	@Cron('*/20 * * * * *')
	private async cleaner() {
		if (this._guild == null) return;

		const channels: ds.GuildChannel[] = [];
		this._guild.channels.cache.forEach((channel) => {
			if (
				channel.type === 'GUILD_VOICE' &&
				(channel.name === this.voiceChannels.duo.name ||
					channel.name === this.voiceChannels.trio.name ||
					channel.name === this.voiceChannels.four.name ||
					channel.name === this.voiceChannels.five.name)
			)
				channels.push(channel);
		});
		for (let i in channels) {
			if (channels[i].members.first() == null) {
				channels[i]
					.delete()
					.then(() => {})
					.catch(() => {});
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
				this.createLog(null, `User <@${i}> created too many channels`);
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

	/**
	 * Create voice channels with limit
	 */
	@Cron('*/1 * * * * *')
	private async createVoiceChannel() {
		if (this._guild == null) return;

		const deleteFunction = (channelNew: ds.GuildChannel) => {
			if (channelNew.members.first() == null) {
				channelNew
					.delete()
					.then(() => {})
					.catch(() => {});
				return true;
			}
			return false;
		};

		const repeatCheck = (channelNew: ds.GuildChannel) => {
			setTimeout(() => {
				deleteChannel(channelNew);
			}, 1000);
		};

		const deleteChannel = (channelNew: ds.GuildChannel) => {
			if (deleteFunction(channelNew) === false) repeatCheck(channelNew);
		};

		/**
		 * Create channel with limit is 2
		 */
		this.client.channels
			.fetch(this.voiceChannels.duo.id)
			.then((channel: ds.VoiceChannel | null) => {
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
				};
				const user = channel.members.first();
				options.reason += `${user.user.username}`;
				this.voiceUsers.push(user.id);
				if (this.banVoiceUsers.includes(user.id) === true) {
					let userVoiceState: ds.VoiceState = null;
					guild.members.fetch(user.id).then((member) => {
						userVoiceState = member.guild.voiceStates.cache.find(
							(userFind) => userFind.id === user.id
						);
						userVoiceState.disconnect('User created too many channels');
						return;
					});
				} else {
					let userVoiceState: ds.VoiceState = null;
					let idNew: string = null;

					guild.members.fetch(user.id).then((member) => {
						userVoiceState = member.guild.voiceStates.cache.find(
							(userFind) => userFind.id === user.id
						);

						guild.channels.create(name, options).then(async (data) => {
							idNew = data.id;
							const channelNew: ds.VoiceChannel = await guild.channels
								.fetch(idNew)
								.then((ch: ds.VoiceChannel) => {
									return ch;
								});
							userVoiceState
								.setChannel(channelNew)
								.then((res) => {})
								.catch((err) => {});
							repeatCheck(channelNew);
						});
					});
				}
			});

		/**
		 * Create channel with limit is 3
		 */
		this.client.channels
			.fetch(this.voiceChannels.trio.id)
			.then((channel: ds.VoiceChannel | null) => {
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
				};
				const user = channel.members.first();
				options.reason += `${user.user.username}`;
				this.voiceUsers.push(user.id);
				if (this.banVoiceUsers.includes(user.id) === true) {
					let userVoiceState: ds.VoiceState = null;
					guild.members.fetch(user.id).then((member) => {
						userVoiceState = member.guild.voiceStates.cache.find(
							(userFind) => userFind.id === user.id
						);
						userVoiceState.disconnect('User created too many channels');
						return;
					});
				} else {
					let userVoiceState: ds.VoiceState = null;
					let idNew: string = null;

					guild.members.fetch(user.id).then((member) => {
						userVoiceState = member.guild.voiceStates.cache.find(
							(userFind) => userFind.id === user.id
						);

						guild.channels.create(name, options).then(async (data) => {
							idNew = data.id;
							const channelNew: ds.VoiceChannel = await guild.channels
								.fetch(idNew)
								.then((ch: ds.VoiceChannel) => {
									return ch;
								});
							userVoiceState
								.setChannel(channelNew)
								.then((res) => {})
								.catch((err) => {});
							repeatCheck(channelNew);
						});
					});
				}
			});

		/**
		 * Create channel with limit is 4
		 */
		this.client.channels
			.fetch(this.voiceChannels.four.id)
			.then((channel: ds.VoiceChannel | null) => {
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
				};
				const user = channel.members.first();
				options.reason += `${user.user.username}`;
				this.voiceUsers.push(user.id);
				if (this.banVoiceUsers.includes(user.id) === true) {
					let userVoiceState: ds.VoiceState = null;
					guild.members.fetch(user.id).then((member) => {
						userVoiceState = member.guild.voiceStates.cache.find(
							(userFind) => userFind.id === user.id
						);
						userVoiceState.disconnect('User created too many channels');
						return;
					});
				} else {
					let userVoiceState: ds.VoiceState = null;
					let idNew: string = null;

					guild.members.fetch(user.id).then((member) => {
						userVoiceState = member.guild.voiceStates.cache.find(
							(userFind) => userFind.id === user.id
						);

						guild.channels.create(name, options).then(async (data) => {
							idNew = data.id;
							const channelNew: ds.VoiceChannel = await guild.channels
								.fetch(idNew)
								.then((ch: ds.VoiceChannel) => {
									return ch;
								});
							userVoiceState
								.setChannel(channelNew)
								.then((res) => {})
								.catch((err) => {});
							repeatCheck(channelNew);
						});
					});
				}
			});

		/**
		 * Create channel with limit is 5
		 */
		this.client.channels
			.fetch(this.voiceChannels.five.id)
			.then((channel: ds.VoiceChannel | null) => {
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
				};
				const user = channel.members.first();
				options.reason += `${user.user.username}`;
				this.voiceUsers.push(user.id);
				if (this.banVoiceUsers.includes(user.id) === true) {
					let userVoiceState: ds.VoiceState = null;
					guild.members.fetch(user.id).then((member) => {
						userVoiceState = member.guild.voiceStates.cache.find(
							(userFind) => userFind.id === user.id
						);
						userVoiceState.disconnect('User created too many channels');
						return;
					});
				} else {
					let userVoiceState: ds.VoiceState = null;
					let idNew: string = null;

					guild.members.fetch(user.id).then((member) => {
						userVoiceState = member.guild.voiceStates.cache.find(
							(userFind) => userFind.id === user.id
						);

						guild.channels.create(name, options).then(async (data) => {
							idNew = data.id;
							const channelNew: ds.VoiceChannel = await guild.channels
								.fetch(idNew)
								.then((ch: ds.VoiceChannel) => {
									return ch;
								});
							userVoiceState
								.setChannel(channelNew)
								.then((res) => {})
								.catch((err) => {});
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
		};
		const name = `Алиса (${_.random(0, 10)} | ${_.random(0, 10)})`;
		this._guild.channels.create(name, options).then(async (data) => {
			const idNew = data.id;
			const channelNew: ds.VoiceChannel = await this._guild.channels
				.fetch(idNew)
				.then((ch: ds.VoiceChannel) => {
					return ch;
				});
		});
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
			.fetch('818566531486187611')
			.then((channel: ds.TextChannel) => channel.send({ embeds: [embed] }));
	}

	/**
	 * Check moderation permissions
	 */
	private async isMod(userID: string): Promise<boolean> {
		const userMod = await this._guild.members.fetch(userID).then((user) => {
			return user.roles.cache.find((role) => role.id === '799561051905458176');
		});
		return userMod == null ? false : true;
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
		this.client.on('ready', () => {
			this.logger.log('Discord are ready');

			DiscordMusic.init(this._guild);
		});

		this.client.on('messageCreate', async (msg) => {
			if (msg.author.bot) return;

			const info = {
				isGuild: msg.guild == null ? false : true,
				channelID: msg.channel.id,
				channel: msg.channel,
				authorID: msg.author.id,
				author: msg.author,
				content: msg.content,
				splited: msg.content.split(' '),
				command: msg.content.split(' ')[0].split('!')[1],
			};

			if (info.content.length >= 3 && msg.guildId === '437601028662231040') {
				this.databaseService.discordUserAddMessage(info.authorID);
			}

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

			if (
				info.isGuild === true &&
				msg.guild.id === '437601028662231040' &&
				(await this.isMod(info.authorID)) === true
			) {
				if (info.command === 'ping') info.channel.send('Pong');

				if (info.command === 'clear') {
					const count =
						isNaN(parseInt(info.splited[1])) === false
							? parseInt(info.splited[1]) + 1
							: 100;
					info.channel.messages.fetch({ limit: count }).then(async (messages) => {
						this.createLog(
							'ВНИМАНИЕ',
							`Модератор (<@${info.authorID}>) запустил очистку ${
								count - 1
							} сообщений`
						);
						messages.forEach((ms) => {
							ms.delete();
						});
					});
				}

				if (info.command === 'db_add') {
					const userID = info.splited[1];
					const amount = parseInt(info.splited[2]);
					await this.databaseService.discordUserAddMessage(userID, amount);
					const user = await this.databaseService.discordUserFindOneByUserID(userID);
					info.channel.send({
						content: `Было успешно добавлено ${amount} сообщений, теперь у него ${user.messages} сообщений`,
					});
				}

				if (info.command === 'db_remove') {
					const userID = info.splited[1];
					const amount = parseInt(info.splited[2]);
					await this.databaseService.discordUserRemoveMessage(userID, amount);
					const user = await this.databaseService.discordUserFindOneByUserID(userID);
					info.channel.send({
						content: `Было успешно отнято ${amount} сообщений, теперь у него ${user.messages} сообщений`,
					});
				}

				if (info.command === 'user') {
					const userID = info.splited[1];
					const user = await this.databaseService.discordUserFindOneByUserID(userID);
					const member = await this._guild.members.fetch(userID);
					const embed = new ds.MessageEmbed()
						.setAuthor(member.user.username, member.user.avatarURL())
						.setDescription(
							`Сообщений: ${user.messages}\nПредупреждений: ${user.warnings}`
						)
						.setFooter(`With ❤️ by NidhoggBot v2.0`);
					info.channel.send({ embeds: [embed] });
					return;
				}

				if (info.command === 'test') {
					const members = this._guild.members.cache.toJSON();
					const limit = Date.now() - 3 * 31 * 24 * 60 * 60 * 1000;
					msg.delete();
					_.forEach(members, (member) => {
						if (
							member.joinedTimestamp <= limit &&
							member.roles.cache.has('918778640869773334')
						)
							console.log(member.displayName);
					});
				}
			}

			/* MY GUILD */

			if (info.isGuild === true && msg.guild.id === '437601028662231040') {
				if (info.command === 'me') {
					const user = await this.databaseService.discordUserFindOneByUserID(
						info.authorID
					);
					if (!user) {
						this.logger.error(
							`${msg.author.username} (ID: ${msg.author.id}) not found in database`
						);
						const embed = new ds.MessageEmbed()
							.setAuthor(msg.author.username, msg.author.avatarURL())
							.setDescription(`Ошибка`)
							.setColor(0xff0000)
							.setFooter(`With ❤️ by NidhoggBot v2.0`);
						info.channel.send({ embeds: [embed] });
					} else {
						const embed = new ds.MessageEmbed()
							.setAuthor(msg.author.username, msg.author.avatarURL())
							.setDescription(
								`Сообщений: ${
									user.messages
								}\nВремя в голосовых каналах: ${this.toolsService.toDDHHMMSS(
									`${user.minutesInVoice}`
								)}`
							)
							.setFooter(`With ❤️ by NidhoggBot v2.0`);
						info.channel.send({ embeds: [embed] });
					}
					return;
				}

				/* MUSIC CHANNEL */
				if (info.channelID === '917132649603162212') {
					const force = await this.isMod(info.authorID);

					if (info.command === 'play' || info.command === 'p') {
						const result = await DiscordMusic.play({
							authorID: info.authorID,
							channel: msg.member.voice.channel,
							channelID: msg.member.voice.channelId,
							url: info.splited[1],
							force: force,
							client: this.client,
						});
						if (result.error) {
							await info.channel.send({
								content: `<@${info.authorID}>, ${result.errorMessage}`,
							});
						} else {
							await info.channel.send({
								content: `<@${info.authorID}>, ${result.content}`,
							});
						}
					} else if (info.command === 'stop' || info.command === 's') {
						const result = await DiscordMusic.stop(info.authorID, force);
						await info.channel.send({
							content: `<@${info.authorID}>, ${result}`,
						});
					} else if (info.command === 'pause') {
						const result = await DiscordMusic.pause({
							channelID: msg.member.voice.channelId,
							force: force,
						});
						if (result.error) {
							await info.channel.send({
								content: `<@${info.authorID}>, ${result.errorMessage}`,
							});
						} else {
							await info.channel.send({
								content: `<@${info.authorID}>, ${result.content}`,
							});
						}
					} else if (info.command === 'unpause') {
						const result = await DiscordMusic.unPause({
							channelID: msg.member.voice.channelId,
							force: force,
						});
						if (result.error) {
							await info.channel.send({
								content: `<@${info.authorID}>, ${result.errorMessage}`,
							});
						} else {
							await info.channel.send({
								content: `<@${info.authorID}>, ${result.content}`,
							});
						}
					} else if (info.command === 'skip') {
						const result = await DiscordMusic.skip({
							channelID: msg.member.voice.channelId,
							force: force,
						});
						if (result.error) {
							await info.channel.send({
								content: `<@${info.authorID}>, ${result.errorMessage}`,
							});
						} else {
							await info.channel.send({
								content: `<@${info.authorID}>, ${result.content}`,
							});
						}
						msg.delete();
					} else if (info.command === 'drop') {
						const result = await DiscordMusic.clearQueue(info.authorID, force);
						await info.channel.send({
							content: `<@${info.authorID}>, ${result}`,
						});
					} else if (info.command === 'queue' || info.command === 'q') {
						const result = await DiscordMusic.getQueue();
						if (result === 'Музыка не активна') {
							await info.channel.send({
								content: `<@${info.authorID}>, ${result}`,
							});
							return;
						} else if (result === 'Очередь пуста') {
							await info.channel.send({
								content: `<@${info.authorID}>, ${result}`,
							});
							return;
						}
						let qu = '';
						for (let i in result) {
							qu += `${result[i].url} | <@${result[i].authorID}>\n`;
						}
						const embed = new ds.MessageEmbed().addField('Очередь', qu);
						await info.channel.send({
							content: `<@${info.authorID}>`,
							embeds: [embed],
						});
					} else if (info.command === 'now' || info.command === 'n') {
						const result = await DiscordMusic.getNowSong();
						if (result.error) {
							await info.channel.send({
								content: `<@${info.authorID}>, ${result.errorMessage}`,
							});
						} else {
							const embed = new ds.MessageEmbed().addField(
								'Сейчас играет',
								`${result.content.url}\nДобавил: <@${result.content.authorID}>`
							);
							await info.channel.send({
								content: `<@${info.authorID}>`,
								embeds: [embed],
							});
						}
					} else if (info.command === 'change') {
						const result = await DiscordMusic.changeQueueOwner({
							ownerID: info.authorID,
							nextOwnerID: info.splited[1],
							force: force,
						});
						if (result.error) {
							await info.channel.send({
								content: `<@${info.authorID}>, ${result.errorMessage}`,
							});
						} else {
							await info.channel.send({
								content: `<@${info.authorID}>, ${result.content}`,
							});
						}
					}
				}
			}
		});

		this.client.on('guildMemberAdd', (member) => {
			if (member.guild.id !== '437601028662231040') return;

			this.client.channels.fetch('869693463510278245').then((channel: ds.TextChannel) => {
				const embed = new ds.MessageEmbed()
					.setColor(0x44adab)
					.setTitle('Добро пожаловать на сервер')
					.setDescription(
						`Давай введу тебя в курс дела\n
						<#868108110001221632> Здесь проходит все основное общение\n
						<#875430878489227335> Тут мы делимся артами\n
						<#875430878489227335> Раздел для 18+\n
						<#880036048162402304> Сюда поржать`
					)
					.setFooter(`With ❤️ by NidhoggBot v2.0`);
				channel.send({ content: `<@${member.id}>`, embeds: [embed] });
			});
		});

		this.client.on('guildMemberRemove', (member) => {
			if (member.guild.id !== '437601028662231040') return;
			this.client.channels.fetch('818566531486187611').then((channel: ds.TextChannel) => {
				const embed = new ds.MessageEmbed()
					.setColor(0x341331)
					.setTitle(`Пользователь покинул сервер`)
					.setDescription(`<@${member.id}> (${member.id}) покинул сервер`)
					.setFooter(`With ❤️ by NidhoggBot v2.0`)
					.setTimestamp();
			});
		});

		this.client.on('messageDelete', (msg) => {
			if (msg.guild == null || msg.guild.id !== '437601028662231040') return;
			if (msg.channel.id === '818566531486187611') return;
			if (msg.channel.id === '917132649603162212') return;
			if (msg.author.id === '308924864407011328') return;
			this.client.channels.fetch('818566531486187611').then((channel: ds.TextChannel) => {
				let embeds = [];
				let attachments = [];
				const embed = new ds.MessageEmbed()
					.setColor(0xf05656)
					.setTitle(`Сообщение удалено`)
					.setDescription(
						`Содержание:\n\`\`\`${msg.content}\`\`\`\n\nАвтор: <@${msg.author.id}>`
					)
					.setFooter(`With ❤️ by NidhoggBot v2.0`)
					.setAuthor(msg.author.username, msg.author.avatarURL())
					.setTimestamp();
				embeds.push(embed);
				if (msg.attachments.toJSON().length > 0)
					for (let i in msg.attachments.toJSON())
						attachments.push(msg.attachments.toJSON()[i]);
				if (msg.embeds.length > 0) for (let i in msg.embeds) embeds.push(msg.embeds[i]);
				channel.send({ embeds: [embed], files: attachments });
			});
		});
	}
}
