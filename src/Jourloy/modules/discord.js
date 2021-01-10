const Discord = require("discord.js");
const config = require("./conf");

const client = new Discord.Client();
client.login(config.ds_token);

/* PARAMS */

const announcement = '793404252809986068';
let noftification = null;

/* FUNCTIONS */

/* INTERVALS */

setInterval(function () {
    if (noftification == null) {
        client.channels.fetch('748407718414385183').then(channel => {
            if (channel == null) return;
            noftification = channel;
            console.log('Bot => Discord => Ready');
        });
    }
}, 1000);

/* REACTIONS */

/* CLASSES */

class discord {
    static noftification(game) {
        if (noftification == null) return false;
        const embed = new Discord.MessageEmbed()
        .setTitle(`СТРИМ НА КАНАЛЕ | НАЧИНАЕМ С ${game}`)
        .setColor(0xff0000)
        .setDescription(`Приветик, @everyone. А у нас тут стрим, давай подрубайся. Жми на заголовок, чтобы перейти на канал!`)
        .setURL('https://twitch.tv/jourloy')
        noftification.send(embed)
        return true;
    }
}

module.exports.discord = discord;
module.exports.ds = client;