const Discord = require("discord.js");
const config = require("./conf");

const client = new Discord.Client();
client.login(config.ds_token);

/* PARAMS */


console.log(client);

client.on("message", function(message) {
    if (message.author.bot) return;
    console.log(message);
    if (message.channel.name == '📣анонсы') nfChannel.send('test');
});

class discord {

}

module.exports.discord = discord;
module.exports.ds = client;