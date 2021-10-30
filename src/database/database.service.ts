import { Injectable } from '@nestjs/common';
import * as mongodb from "mongodb";
import * as crypto from "crypto";

/* PARAMS */
const uri = "mongodb://127.0.0.1:27017/";
const mongo = new mongodb.MongoClient(uri);

const configDatabase = mongo.db('config');
const userCollection = configDatabase.collection('users');

@Injectable()
export class DatabaseService {
    async addUser(login: string, password: string, role: string): Promise<string> {
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
        const res = await userCollection.findOne({ login: login }).then(user => { if (!user) return false; else return true });
        return res;
    }
}
