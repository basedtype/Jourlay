/* IMPORTS */
import { config } from "../../../types";
import { color } from "../tools/color";

import * as mongodb from "mongodb";

/* PARAMS */
const uri = "mongodb://192.168.0.3:10000/";
const clientDB = new mongodb.MongoClient(uri, { useUnifiedTopology: true });

let configCollection: mongodb.Collection = null;
let logCollection: mongodb.Collection = null;
let chattersCollection: mongodb.Collection = null;
let discordMembersCollection: mongodb.Collection = null;
let mainlogCollection: mongodb.Collection = null;
let botCollection: mongodb.Collection = null;
let serverCollection: mongodb.Collection = null;
let serverIpCollection: mongodb.Collection = null;
let informationCollection: mongodb.Collection = null;
let nvyConfigCollection: mongodb.Collection = null;

/* CODE */
clientDB.connect().then(() => {
    const JRLYdatabase = clientDB.db('JOURLOY');
    configCollection = JRLYdatabase.collection('config');
    logCollection = JRLYdatabase.collection('logs');
    chattersCollection = JRLYdatabase.collection('chatters');
    discordMembersCollection = JRLYdatabase.collection('members');

    const botsDatabase = clientDB.db('Nidhoggbot');
    mainlogCollection = botsDatabase.collection('logs');
    botCollection = botsDatabase.collection('config')

    const serverDatabase = clientDB.db('Server');
    serverCollection = serverDatabase.collection('config');
    serverIpCollection = serverDatabase.collection('IP');
    informationCollection = serverDatabase.collection('info');

    const nvyDatabase = clientDB.db('NAMVSEYASNO');
    nvyConfigCollection = nvyDatabase.collection('config');
})

export class manager {

    /* <=========================== NVY ===========================> */

    /**
     * Retun server configs
     */
     public static async nvyGetServerConfig(): Promise<config.serverConfigs> {
        if (nvyConfigCollection == null) return;
        let config = await nvyConfigCollection.findOne({conf: true});
        if (config == null) {
            const docs: config.serverConfigs = {
                logChannelID: '',
                logs: false,
                modChannelID: '',
                updates: false,
                conf: true,
            }
            nvyConfigCollection.insertOne(docs);
            return docs;
        } else return config;
    }

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

    /** 
     * Add log in pool
     */
    public static createLog(log: config.log) {
        logCollection.insertOne(log);
    }

    /**
     * Add watchtime
     */
    public static addWatchTime(id: string) {
        chattersCollection.findOne({id: id}).then(chatter => {
            if (chatter == null) {
                const chatter = {
                    id: id,
                    watchTime: 1
                }
                chattersCollection.insertOne(chatter);
            } else {
                chatter.watchTime++;
                chattersCollection.findOneAndUpdate({id: id}, {$set: chatter});
            }
        })
    }

    /**
     * Return information about chatter
     */
    public static getChatterInfo(id: string) {
        return chattersCollection.findOne({id: id});
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
     * @deprecated
     */
    public static async jrlyGetLog() {
        const log = await logCollection.findOne({});
        return log;
    }

    public static updateInviterMember(username: string) {
        discordMembersCollection.findOne({username: username}).then(member => {
            if (member == null) {
                member = {
                    username: username,
                    inviteUses: 1
                }
                discordMembersCollection.insertOne(member);
            } else {
                member.inviteUses++;
                discordMembersCollection.findOneAndUpdate({_id: member._id}, {$set: member});
            }
        })
    }

    /* <=========================== SERVER ===========================> */

    /**
     * Add uptime
     */
     public static updateUptime(uptime: number, bot: string): boolean {
        informationCollection.findOne({type: 'uptime', bot: bot}).then(upt => {
            if (upt == null) informationCollection.insertOne({type: 'uptime', uptime: uptime, bot: bot});
            else informationCollection.findOneAndUpdate({type: 'uptime', bot: bot}, {$set: {type: 'uptime', uptime: uptime, bot: bot}});
        })
        return true;
    }

    /**
     * Get uptime
     */
    public static async getUptime(bot: string): Promise<{type: string, uptime: number, bot: string}> {
        const uptime = await informationCollection.findOne({ type: 'uptime', bot: bot });
        return uptime;
    }
}