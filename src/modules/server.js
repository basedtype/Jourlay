const http = require('http');
const fs = require('fs');

const hostname = '192.168.0.106';
const port = 80;

const server = http.createServer((request, response) => {
    let file = `./src/modules/site${request.url}`;
    try {
        const urlSplit = request.url.split('.');
        const file = urlSplit[urlSplit.length - 1];
        const header = `text/${file}`
        response.setHeader('Content-Type', header)
        response.statusCode = 200;
        response.end(fs.readFileSync(file));
    } catch {
        response.setHeader('Content-Type', 'text/plain')
        response.statusCode = 200;
        response.end('Lol what?');
    }
    
});

server.listen(port, hostname, () => {
    console.log(`Server running at http://${hostname}:${port}/`);
});