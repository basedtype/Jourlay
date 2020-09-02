const twitch = require('./TwitchBot');
const discord = require('./DiscordBot');
const tools = require('./tools');
const spaceGame = require('./SpaceGame');
const https = require('https');

//const chattersInfo = tools.GetChattersInfo();
let uptime;

const twitchClient = twitch.start()

setInterval(function () {
    twitchClient.api({
        url: "https://api.twitch.tv/kraken/streams/158466757/",
        method: "GET",
        headers: {
            'Accept': 'application/vnd.twitchtv.v5+json',
            "Client-ID": "q9hc1dfrl80y7eydzbehcp7spj6ga1",
            'Authorization': 'OAuth djzzkk9jr9ppnqucmx1ixsce7kl9ly'
        }
    }, (err, res, body) => {
        if (body.stream != null) {
            let now = new Date();
            let then = body.stream.created_at;
            let ms = moment(now).diff(moment(then));
            let d = moment.duration(ms);
            let s = Math.floor(d.asHours()) + moment.utc(ms).format(" ч. mm мин.");
            uptime = `JOURLOY вещает на всю станцию уже ${s}`
        } else uptime = `стример сейчас оффлайн`
    });
}, 1000);

twitchClient.on("message", (channel, userstate, message, self) => {
    if (self) return;
    const username = userstate['display-name'];
    if (message == '!uptime') twitchClient.say(channel, `@${username}, ${uptime}`);
});

discordClient = discord.start()
discordClient.on('message', message => {
    // If the message is "ping"
    if (message.content === 'ping') {
        // Send "pong" to the same channel
        message.channel.send('pong');
    }
});