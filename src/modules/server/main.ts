/* IMPORTS */
import { color } from "../tools/color";

import * as subdomain from "express-subdomain";
import * as cookieParser from "cookie-parser";
import * as express from "express";
import * as fs from "fs";

/* PARAMS */
const startTime = Date.now();

/* FUNCTIONS */
/**
 * Response requested page
 * @param request 
 * @param esponse 
 * @returns
 */
function getPage(request: express.Request, response: express.Response): boolean {
    let filePath = `./src/www/${request.url}`.split('?')[0];
    const urlSplit = request.url.split('.');
    const file = urlSplit[urlSplit.length - 1];
    const header = `text/${file}`
    response.setHeader('Content-Type', header)
    response.statusCode = 200;
    response.end(fs.readFileSync(filePath));
    return true;
}

/**
 * Main router logic
 */
function host(app: express.Express): express.Express {
    app.get('/status', (request: express.Request, response: express.Response, next: express.NextFunction) => {
        response.json({ status: 'true', uptime: Date.now() - startTime})
    })

    return app;
}

/**
 * Api router logic
 */
function nvy(app: express.Router): express.Router {
    /**
     * Cookie parser
     */
    app.use(cookieParser('SECRET'));
    app.use(express.urlencoded({ extended: false }))

    /**
     * Set cookie
     */
    app.get('/nvy_register_7g30h8', (request: express.Request, response: express.Response, next: express.NextFunction) => {
        response.cookie(`author`, `true`);
        response.end('Successful')
    })

    app.get('/status', (request: express.Request, response: express.Response, next: express.NextFunction) => {
        const cookies = request.cookies;
        if (cookies['author'] !== 'true') return;
        response.end('Soon')
    })

    return app;
}

export class server {
    private static app = express();
    private static nvy = express.Router();

    public static testRun(): void {
        const HOST = '127.0.0.1'
        const PORT = 8000;
        this.app.set('subdomain offset', 1);
        this.app.use(subdomain('nvy', this.nvy));

        this.app = host(this.app);
        this.nvy = nvy(this.nvy);

        this.app.listen(PORT, HOST, () => {
            console.log(`${color.get(`[server]`, `FgCyan`)} - start ${color.get('test', 'FgGreen')} on ${HOST}:${PORT}`);
        });
    }

    public static run(): void {
        const HOST = '192.168.0.103'
        const PORT = 80;
        this.app.set('subdomain offset', 1);
        this.app.use(subdomain('nvy', this.nvy));

        this.app = host(this.app);
        this.nvy = nvy(this.nvy);

        this.app.listen(PORT, HOST, () => {
            console.log(`${color.get(`[server]`, `FgCyan`)} - start ${color.get('host', 'FgRed')} on ${HOST}:${PORT}`);
        });
    }
}