/* IMPORTS */
const { tools } = require('../Utils/tools');

/* PARAMS */
const version = 'v1.1';
const ru_alphabet = 'йцукенгшщзхъфывапролджэёячсмитьбюё';
const defenceLogo = `╔════════════════════════════════════════════════════════════════════╗
║      ██████╗░███████╗███████╗███████╗███╗░░██╗░█████╗░███████╗     ║
║      ██╔══██╗██╔════╝██╔════╝██╔════╝████╗░██║██╔══██╗██╔════╝     ║
║      ██║░░██║█████╗░░█████╗░░█████╗░░██╔██╗██║██║░░╚═╝█████╗░░     ║
║      ██║░░██║██╔══╝░░██╔══╝░░██╔══╝░░██║╚████║██║░░██╗██╔══╝░░     ║
║      ██████╔╝███████╗██║░░░░░███████╗██║░╚███║╚█████╔╝███████╗     ║
║      ╚═════╝░╚══════╝╚═╝░░░░░╚══════╝╚═╝░░╚══╝░╚════╝░╚══════╝     ║
╚═══╣${version}╠═══════════════════════════════════════════════════════════╝`

tools.clear();
console.log(defenceLogo)

/* CLASSES */
class twitch {
    static run() {
        const { client } = require('./Bots/Jourloy');
        client.on('message', (channel, userstate, message, self) => {
            if (self) return;
            const username = userstate['username'];
            if (username === 'jourloy') return;
            for (let i in message) {
                if (ru_alphabet.includes(message[i]) === true) {
                    client.deletemessage(channel, userstate['id']);
                    return;
                }
            }
        })
    }
}

class discord {
    static run() {
        const { client } = require('./Bots/Jourlay');
        client.on('message', msg => {
            if (msg.author.bot) return;
            const channel = msg.channel;
            const username = msg.author.username;
            const message = msg.content;
            const category = msg.channel.parent.name;

            if (username === 'jourloy') return;
            if (category !== 'Russia' && channel.name !== 'bot') {
                for (let i in message) {
                    if (ru_alphabet.includes(message[i]) === true) {
                        msg.delete();
                        return;
                    }
                }
            }
        });
    }
}

twitch.run();
discord.run();