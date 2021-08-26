/* IMPORTS */
import * as tmi from 'tmi.js';
import { manager } from "../database/main";

/* CLASSES */
export class twitchAdmin {
    private static client: tmi.Client = null;

    private static create(channel: string) {
        const options = {
            options: { debug: false },
            connection: {
                cluster: 'aws',
                reconnect: true
            },
            identity: {
                username: 'jourloy',
                password: null,
            },
            channels:[`#${channel}`],
        };
        manager.configGetBot('Jourloy', 'Twitch').then(bot => {
            options.identity.password = bot.oauth;
            this.client = new tmi.client(options);
            this.client.connect();
        })
    }
    
    public static connect(channel) {
        this.create(channel);
    }

    public static update() {
        return this.client;
    }
}