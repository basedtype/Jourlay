/* IMPORTS */
const { DBmanager } = require('./DBmanager');
const { colors } = require('./colors');
const http = require('http');
const fs = require('fs');

/* PARAMS */
const hostname = '192.168.0.106';
const port = 80;
const banCount = 30;

/* FUNCTIONS */
const server = http.createServer((request, response) => {
    const requestIP = request.socket.server._connectionKey.split(':')[1];
    DBmanager._serverIPGet(requestIP).then(ipAddress => {
        if (ipAddress == null) {
            try {
                let filePath = `./src/modules/site${request.url}`;
                const urlSplit = request.url.split('.');
                const file = urlSplit[urlSplit.length - 1];
                const header = `text/${file}`
                response.setHeader('Content-Type', header)
                response.statusCode = 200;
                response.end(fs.readFileSync(filePath));
            } catch {
                if (request.url !== '/') DBmanager._serverIPAdd(requestIP);
                response.setHeader('Content-Type', 'text/plain')
                response.statusCode = 404;
                response.end('Lol what?');
            }
        } else {
            if (ipAddress.ban === true) {
                console.log(colors.get(`[WARNING] request from banned IP address was stopped`, 'FgYellow'));
                return;
            }
            if (ipAddress.count > banCount) {
                response.setHeader('Content-Type', 'text/plain')
                response.statusCode = 403;
                response.end('You are banned');
                DBmanager._serverIPban(requestIP);
                console.log(colors.get(`[WARNING] IP address was banned {${requestIP}}`, 'FgYellow'));
                return;
            }
            try {
                let filePath = `./src/modules/site${request.url}`;
                const urlSplit = request.url.split('.');
                const file = urlSplit[urlSplit.length - 1];
                const header = `text/${file}`
                response.setHeader('Content-Type', header)
                response.statusCode = 200;
                response.end(fs.readFileSync(filePath));
            } catch {
                if (request.url !== '/') DBmanager._serverIPAdd(requestIP, 3);
                if (request.url === '/') DBmanager._serverIPAdd(requestIP, 1);
                response.setHeader('Content-Type', 'text/plain')
                response.statusCode = 404;
                response.end('Lol what?');
            }
        }
    })
});

/* REACTIONS */
server.listen(port, hostname, () => {
    console.log(`Server running at http://${hostname}:${port}/`);
});