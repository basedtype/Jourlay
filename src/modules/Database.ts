/* IMPORTS */
import { color } from "./tools/colors";

import * as mongodb from "mongodb";
import * as moment from "moment";

/* PARAMS */
const uri = "mongodb://192.168.0.100:12702/";
const clientDB = new mongodb.MongoClient(uri, { useUnifiedTopology: true });

let database: mongodb.Db = null;
let usersCollection: mongodb.Collection = null;
let twitchCollection: mongodb.Collection = null;
let configCollection: mongodb.Collection = null;
let poolCollection: mongodb.Collection = null;
let serverCollection: mongodb.Collection = null;
let eveCollection: mongodb.Collection = null;
let authCollection: mongodb.Collection = null;
let giveawaysCollection: mongodb.Collection = null;
/**
 * @deprecated
 */
let namUsersCollection: mongodb.Collection = null;
/**
 * @deprecated
 */
let namGiveCollection: mongodb.Collection = null;

/* CODE */
clientDB.connect().then(() => {
    database = clientDB.db('Nidhoggbot');
    usersCollection = database.collection('users');
    twitchCollection = database.collection('twitch');
    configCollection = database.collection('config');
    poolCollection = database.collection('pool');
    serverCollection = database.collection('server');
    eveCollection = database.collection('eve');
    authCollection = database.collection('auth');
    giveawaysCollection = database.collection('giveaways');
    namUsersCollection = database.collection('NAMVSEYASNO_users');
    namGiveCollection = database.collection('NAMVSEYASNO_giveaways');
})

export class manager {
    public static configAddBot(username: string, type:string, oauth: string): boolean {
        if (configCollection == null) return;
        if (username == null) return;
        if (type == null) return;
        if (oauth == null) return;
        const docs: config.bot = {
            username: username,
            type: type,
            oauth: oauth
        }
        configCollection.insertOne(docs).then(() => {
            console.log(`${color.get(`[database]`, `FgCyan`)} - add bot in config file`)
        })
        return true;
    }

    public static configAddGuild(type: string, ID: number, access: config.access): boolean {
        if (configCollection == null) return;
        if (type == null) return;
        if (name == null) return;
        if (access == null) return;
        const docs = {
            type: type,
            ID: ID,
            access: access
        }
        configCollection.insertOne(docs).then(() => {
            console.log(`${color.get(`[database]`, `FgCyan`)} - add bot in config file`);
        })
        return true;
    }

    public static async configGetGuild(ID: number): Promise<config.guild> {
        if (ID == null) return;
        const guild: Promise<config.guild> = await configCollection.findOne({ID: ID});
        return guild;
    }

    public static serverBanIP(IP: string, reason?: string): boolean {
        if (IP == null) return;
        serverCollection.findOne({IP: IP}).then(address => {
            if (address == null) {
                const docs: server.address = {
                    IP: IP,
                    warnings: 0,
                    banned: true,
                    description: reason || "",
                    version: 'v1.0'
                }
                serverCollection.insertOne(docs);
            } else {
                address.banned = true;
                if (reason != null || reason != "") address.description = reason;
                serverCollection.updateOne({IP: IP}, {$set: address});
            }
        })
        return true;
    }

    public static serverUnbanIP(IP: string): boolean {
        if (IP == null) return;
        serverCollection.findOne({IP: IP}).then(address => {
            if (address == null) return;
            else {
                address.banned = false;
                serverCollection.updateOne({IP: IP}, {$set: address});
            }
        })
        return true;
    }

    public static serverAddWarning(IP: string): boolean {
        if (IP == null) return;
        serverCollection.findOne({IP: IP}).then(address => {
            if (address == null) {
                const docs: server.address = {
                    IP: IP,
                    warnings: 1,
                    banned: false,
                    description: "",
                    version: 'v1.0'
                }
                serverCollection.insertOne(docs);
            } else {
                address.warnings++;
                serverCollection.updateOne({IP: IP}, {$set: address});
            }
        })
        return true;
    }

    public static async serverGetBannedIP(): Promise<server.address[]> {
        const address: Promise<server.address[]> = serverCollection.find().toArray();
        return address;
    }
}