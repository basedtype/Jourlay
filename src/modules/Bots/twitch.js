/* IMPORTS */
const tmi = require('tmi.js');
const { MongoClient } = require("mongodb");

/* PARAMETERS */
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
    channels:['#jourloy'],
};
const uri = "mongodb://192.168.0.104:12702/";
const clientDB = new MongoClient(uri);
const client = new tmi.client(options);

/* FUNCTIONS */
function onConnectedHandler() { client.color("OrangeRed") }

/* CODE */
clientDB.connect().then(err => {
    const database = clientDB.db('config');
    const config = database.collection('config');
    config.findOne({name: 'DragonBot', type: 'Twitch'}).then(conf => {
        options.identity.password = conf.oauth;
        client.connect();
    });
})

/* REACTIONS */
client.on('connected', onConnectedHandler);

/* EXPORTS */
module.exports.client = client;