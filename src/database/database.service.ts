import { Injectable } from '@nestjs/common';
import { Log } from 'src/entity/log.entity';
import { Connection, Repository } from 'typeorm';
import { InjectRepository } from '@nestjs/typeorm';
import { DiscordLog, DiscordUser } from 'src/entity/discord.entity';
import { Service } from 'src/entity/services.entity';
import { Config, Database } from 'types';
import { ServerUser } from 'src/entity/users.entity';
import { NswfEntity } from 'src/entity/nsfw.entity';

@Injectable()
export class DatabaseService {
	logRepository: Repository<Log>;
	discordUserRepository: Repository<DiscordUser>;
	discordLogRepository: Repository<DiscordLog>;
	serviceRepository: Repository<Service>;
	userRepository: Repository<ServerUser>;
	nsfwRepository: Repository<NswfEntity>;

	constructor(readonly connection: Connection) {
		this.logRepository = this.connection.getRepository(Log);
		this.discordUserRepository = this.connection.getRepository(DiscordUser);
		this.discordLogRepository = this.connection.getRepository(DiscordLog);
		this.serviceRepository = this.connection.getRepository(Service);
		this.userRepository = this.connection.getRepository(ServerUser);
		this.nsfwRepository = this.connection.getRepository(NswfEntity);
	}

	/**
	 * Find and return all logs in database
	 */
	async logFindAll(): Promise<Log[]> {
		return await this.logRepository.find();
	}

	/**
	 * Find and return all discord users
	 */
	async discordUserFindAll(): Promise<DiscordUser[]> {
		return await this.discordUserRepository.find();
	}

	/**
	 * Find and return discord user by ID
	 * @param id ID of discord user
	 */
	async discordUserFindOneByUserID(id: string): Promise<DiscordUser> {
		return await this.discordUserRepository.findOne({ userID: id });
	}

	/**
	 * Add new discord user in database
	 * @param user
	 */
	async discordUserInsertOne(user: DiscordUser): Promise<Database.Result> {
		if (await this.discordUserFindOneByUserID(user.userID)) {
			return { err: true, message: 'This user alredy exist' };
		}
		await this.discordUserRepository.insert(user);
		return { err: false };
	}

	/**
	 * Add one message to user
	 */
	async discordUserAddMessage(userID: string, amount?: number): Promise<void> {
		const user = await this.discordUserRepository.findOne({ userID: userID });
		if (amount == null) amount = 1;
		if (user == null) {
			user.userID = userID;
			user.warnings = 0;
			user.bans = 0;
			user.messages = amount;
			await this.discordUserInsertOne(user);
		} else {
			user.messages += amount;
			await this.discordUserRepository.save(user);
		}
	}

	async discordUserRemoveMessage(userID: string, amount?: number): Promise<void> {
		const user = await this.discordUserRepository.findOne({ userID: userID });
		if (amount == null) amount = 1;
		if (user == null) {
			user.userID = userID;
			user.warnings = 0;
			user.bans = 0;
			user.messages = 0;
			await this.discordUserInsertOne(user);
		} else {
			user.messages -= amount;
			await this.discordUserRepository.save(user);
		}
	}

	/**
	 * Find and return all logs
	 */
	async discordLogFindAll(log: DiscordLog): Promise<DiscordLog[]> {
		return await this.discordLogRepository.find();
	}

	/**
	 * Add new log in database
	 */
	async discordLogInsertOne(log: DiscordLog): Promise<Database.Result> {
		await await this.discordLogRepository.insert(log);
		return { err: false };
	}

	/**
	 * Find and return all services
	 */
	async serviceFindAll(): Promise<Service[]> {
		return await this.serviceRepository.find();
	}

	/**
	 * Find and return one service
	 */
	async serviceFindOne(name: string, target: string): Promise<Service | undefined> {
		return await this.serviceRepository.findOne({ service: name, target: target });
	}

	/**
	 * Add new service in database
	 */
	async serviceInsertOne(service: Config.Service): Promise<Database.Result> {
		if (await this.serviceFindOne(service.service, service.target)) {
			return { err: true, message: `This service already exist` };
		}
		await this.serviceRepository.insert(service);
		return { err: false };
	}

	/**
	 * Find and return all services
	 */
	async usersFindAll(): Promise<ServerUser[]> {
		return await this.userRepository.find();
	}

	/**
	 * Find and return one user by name
	 */
	async userFindOneByUsername(username: string): Promise<ServerUser | undefined> {
		return await this.userRepository.findOne({ username: username });
	}

	/**
	 * Find and return one user by email
	 */
	async userFindOneByEmail(email: string): Promise<ServerUser | undefined> {
		return await this.userRepository.findOne({ username: email });
	}

	/**
	 * Add new user in database
	 */
	async userInsertOne(user: ServerUser): Promise<Database.Result> {
		if (await this.userFindOneByUsername(user.email)) {
			return { err: true, message: `This email already used` };
		}
		if (await this.userFindOneByEmail(user.username)) {
			return { err: true, message: `This username already used` };
		}
		await this.userRepository.insert(user);
		return { err: false };
	}

	async addNsfw(nsfw: NswfEntity): Promise<Database.Result> {
		if (await this.nsfwRepository.findOne({ url: nsfw.url })) {
			return { err: true, message: 'This nsfw already in database' };
		} else {
			await this.nsfwRepository.insert(nsfw);
			return { err: false };
		}
	}

	async removeNsfw(url: string): Promise<Database.Result> {
		const nsfw = await this.nsfwRepository.findOne({ url: url });
		if (nsfw) {
			this.nsfwRepository.remove(nsfw);
			return { err: false };
		} else {
			return { err: true, message: 'This nsfw not found in database' };
		}
	}

	async aproveNsfw(url: string): Promise<Database.Result> {
		const nsfw = await this.nsfwRepository.findOne({ url: url });
		if (nsfw) {
			nsfw.approve = true;
			this.nsfwRepository.save(nsfw);
		} else {
			return { err: true, message: 'This nsfw not found in database' };
		}
	}

	async getAproveNsfw(): Promise<NswfEntity[]> {
		return await this.nsfwRepository.find({ approve: true });
	}
}
