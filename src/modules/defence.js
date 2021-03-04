/* IMPORTS */
const { tools } = require('../Utils/tools');

/* PARAMS */
const allowed = `!@~\`#%$%^&*()+_=/|>.<,;:"'}]{[qwertyuiop[]';lkjhgfdsazxcvbnm1234567890-\\?><~±}{)("''".,)} `
const ru_alphabet = 'йцукенгшщзхъфывапролджэёячсмитьбюё';
let logs = [];
const defenceLogo = `
╔════════════════════════════════════════════════════════════════════╗
║      ██████╗░███████╗███████╗███████╗███╗░░██╗░█████╗░███████╗     ║
║      ██╔══██╗██╔════╝██╔════╝██╔════╝████╗░██║██╔══██╗██╔════╝     ║
║      ██║░░██║█████╗░░█████╗░░█████╗░░██╔██╗██║██║░░╚═╝█████╗░░     ║
║      ██║░░██║██╔══╝░░██╔══╝░░██╔══╝░░██║╚████║██║░░██╗██╔══╝░░     ║
║      ██████╔╝███████╗██║░░░░░███████╗██║░╚███║╚█████╔╝███████╗     ║
║      ╚═════╝░╚══════╝╚═╝░░░░░╚══════╝╚═╝░░╚══╝░╚════╝░╚══════╝     ║
╠═══════════════════════════════════╦════════════════════════════════╝
║ ██╗░░░░░░█████╗░░██████╗░░██████╗ ║
║ ██║░░░░░██╔══██╗██╔════╝░██╔════╝ ║
║ ██║░░░░░██║░░██║██║░░██╗░╚█████╗░ ║
║ ██║░░░░░██║░░██║██║░░╚██╗░╚═══██╗ ║
║ ███████╗╚█████╔╝╚██████╔╝██████╔╝ ║
║ ╚══════╝░╚════╝░░╚═════╝░╚═════╝░ ║
╠═══════════════════════════════════╝`

function createLogo() {
    console.log(defenceLogo);
    const nlogs = logs.reverse();
    for (let i = 0; i < 6; i++) {
        if (i < 5) {
            if (nlogs[i] == null) console.log(`║`);
            else console.log(`║ ${nlogs[i]}`);
        } else if (i === 5) {
            if (nlogs[i] == null) console.log(`║`);
            else console.log(`║ ${nlogs[i]}`);
        }
    }
    console.log(`╚════════════════════════════════════`)
}

setInterval(function() {
    tools.clear();
    createLogo();
}, 1000)

/* CLASSES */
class twitch {
    static run() {
        const { client } = require('./Bots/Jourloy');

        client.on('message', (channel, userstate, message, self) => {
            if (self) return;
            const username = userstate['username'];

            for (let i in message) {
                if (ru_alphabet.includes(message[i]) === true) {
                    if (username === 'jourloy') {
                        logs.push(`[ MESSAGE DELETE ] >> [ TWITCH ] >> ${username} >> ${message[i]}`);
                        return;
                    }
                    client.deletemessage(channel, userstate['id']);
                    logs.push(`[ MESSAGE DELETE ] >> [ DISCORD ] >> ${username}`);
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

            if (category !== 'Russia' && channel.name !== 'bot') {
                for (let i in message) {
                    if (ru_alphabet.includes(message[i]) === true) {
                        msg.delete();
                        logs.push(`[ MESSAGE DELETE ] >> [ DISCORD ] >> ${username}`);
                        return;
                    }
                }
            }
        });
    }
}

twitch.run();
discord.run();