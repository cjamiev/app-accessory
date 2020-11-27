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
  createMockFile,
  updateMockFile,
  removeMockRequestsEntry,
  loadMockRequests,
  loadMockResponse,
  getMatchedMockResponse,
  loadConfiguration,
  updateConfiguration,
  loadLog,
  logEntry,
  clearLog
} = require('./mockserver-util');

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
const mockServerError = { message: 'mock server error has occurred' };
const NOT_FOUND = 'file not found';
const STATUS_OK = 200;
const STATUS_ERROR = 500;
const IO_DIRECTORY = './storage/io';
const CLIPBOARD_DIRECTORY = './storage/clipboard';
const CALENDER_DIRECTORY = './storage/calender';
const METHOD_POST = 'POST';

const cors = res => {
  res.setHeader('Access-Control-Allow-Origin', '*');
  res.setHeader('Access-Control-Request-Method', '*');
  res.setHeader('Access-Control-Allow-Methods', 'OPTIONS, GET');
  res.setHeader('Access-Control-Allow-Headers', '*');
};

const COMMAND_STR = 'cd ./storage/scripts && start cmd.exe';
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
  return `cd ./storage/scripts && ${command} ${args}`;
};

const resolvePostBody = async (request) => {
  const promise = new Promise((resolve, reject) => {
    const queryData = [];
    request.on('data', (data) => {
      queryData.push(data);
    });

    request.on('end', () => {
      try {
      const result = queryData.length && JSON.parse(queryData.join().toString('utf8'));
      resolve(result);
      } catch (e) {
        resolve(e);
      }
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
  const filepath = payload.filepath || IO_DIRECTORY + '/';

  const data = writeToFile(filepath + filename, content);

  response.end(JSON.stringify({ data }), UTF8);
};

const handleReadResponse = (request, response) => {
  response.writeHead(STATUS_OK, { 'Content-Type': TYPE_JSON });

  const queryParams = url.parse(request.url, true).query;

  if (queryParams.read === 'true') {
    const data = loadFile(IO_DIRECTORY + '/' + queryParams.name + '.' + queryParams.ext);
    response.end(JSON.stringify({ data }), UTF8);
  }
  else {
    const data = readDirectory(IO_DIRECTORY);
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

const handleClipboardResponse = (request, response) => {
  response.writeHead(STATUS_OK, { 'Content-Type': TYPE_JSON });

  const directories = readDirectory(CLIPBOARD_DIRECTORY);
  const data = [];
  directories.forEach(filename => {
    data.push(loadFile(CLIPBOARD_DIRECTORY + '/' + filename));
  });

  response.end(JSON.stringify({ data }), UTF8);
};

const handleCalenderResponse = async (request, response) => {
  response.writeHead(STATUS_OK, { 'Content-Type': TYPE_JSON });

  if (request.method === METHOD_POST) {
    const payload = await resolvePostBody(request);
    const content = payload.content || '';
    const filename = payload.filename;
    const data = writeToFile(CALENDER_DIRECTORY + '/' + filename, JSON.stringify(content));

    response.end(JSON.stringify({ data }), UTF8);
  } else {
    const filename = request.url.split('/calender-data/')[1];
    const data = loadFile(CALENDER_DIRECTORY + '/' + filename);
    response.end(JSON.stringify({ data }), UTF8);
  }
};

const handleMockServerResponse = async (request, response) => {
  if (request.url.includes('config') && request.method === METHOD_POST) {
    const payload = await resolvePostBody(request);
    const message = updateConfiguration(payload);
    response.writeHead(STATUS_OK, { 'Content-Type': TYPE_JSON });
    response.end(JSON.stringify(message), UTF8);
  }
  else if (request.url.includes('config')) {
    const data = loadConfiguration();
    response.writeHead(STATUS_OK, { 'Content-Type': TYPE_JSON });
    response.end(JSON.stringify({ data }), UTF8);
  }
  else if (request.url.includes('mockRequests')) {
    const data = loadMockRequests();
    response.writeHead(STATUS_OK, { 'Content-Type': TYPE_JSON });
    response.end(JSON.stringify({ data }), UTF8);
  }
  else if (request.url.includes('loadMockResponse')) {
    const payload = await resolvePostBody(request);
    const data = loadMockResponse(payload.responsePath);
    response.writeHead(STATUS_OK, { 'Content-Type': TYPE_JSON });
    response.end(JSON.stringify({ data }), UTF8);
  }
  else if (request.url.includes('deleteMockEndpoint')) {
    const payload = await resolvePostBody(request);
    const message = removeMockRequestsEntry(payload);

    response.writeHead(STATUS_OK, { 'Content-Type': TYPE_JSON });
    response.end(JSON.stringify(message), UTF8);
  }
  else if (request.url.includes('createMockEndpoint')) {
    const payload = await resolvePostBody(request);
    const message = createMockFile(payload);

    response.writeHead(STATUS_OK, { 'Content-Type': TYPE_JSON });
    response.end(JSON.stringify(message), UTF8);
  }
  else if (request.url.includes('updateMockEndpoint')) {
    const payload = await resolvePostBody(request);
    const message = updateMockFile(payload);

    response.writeHead(STATUS_OK, { 'Content-Type': TYPE_JSON });
    response.end(JSON.stringify(message), UTF8);
  }
  else if (request.url.includes('clearLog')) {
    const message = clearLog();

    response.writeHead(STATUS_OK, { 'Content-Type': TYPE_JSON });
    response.end(JSON.stringify(message), UTF8);
  }
  else if (request.url.includes('loadLog')) {
    const data = loadLog();

    response.writeHead(STATUS_OK, { 'Content-Type': TYPE_JSON });
    response.end(JSON.stringify({ data }), UTF8);
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

const handleMockResponse = async ({ payload, reqUrl, method }, response) => {
  const matchedResponse = getMatchedMockResponse(reqUrl, method);

  if (matchedResponse && matchedResponse.conditionalResponse) {
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

const handleDefaultResponse = async (request, response) => {
  const { delay, delayUrls, error, log, overrideUrls, overrideStatusCode, overrideResponse } = loadConfiguration();
  const shouldDelayAllUrls = !delayUrls.length;
  const shouldDelayThisUrl = delayUrls.some(item => item === request.url);
  const matchedUrl = overrideUrls.some(endpoint => endpoint === request.url);

  const payload = request.method === METHOD_POST ? await resolvePostBody(request) : {};

  if (log) {
    logEntry(request.url, payload);
  }
  if (error) {
    response.writeHead(STATUS_ERROR, STANDARD_HEADER);
    response.end(JSON.stringify(mockServerError), UTF8);
  }
  else if (matchedUrl) {
    response.writeHead(overrideStatusCode, STANDARD_HEADER);
    response.end(JSON.stringify(overrideResponse), UTF8);
  }
  else if (shouldDelayAllUrls || shouldDelayThisUrl) {
    setTimeout(() => { handleMockResponse({ payload, reqUrl: request.url, method: request.method }, response); }, delay);
  }
  else {
    handleMockResponse({ payload, reqUrl: request.url, method: request.method }, response);
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
  else if (request.url.includes('clipboard-config')) {
    handleClipboardResponse(request, response);
  }
  else if (request.url.includes('calender-data')) {
    handleCalenderResponse(request, response);
  }
  else if (request.url.includes('api/mockserver')) {
    handleMockServerResponse(request, response);
  }
  else if (path.extname(request.url)) {
    handleStaticResponse(request, response);
  }
  else {
    handleDefaultResponse(request, response);
  }
}).listen(parseInt(port));

console.log(`Server listening on port ${port}`);