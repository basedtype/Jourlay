/* IMPORTS */
const tmi = require('tmi.js');
const { MongoClient } = require("mongodb");

/* CLASSES */
class twitch {
    static client = null;

    static create(channel) {
        const options = {
            options: { debug: false },
            connection: {
                cluster: 'aws',
                reconnect: true
            },
            identity: {
                username: 'jourlay',
                password: null,
            },
            channels:[`#${channel}`],
        };
        const uri = "mongodb://192.168.0.100:12702/";
        const clientDB = new MongoClient(uri, { useUnifiedTopology: true });
        return clientDB.connect().then(err => {
            const database = clientDB.db('Nidhoggbot');
            const config = database.collection('config');
            config.findOne({name: 'Nidhoggbot', type: 'Twitch'}).then(conf => {
                options.identity.password = conf.oauth;
                this.client = new tmi.client(options);
                this.client.connect();
            });
        })
    }
    
    static connect(channel) {
        this.create(channel);
    }

    static update() {
        return this.client;
    }
}

/* EXPORTS */
module.exports.twitch = twitch;