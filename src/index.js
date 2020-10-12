const child_process = require('child_process');
const http = require('http');
const fs = require('fs');
const path = require('path');
const execSync = child_process.execSync;
const exec = child_process.exec;

const port = process.argv[2] || 999;
const ROOT_DIR = './src/static/';
const UTF8 = 'utf-8';
const TYPE_JSON = 'application/json';
const TYPE_OCTET = 'application/octet-stream';
const mimeTypes = {
  '.ico': 'image/x-icon',
  '.html': 'text/html',
  '.js': 'text/javascript',
  '.css': 'text/css'
};
const NOT_FOUND = 'file not found';
const STATUS_OK = 200;
const STATUS_ERROR = 500;

const getCommand = (command) => `cd ./src/scripts && ${command}`;

const handleAsyncCommandResponse = (request, response) => {
  const filePath = request.url.replace('/command-async', '');

  exec(getCommand(filePath), { encoding: UTF8 }, (error, stdout, stderr) => {
    if (error) {
      response.writeHead(STATUS_ERROR, { 'Content-Type': TYPE_JSON });
      response.end(JSON.stringify({
        error: true,
        message: error || stderr
      }));
    }
    else {
      response.writeHead(STATUS_OK, { 'Content-Type': TYPE_JSON });
      response.end(JSON.stringify({ message: stderr.concat(stdout) }), UTF8);
    }
  });
};

const handleSyncCommandResponse = (request, response) => {
  const filePath = request.url.replace('/command', '');
  try {
    const result = execSync(getCommand(filePath), { encoding: UTF8 });

    response.writeHead(STATUS_OK, { 'Content-Type': TYPE_JSON });
    response.end(JSON.stringify({ message: result }), UTF8);
  } catch (ex) {
    response.writeHead(STATUS_ERROR, { 'Content-Type': TYPE_JSON });
    response.end(JSON.stringify({
      error: true,
      status: ex.status,
      message: ex.message
    }));
  }
};

const handleStaticResponse = (request, response) => {
  const filePath = (request.url === '/' || request.url === '/index.html') ? ROOT_DIR + 'index.html' : ROOT_DIR + request.url;
  const extname = String(path.extname(filePath)).toLowerCase();
  const contentType = mimeTypes[extname] || TYPE_OCTET;

  fs.readFile(filePath, (error, content) => {
    if (error) {
      response.writeHead(STATUS_ERROR);
      response.end(NOT_FOUND);
    } else {
      response.writeHead(STATUS_OK, { 'Content-Type': contentType });
      response.end(content, UTF8);
    }
  });
};

http.createServer((request, response) => {
  if (request.url.includes('command-async')) {
    handleAsyncCommandResponse(request, response);
  }
  else if (request.url.includes('command')) {
    handleSyncCommandResponse(request, response);
  }
  else if (path.extname(request.url)) {
    handleStaticResponse(request, response);
  }
  else {
    response.writeHead(STATUS_ERROR);
    response.end(NOT_FOUND);
  }
}).listen(parseInt(port));

console.log(`Server listening on port ${port}`);