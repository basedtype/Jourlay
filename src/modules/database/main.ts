/* IMPORTS */
import { config } from "../../../types";
import { color } from "../tools/color";

import * as mongodb from "mongodb";

/* PARAMS */
const uri = "mongodb://192.168.0.3:10000/";
const clientDB = new mongodb.MongoClient(uri, { useUnifiedTopology: true });

let configCollection: mongodb.Collection = null;
let logCollection: mongodb.Collection = null;
let botCollection: mongodb.Collection = null;
let mainlogCollection: mongodb.Collection = null;
let serverCollection: mongodb.Collection = null;
let serverIpCollection: mongodb.Collection = null;

/* CODE */
clientDB.connect().then(() => {
    const JRLYdatabase = clientDB.db('JOURLOY');
    configCollection = JRLYdatabase.collection('config');
    logCollection = JRLYdatabase.collection('logs');

    const botsDatabase = clientDB.db('Nidhoggbot');
    mainlogCollection = botsDatabase.collection('logs');
    botCollection = botsDatabase.collection('config')

    const serverDatabase = clientDB.db('Server');
    serverCollection = serverDatabase.collection('config');
    serverIpCollection = serverDatabase.collection('IP');
})

export class manager {

    /* <=========================== CONFIG ===========================> */

    /**
     * Add bot in collection
     */
    public static configAddBot(username: string, type: string, oauth: string): boolean {
        if (botCollection == null) return;
        if (username == null) return;
        if (type == null) return;
        if (oauth == null) return;
        const docs: config.bot = {
            username: username,
            type: type,
            oauth: oauth
        }
        botCollection.insertOne(docs).then(() => {
            console.log(`${color.get(`[database]`, `FgCyan`)} - add bot in config file`);
            mainlogCollection.insertOne({date: new Date(), text: '[database] - add bot in config file'});
        })
        return true;
    }

    /**
     * Get bot configs
     */
    public static async configGetBot(username: string, type: string): Promise<config.bot> {
        const bot = await botCollection.findOne({ username: username, type: type });
        return bot;
    }

    /* <=========================== JOURLOY ===========================> */

    /** */
    public static createLog(log: config.log) {
        logCollection.insertOne(log);
    }

    /**
     * Add log in log pool
     * @deprecated
     */
    public static jrlyAddLog(text: string): boolean {
        logCollection.insertOne({text: text, date: new Date()})
        return true;
    }

    /**
     * Get log from log pool
     */
    public static async jrlyGetLog() {
        const log = await logCollection.findOne({});
        return log;
    }

    /* <=========================== SERVER ===========================> */
}