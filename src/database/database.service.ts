import { Injectable } from '@nestjs/common';
import * as crypto from "crypto";
import { Config } from 'types';
import * as mongodb from "mongodb"

/* PARAMS */
const uri = "mongodb://127.0.0.1:27017/";
const mongo = new mongodb.MongoClient(uri, { useUnifiedTopology: true });
mongo.connect();

@Injectable()
export class DatabaseService {
    private userCol(mongoDB) {
        const configDatabase = mongoDB.db('config');
        return configDatabase.collection('users');
    }

    private configCol(mongoDB) {
        const configDatabase = mongoDB.db('config');
        return configDatabase.collection('config');
    }

    async addUser(login: string, password: string, role: string): Promise<'err' | 'done'> {
        
        const userCollection = this.userCol(mongo);
        const pass = crypto.createHmac('sha256', password);
        await userCollection.findOneAndDelete({ login: login.toLocaleLowerCase() })
        const res = await userCollection.insertOne({ login: login, password: pass, role: [role] }).then((doc) => { if (!doc) return 'err'; else return 'done' });
        
        return res;
    }

    async checkUser(login: string, password: string): Promise<boolean> {
        
        const userCollection = this.userCol(mongo);
        const pass = crypto.createHmac('sha256', password);
        const res = await userCollection.findOne({ login: login }).then(user => { if (!user || user.password !== pass) return false; else return true });
        
        return res;
    }

    async addConfig(data: Config.Service): Promise<'err' | 'done'> {
        const configCollection = this.configCol(mongo);
        await configCollection.findOne({service: data.service}).then(async result => { if (result) await configCollection.findOneAndDelete({service: data.service, target: data.target})})
        const res = await configCollection.insertOne(data).then((doc) => { if (!doc) return 'err'; else return 'done' });
        return res;
    }

    async getConfig(service: string, target?: string): Promise<any> {
        
        const configCollection = this.configCol(mongo);
        const res = await configCollection.findOne({service: service}).then(async (data: Config.Service) => {
            if (!data) return {};
            else if (target != null) {
                if (data.target === target) return data;
                else {
                    return await configCollection.findOne({service: service, target: target}).then((_data: Config.Service) => { if (!_data) return {}; else return _data});
                }
            } else return data;
        })
        
        return res;
    }
}
