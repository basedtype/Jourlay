const http = require('http');
const fs = require('fs');

const hostname = '127.0.0.1';
const port = 80;

const server = http.createServer((request, response) => {
    try {
        let filePath = `./src/modules/site${request.url}`;
        const urlSplit = request.url.split('.');
        const file = urlSplit[urlSplit.length - 1];
        console.log(file)
        const header = `text/${file}`
        response.setHeader('Content-Type', header)
        response.statusCode = 200;
        response.end(fs.readFileSync(filePath));
    } catch {
        response.setHeader('Content-Type', 'text/plain')
        response.statusCode = 200;
        response.end('Lol what?');
    }
    
});

server.listen(port, hostname, () => {
    console.log(`Server running at http://${hostname}:${port}/`);
});