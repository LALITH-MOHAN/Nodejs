const fs = require('fs');
const http = require('http');
const path = require('path');



const server = http.createServer((req, res) => {
    let filePath = path.join(__dirname, 'public', req.url === '/' ? 'index.html' : req.url);

    fs.readFile(filePath, 'utf8', (err, content) => {
        if (err) {
            res.writeHead(404, { 'Content-Type': 'text/html' });
            res.end('<h1>404 - File Not Found</h1>');
        } else {
            res.writeHead(200, { 'Content-Type':'text/html'});
            res.end(content);
        }
    });
});

server.listen(3000, () => {
    console.log("Server listening on port 3000");
});
