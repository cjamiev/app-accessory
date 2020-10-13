const child_process = require('child_process');
const http = require('http');
const fs = require('fs');
const path = require('path');
const url = require('url');
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
const METHOD_POST = 'POST';

const cors = res => {
  res.setHeader('Access-Control-Allow-Origin', '*');
  res.setHeader('Access-Control-Request-Method', '*');
  res.setHeader('Access-Control-Allow-Methods', 'OPTIONS, GET');
  res.setHeader('Access-Control-Allow-Headers', '*');
};

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

const writeToFile = (filepath, content) => {
  try {
    fs.writeFileSync(filepath, content);
    return {
      error: false,
      message: 'Wrote to file:' + filepath
    };
  } catch (e) {
    return {
      error: true,
      message: e
    };
  }
};

const loadFile = (filepath) => {
  return fs.existsSync(filepath) ? fs.readFileSync(filepath, UTF8) : null;
};

const readDirectory = dir => fs.readdirSync(dir);

const resolvePostBody = async (request) => {
  const promise = new Promise((resolve, reject) => {
    const queryData = [];
    request.on('data', (data) => {
      queryData.push(data);
    });

    request.on('end', () => {
      resolve(JSON.parse(queryData.join().toString('utf8')));
    });
  });

  const result = await promise;

  return result;
};

const handlePostResponse = async (request, response) => {
  const payload = await resolvePostBody(request);
  response.writeHead(STATUS_OK, { 'Content-Type': TYPE_JSON });

  const content = payload.content || '';
  const filename = payload.filename || 'no-name-' + new Date().toString().slice(4, 24).replace(/ /g, '.').replace(/:/g, '.');
  const filepath = payload.filepath || './storage/';

  const data = writeToFile(filepath + filename, content);

  response.end(JSON.stringify({ data }), UTF8);
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

const handleResponse = (request, response) => {
  response.writeHead(STATUS_OK, { 'Content-Type': TYPE_JSON });

  const queryParams = url.parse(request.url, true).query;

  if (queryParams.read === 'true') {
    const data = loadFile('./storage/' + queryParams.name + '.' + queryParams.ext);
    response.end(JSON.stringify({ data }), UTF8);
  }
  else {
    const data = readDirectory('./storage');
    response.end(JSON.stringify({ data }), UTF8);
  }
};

http.createServer((request, response) => {
  cors(response);
  if (request.method === METHOD_POST) {
    handlePostResponse(request, response);
  }
  else if (request.url.includes('command-async')) {
    handleAsyncCommandResponse(request, response);
  }
  else if (request.url.includes('command')) {
    handleSyncCommandResponse(request, response);
  }
  else if (path.extname(request.url)) {
    handleStaticResponse(request, response);
  }
  else {
    handleResponse(request, response);
  }
}).listen(parseInt(port));

console.log(`Server listening on port ${port}`);