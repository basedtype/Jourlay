import { Injectable } from '@nestjs/common';
import { Log } from 'src/entity/log.entity';
import { Repository } from 'typeorm';
import { InjectRepository } from '@nestjs/typeorm';
import { BinanceLog } from 'src/entity/binance.entity';
import { DiscordLog, DiscordUser } from 'src/entity/discord.entity';
import { Service } from 'src/entity/services.entity';
import { Config, Database } from 'types';

@Injectable()
export class DatabaseService {
    constructor(
		@InjectRepository(Log)
		private logRepository: Repository<Log>,

		@InjectRepository(BinanceLog)
		private binanceLogRepository: Repository<BinanceLog>,

		@InjectRepository(DiscordUser)
		private discordUserRepository: Repository<DiscordUser>,

		@InjectRepository(DiscordLog)
		private discordLogRepository: Repository<DiscordLog>,

		@InjectRepository(Service)
		private serviceRepository: Repository<Service>,
	) { }

    log = {
        discord: {
            findAll: this.discordLogFindAll,
            insertOne: this.discordLogInsertOne,
        },
        binance: {
            findAll: this.binanceLogFindAll,
            insertOne: this.binanceLogInsertOne,
        }
    }

    discord = {
        findAll: this.discordUserFindAll,
        findOneByID: this.discordUserFindOneByUserID,
        insertOne: this.discordUserInsertOne,
    }

    service = {
        findAll: this.serviceFindAll,
        findOne: this.serviceFindOne,
        insertOne: this.serviceInsertOne,
    }

    /**
     * Find and return all logs in database
     */
    private async logFindAll(): Promise<Log[]> {
        return this.logRepository.find();
    }

    /**
     * Find and return all logs in database
     */
    private async binanceLogFindAll(): Promise<BinanceLog[]> {
        return this.binanceLogRepository.find();
    }

    /**
     * Add new log in database
     * @param log
     */
    private async binanceLogInsertOne(log: BinanceLog) {
        await this.discordUserRepository.insert(log);
    }

    /**
     * Find and return all discord users
     */
    private async discordUserFindAll(): Promise<DiscordUser[]> {
        return this.discordUserRepository.find();
    }

    /**
     * Find and return discord user by ID
     * @param id ID of discord user
     */
    private async discordUserFindOneByUserID(id: string): Promise<DiscordUser> {
        return this.discordUserRepository.findOne({userID: id});
    }

    /**
     * Add new discord user in database
     * @param user 
     */
    private async discordUserInsertOne(user: DiscordUser): Promise<Database.Result> {
        if (await this.discordUserFindOneByUserID(user.userID)) {
            return {err: true, message: 'This user alredy exist'};
        }
        await this.discordUserRepository.insert(user);
        return {err: false}
    }

    /**
     * Find and return all logs
     */
    private async discordLogFindAll(log: DiscordLog): Promise<DiscordLog[]> {
        return this.discordLogRepository.find();
    }

    /**
     * Add new log in database
     */
    private async discordLogInsertOne(log: DiscordLog): Promise<Database.Result> {
        await this.discordLogRepository.insert(log);
        return {err: false}
    }

    /**
     * Find and return all services
     */
    private async serviceFindAll(): Promise<Service[]> {
        return this.serviceRepository.find();
    }

    /**
     * Find and return one service
     */
    private async serviceFindOne(name: string, target: string): Promise<Service | undefined> {
        return this.serviceRepository.findOne({service: name, target: target});
    }

    /**
     * Add new service in database  
     */
    private async serviceInsertOne(service: Config.Service): Promise<Database.Result> {
        if (this.serviceFindOne(service.service, service.target)) {
            return {err: true, message: `This server already exist`};
        }
        await this.serviceRepository.insert(service);
        return {err: false};
    }
}
