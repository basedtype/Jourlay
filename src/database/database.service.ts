import { Injectable } from '@nestjs/common';
import * as crypto from "crypto";
import { Config } from 'types';
import * as mongodb from "mongodb"
import { Log } from 'src/entity/log.entity';
import { Repository } from 'typeorm';
import { InjectRepository } from '@nestjs/typeorm';
import { BinanceLog } from 'src/entity/binance.entity';
import { DiscordUser } from 'src/entity/discordUser.entity';
import { Service } from 'src/entity/services.entity';

/* PARAMS */
const uri = "mongodb://127.0.0.1:27017/";
const mongo = new mongodb.MongoClient(uri, { useUnifiedTopology: true });
mongo.connect();

@Injectable()
export class DatabaseService {
    constructor(
		@InjectRepository(Log)
		private logRepository: Repository<Log>,

		@InjectRepository(BinanceLog)
		private binanceLogRepository: Repository<BinanceLog>,

		@InjectRepository(DiscordUser)
		private discordUserRepository: Repository<DiscordUser>,

		@InjectRepository(Service)
		private serviceRepository: Repository<Service>,
	) { }

    async logFindAll(): Promise<Log[]> {
        return this.logRepository.find();
    }

    async binanceLogFindAll(): Promise<BinanceLog[]> {
        return this.binanceLogRepository.find();
    }

    async discordUserFindAll(): Promise<DiscordUser[]> {
        return this.discordUserRepository.find();
    }

    async discordUserFindOneByUserID(id: string): Promise<DiscordUser> {
        return this.discordUserRepository.findOne({userID: id});
    }

    async discordUserInsert(user: DiscordUser) {
        if (await this.discordUserFindOneByUserID(user.userID)) {
            return {err: true, message: 'This user alredy exist'};
        }
        await this.discordUserRepository.insert(user);
    }

    async serviceFindAll(): Promise<Service[]> {
        return this.serviceRepository.find();
    }
}
