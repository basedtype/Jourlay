/* IMPORTS */
const tmi = require('tmi.js');
const config = require('./config');

/* PARAMS */
const version = 'v1.3';
const logo = `╔════════════════════════════════════════════════════════════════════╗
║        ████████╗░██╗░░░░░░░██╗██╗████████╗░█████╗░██╗░░██╗         ║
║        ╚══██╔══╝░██║░░██╗░░██║██║╚══██╔══╝██╔══██╗██║░░██║         ║
║        ░░░██║░░░░╚██╗████╗██╔╝██║░░░██║░░░██║░░╚═╝███████║         ║
║        ░░░██║░░░░░████╔═████║░██║░░░██║░░░██║░░██╗██╔══██║         ║
║        ░░░██║░░░░░╚██╔╝░╚██╔╝░██║░░░██║░░░╚█████╔╝██║░░██║         ║
║        ░░░╚═╝░░░░░░╚═╝░░░╚═╝░░╚═╝░░░╚═╝░░░░╚════╝░╚═╝░░╚═╝         ║
╚═══╣${version}╠═══════════════════════════════════════════════════════════╝`;
const options = {
    options: { debug: false },
    connection: {
        cluster: 'aws',
        reconnect: true
    },
    identity: {
        username: 'jourlay',
        password: config.jourloy,
    },
    channels:['#jourloy'],
};
const client = new tmi.client(options);
client.channel = options.channels[0];

/* FUNCTIONS */
function onConnectedHandler() {
    console.log(logo);
}

/* CODE */
client.on('connected', onConnectedHandler);
client.connect();

/* EXPORTS */
module.exports.client = client;