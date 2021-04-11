/* IMPORTS */
const { twitch } = require('../Bots/twitch');
const { colors } = require('../colors')
const tmi = require('tmi.js')
const Multiprogress = require('multi-progress');

/* PARAMS */
const logo = `███╗  ██╗ █████╗ ███╗   ███╗██╗   ██╗ ██████╗███████╗██╗   ██╗ █████╗  ██████╗███╗  ██╗ █████╗ 
████╗ ██║██╔══██╗████╗ ████║██║   ██║██╔════╝██╔════╝╚██╗ ██╔╝██╔══██╗██╔════╝████╗ ██║██╔══██╗
██╔██╗██║███████║██╔████╔██║╚██╗ ██╔╝╚█████╗ █████╗   ╚████╔╝ ███████║╚█████╗ ██╔██╗██║██║  ██║
██║╚████║██╔══██║██║╚██╔╝██║ ╚████╔╝  ╚═══██╗██╔══╝    ╚██╔╝  ██╔══██║ ╚═══██╗██║╚████║██║  ██║
██║ ╚███║██║  ██║██║ ╚═╝ ██║  ╚██╔╝  ██████╔╝███████╗   ██║   ██║  ██║██████╔╝██║ ╚███║╚█████╔╝
╚═╝  ╚══╝╚═╝  ╚═╝╚═╝     ╚═╝   ╚═╝   ╚═════╝ ╚══════╝   ╚═╝   ╚═╝  ╚═╝╚═════╝ ╚═╝  ╚══╝ ╚════╝ `;
const multi = new Multiprogress(process.stderr);
const bar = multi.newBar(' getting twitch client [:bar] :percent :etas', {
    complete: '+',
    incomplete: '-',
    width: 30,
    total: 5
});
let getClient = false;
let clientExample = new tmi.client();
/**
 * @type {clientExample}
 */
let client = null;
let timer = 5;

/* INTERVALS */
let clientIntervalID = setInterval(() => {
    if (client != null) clearInterval(clientIntervalID);
    if (getClient === false) client = twitch.connect('jourloy');
    client = twitch.update();
    getClient = true;
}, 1000)

let startIntervalID = setInterval(() => {
    bar.tick(1)
    timer--;
    if (timer != 0) return;
    if (client == null) return;
    module.exports.client = client;
    require('./modules/twitch');
    require('./modules/discordGiveaway');
    console.log(colors.box(logo, 'FgRed'))
    clearInterval(startIntervalID);
}, 1000)