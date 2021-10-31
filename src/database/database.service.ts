import { Injectable } from '@nestjs/common';
import * as mongodb from "mongodb";
import * as crypto from "crypto";
import { Config } from 'types';

/* PARAMS */
const uri = "mongodb://127.0.0.1:27017/";
const mongo = new mongodb.MongoClient(uri);

const configDatabase = mongo.db('config');
const userCollection = configDatabase.collection('users');
const configCollection = configDatabase.collection('config');

@Injectable()
export class DatabaseService {
    async addUser(login: string, password: string, role: string): Promise<'err' | 'done'> {
        await mongo.connect();
        const pass = crypto.createHmac('sha256', password);
        await userCollection.findOneAndDelete({ login: login.toLocaleLowerCase() })
        const res = await userCollection.insertOne({ login: login, password: pass, role: [role] }).then((doc) => { if (!doc) return 'err'; else return 'done' });
        await mongo.close();
        return res;
    }

    async checkUser(login: string, password: string): Promise<boolean> {
        await mongo.connect();
        const pass = crypto.createHmac('sha256', password);
        const res = await userCollection.findOne({ login: login }).then(user => { if (!user || user.password !== pass) return false; else return true });
        await mongo.close();
        return res;
    }

    async addConfig(data: Config.Service): Promise<'err' | 'done'> {
        await mongo.connect();
        await configCollection.findOneAndDelete({service: data.service, target: data.target});
        const res = await configCollection.insertOne(data).then((doc) => { if (!doc) return 'err'; else return 'done' });
        await mongo.close();
        return res;
    }

    async getConfig(service: string, target?: string): Promise<any> {
        await mongo.connect();
        const res = await configCollection.findOne({service: service}).then(async (data: Config.Service) => {
            if (!data) return {};
            else if (target != null) {
                if (data.target === target) return data;
                else {
                    return await configCollection.findOne({service: service, target: target}).then((_data: Config.Service) => { if (!_data) return {}; else return _data});
                }
            } else return data;
        })
        await mongo.close();
        return res;
    }
}
