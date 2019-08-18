const http = require('http');
const { services } = require('./services');
const { cors } = require('./cors');
const { DEFAULT_CALLBACK } = require('./defaults');

const DEFAULT_PORT = '8080';

const serverFactory = () => {
  const routes = [];
  const config = [];
  const server = {
    addCors() {
      config.push({
        isCorsOn: true,
        runCors: cors
      });

      return this;
    },
    addRouteError(errorRoute) {
      config.push({
        overrideDefaultError: true,
        errorRoute
      });

      return this;
    },
    addRoute(route) {
      routes.push(route);

      return this;
    },
    start(port = DEFAULT_PORT, callback) {
      const myserver = services(routes, config);

      http.createServer(myserver).listen(port);

      if (callback) {
        callback();
      } else {
        DEFAULT_CALLBACK(port);
      }
    }
  };

  return server;
};

module.exports = { serverFactory };