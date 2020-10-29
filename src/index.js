const child_process = require('child_process');
const http = require('http');
const fs = require('fs');
const path = require('path');
const url = require('url');
const exec = child_process.exec;
const {
  isEqual,
  writeToFile,
  loadFile,
  readDirectory
} = require('./util');
const {
  mockResponses,
  mockConfig
} = require('./mockResponses');

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
const STANDARD_HEADER = { 'Content-Type': 'application/json' };
const NOT_FOUND = 'file not found';
const STATUS_OK = 200;
const STATUS_ERROR = 500;
const mockServerError = { message: 'mock server error has occurred' };

const cors = res => {
  res.setHeader('Access-Control-Allow-Origin', '*');
  res.setHeader('Access-Control-Request-Method', '*');
  res.setHeader('Access-Control-Allow-Methods', 'OPTIONS, GET');
  res.setHeader('Access-Control-Allow-Headers', '*');
};

const COMMAND_STR = 'cd ./scripts && start cmd.exe';
const getCommand = requestUrl => {
  const queryParameters = requestUrl.split('?')[1].split('&');
  const mode = queryParameters[0].split('=')[1];
  const command = queryParameters[1].split('=')[1];
  const args = queryParameters[2].split('=')[1].replace('+', ' ');

  if (mode === 'detach') {
    return `${COMMAND_STR} /c ${command} ${args}`;
  }
  else if (mode === 'block') {
    return `${COMMAND_STR} /k ${command} ${args}`;
  }
  return `cd ./scripts && ${command} ${args}`;
};

const resolvePostBody = async (request) => {
  const promise = new Promise((resolve, reject) => {
    const queryData = [];
    request.on('data', (data) => {
      queryData.push(data);
    });

    request.on('end', () => {
      const result = queryData.length && JSON.parse(queryData.join().toString('utf8'));
      resolve(result);
    });
  });

  const result = await promise;

  return result;
};

const handleWriteResponse = async (request, response) => {
  const payload = await resolvePostBody(request);
  response.writeHead(STATUS_OK, { 'Content-Type': TYPE_JSON });

  const content = payload.content || '';
  const filename = payload.filename || new Date().toString().slice(4, 24).replace(/ /g, '.').replace(/:/g, '.');
  const filepath = payload.filepath || './storage/';

  const data = writeToFile(filepath + filename, content);

  response.end(JSON.stringify({ data }), UTF8);
};

const handleReadResponse = (request, response) => {
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

const handleCommandResponse = (request, response) => {
  exec(getCommand(request.url), { encoding: UTF8 }, (error, stdout, stderr) => {
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

const handleMockResponse = async (request, response) => {
  const matchedResponse = mockResponses.find(entry => entry.url === request.url && entry.method === request.method);

  if (matchedResponse && matchedResponse.conditionalResponse) {
    const payload = await resolvePostBody(request);
    const matchedConditionalResponse = matchedResponse.conditionalResponse.find(item => isEqual(item.payload, payload));
    const responsePayload = matchedConditionalResponse && matchedConditionalResponse.body || matchedResponse.body;

    response.writeHead(matchedResponse.status, matchedResponse.headers);
    response.end(JSON.stringify(responsePayload), UTF8);
  }
  else if (matchedResponse) {
    response.writeHead(matchedResponse.status, matchedResponse.headers);
    response.end(JSON.stringify(matchedResponse.body), UTF8);
  }
  else {
    response.writeHead(STATUS_OK, STANDARD_HEADER);
    response.end(JSON.stringify({ message: 'Not Found' }), UTF8);
  }
};

http.createServer((request, response) => {
  cors(response);
  if (request.url.includes('write')) {
    handleWriteResponse(request, response);
  }
  else if (request.url.includes('read')) {
    handleReadResponse(request, response);
  }
  else if (request.url.includes('command')) {
    handleCommandResponse(request, response);
  }
  else if (path.extname(request.url)) {
    handleStaticResponse(request, response);
  }
  else {
    const { delay, delayUrls } = mockConfig;
    const shouldDelayAllUrls = !delayUrls.length;
    const shouldDelayThisUrl = delayUrls.some(item => item === request.url);

    if (shouldDelayAllUrls || shouldDelayThisUrl) {
      setTimeout(() => { handleMockResponse(request, response); }, delay);
    }
    else {
      handleMockResponse(request, response);
    }
  }
}).listen(parseInt(port));

console.log(`Server listening on port ${port}`);