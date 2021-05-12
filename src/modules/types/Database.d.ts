declare namespace config {
    interface bot {
        username: string;
        type: string;
        oauth: string;
    }

    interface guild {
        type: string;
        ID: number;
        access: config.access;
        giveaways?: {
            channelID: string;
            userAccess: string[]
        }
    }
    
    interface access {
        giveaways?: string[];
    }
}

declare namespace server {
    interface address {
        IP: string;
        warnings: number;
        banned: boolean;
        description: string;
        version?: string;
    }
}

declare namespace pool {
    interface logBlock {
        type: string;
        owner: string;
        text: string;
        logging: boolean;
        color?: string;
    }
}

declare namespace giveaways {
    interface give {
        msgID: string;
        /**
         * Amount of winners
         */
        amount: number;
        /**
         * Time length in ms
         * @deprecated use .time
         */
        length: number;
        time?: string;
        /**
         * Time of end in ms
         */
        end: number;
        /**
         * Time of created in ms
         */
        created: number;
        /**
         * Who join in giveaway
         */
        people: string[];
        /**
         * Url in title
         */
        urlTitle: string;
        /**
         * Url on image in body
         */
        urlImage: string;
        title: string;
        /**
         * Who create giveaway
         * @deprecated
         */
        authorUsername?: string;
        /**
         * Url on author's avatar
         * @deprecated
         */
        authorURL?: string;
        owner?: string;
        /**
         * TODO: Resolve ^ and v
         */
        guildID?: number;
    }
}

interface configUser {
    username: string;
    giveaways?: string[]
} 

