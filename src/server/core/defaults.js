const {
  NOT_FOUND,
  STATUS_OK,
  RESPONSE_TYPE_JSON
} = require('./constants');

const DEFAULT_CALLBACK = (portnumber) => {
  console.log(`Server running at http://127.0.0.1:${portnumber}/`);
};

const DEFAULT_ERROR_ROUTE = (req, res) => {
  res.writeHead(NOT_FOUND, RESPONSE_TYPE_JSON);
  res.end(JSON.stringify({ message: `request is invalid with method:${req.method} and url:${req.url}` }));
};

const DEFAULT_METHOD_OPTIONS_RESPONSE = (req, res) => {
  res.writeHead(STATUS_OK, RESPONSE_TYPE_JSON);
  res.end();
};

module.exports = {
  DEFAULT_CALLBACK,
  DEFAULT_ERROR_ROUTE,
  DEFAULT_METHOD_OPTIONS_RESPONSE
};