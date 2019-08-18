const {
  UTF8,
  STATUS_OK,
  RESPONSE_TYPE_JSON,
  RESPONSE_TYPE_HTML,
  RESPONSE_TYPE_CSS,
  RESPONSE_TYPE_JS
} = require('./constants');

const send = (response, data) => {
  response.writeHead(STATUS_OK, RESPONSE_TYPE_JSON);
  response.end(JSON.stringify(data));
};

const sendHTML = (response, data) => {
  response.writeHead(STATUS_OK, RESPONSE_TYPE_HTML);
  response.end(data, UTF8);
};

const sendCSS = (response, data) => {
  response.writeHead(STATUS_OK, RESPONSE_TYPE_CSS);
  response.end(data, UTF8);
};

const sendJS = (response, data) => {
  response.writeHead(STATUS_OK, RESPONSE_TYPE_JS);
  response.end(data, UTF8);
};

module.exports = {
  send,
  sendHTML,
  sendCSS,
  sendJS
};