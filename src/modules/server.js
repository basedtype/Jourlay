const http = require('http');
const fs = require('fs');

const hostname = '192.168.0.106';
const port = 80;

const server = http.createServer((request, response) => {
    let file = `./src/modules/site${request.url}`;
    try {
        response.setHeader('Content-Type', 'text/html')
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