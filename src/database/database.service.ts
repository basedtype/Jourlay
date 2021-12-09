import { Injectable } from '@nestjs/common';
import { Log } from 'src/entity/log.entity';
import { Connection, Repository } from 'typeorm';
import { InjectRepository } from '@nestjs/typeorm';
import { DiscordLog, DiscordUser } from 'src/entity/discord.entity';
import { Service } from 'src/entity/services.entity';
import { Config, Database } from 'types';
import { ServerUser } from 'src/entity/users.entity';

@Injectable()
export class DatabaseService {
	logRepository: Repository<Log>;
	discordUserRepository: Repository<DiscordUser>;
	discordLogRepository: Repository<DiscordLog>;
	serviceRepository: Repository<Service>;
	userRepository: Repository<ServerUser>;

	constructor(readonly connection: Connection) {
		this.logRepository = this.connection.getRepository(Log);
		this.discordUserRepository = this.connection.getRepository(DiscordUser);
		this.discordLogRepository = this.connection.getRepository(DiscordLog);
		this.serviceRepository = this.connection.getRepository(Service);
		this.userRepository = this.connection.getRepository(ServerUser);
	}

	/**
	 * Find and return all logs in database
	 */
	async logFindAll(): Promise<Log[]> {
		return this.logRepository.find();
	}

	/**
	 * Find and return all discord users
	 */
	async discordUserFindAll(): Promise<DiscordUser[]> {
		return this.discordUserRepository.find();
	}

	/**
	 * Find and return discord user by ID
	 * @param id ID of discord user
	 */
	async discordUserFindOneByUserID(id: string): Promise<DiscordUser> {
		return this.discordUserRepository.findOne({ userID: id });
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
	async discordUserAddMessage(userID: string): Promise<void> {
		const user = await this.discordUserRepository.findOne({ userID: userID });

		if (user == null) {
			user.userID = userID;
			user.warnings = 0;
			user.bans = 0;
			user.messages = 1;
			await this.discordUserInsertOne(user);
		} else {
			user.messages += 1;
			await this.discordUserRepository.save(user);
		}
	}

	/**
	 * Find and return all logs
	 */
	async discordLogFindAll(log: DiscordLog): Promise<DiscordLog[]> {
		return this.discordLogRepository.find();
	}

	/**
	 * Add new log in database
	 */
	async discordLogInsertOne(log: DiscordLog): Promise<Database.Result> {
		await this.discordLogRepository.insert(log);
		return { err: false };
	}

	/**
	 * Find and return all services
	 */
	async serviceFindAll(): Promise<Service[]> {
		return this.serviceRepository.find();
	}

	/**
	 * Find and return one service
	 */
	async serviceFindOne(name: string, target: string): Promise<Service | undefined> {
		return this.serviceRepository.findOne({ service: name, target: target });
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
		return this.userRepository.find();
	}

	/**
	 * Find and return one user by name
	 */
	async userFindOneByUsername(username: string): Promise<ServerUser | undefined> {
		return this.userRepository.findOne({ username: username });
	}

	/**
	 * Find and return one user by email
	 */
	async userFindOneByEmail(email: string): Promise<ServerUser | undefined> {
		return this.userRepository.findOne({ username: email });
	}

	/**
	 * Add new user in database
	 */
	async userInsertOne(user: ServerUser): Promise<Database.Result> {
		if (this.userFindOneByUsername(user.email)) {
			return { err: true, message: `This email already used` };
		}
		if (this.userFindOneByEmail(user.username)) {
			return { err: true, message: `This username already used` };
		}
		await this.userRepository.insert(user);
		return { err: false };
	}
}
