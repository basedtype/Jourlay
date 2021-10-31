/* IMPORTS */

/* TYPES */
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

interface Time {
    seconds?: number;
    minutes?: number;
    hours?: number;
    days?: number;
    weeks?: number;
    mounths?: number;
}