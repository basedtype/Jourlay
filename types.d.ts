/* IMPORTS */

/* TYPES */

interface Time {
    seconds?: number;
    minutes?: number;
    hours?: number;
    days?: number;
    weeks?: number;
    mounths?: number;
}

export namespace Config {
    interface Service {
        /**
         * Name of service
         * @example param.service = "Binance";
         */
        service: string,
        /**
         * For what this API key
         * @example param.target = "Profile";
         */
        target: string,
        /**
         * Auth data. May contain API key or login and password
         * @example param.auth.api = "thisiscoolapikey";
         * // OR
         * param.auth.login = "CoolLogin";
         * param.auth.password = "SecretPassword";
         */
        auth: {
            api?: string,
            secret?: string,
            login?: string,
            password?: string,
        }
        /**
         * Any comment
         * @example param.description = `This is need for login at binance`
         */
        description?: string,
    }

    interface User {
        login: string;
        password: string,
        roles: string[],
    }
}

export namespace Binance {
    interface CurrentPeriod {
        bid: {
            startPrice: string;
            prices: PeriodPrice[];
            avgDirection: 'up' | 'down' | 'none';
        },
        ask: {
            startPrice: string;
            prices: PeriodPrice[];
            avgDirection: 'up' | 'down' | 'none';
        }
        amount: number;
        id: number;
    }

    interface PeriodPrice {
        lastPrice: string;
        direction: 'up' | 'down' | 'none';
    }

    interface BookTicker {
        symbol: string;
        /**
         * Float as string
         */
        bidPrice: string;
        /**
         * Float as string
         */
        bidQty: string;
        /**
         * Float as string
         */
        askPrice: string;
        /**
         * Float as string
         */
        askQty: string;
    }
}

export namespace Discord {
    interface Warning {
        /**
         * ID of moderator which send a warning
         */
        moderator: string,
        /**
         * Time of warning is seconds. It's automatic param
         */
        expires: number,
        /**
         * Reason of warning
         */
        reason?: string,
    }
}