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

interface poolBlock {
    type: string;
    owner: string;
    data: string;
}