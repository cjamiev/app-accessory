const { DEFAULT_ERROR_ROUTE, DEFAULT_METHOD_OPTIONS_RESPONSE } = require('./defaults');
const { flatten } = require('../utility/array-operations');

const METHOD_GET = 'GET';
const METHOD_POST = 'POST';
const METHOD_OPTIONS = 'OPTIONS';
const DELAY = 250;

const loadRoutes = (routes) => {
  const routesWithMethodGet = flatten(routes.map(route => route.loadGetRoutes()));
  const routesWithMethodPost = flatten(routes.map(route => route.loadPostRoutes()));

  return { routesWithMethodGet, routesWithMethodPost };
};

const handleError = (errorRoute, request, response) => {
  setTimeout(() => {
    if (!response._headerSent) {
      errorRoute(request, response);
    }
  }, DELAY);
};

const services = (routes, config) => {
  const { routesWithMethodGet, routesWithMethodPost } = loadRoutes(routes);
  const cors = config.find(item => item.isCorsOn);
  const overrideDefaultError = config.find(item => item.overrideDefaultError);
  const errorRoute = overrideDefaultError ? overrideDefaultError.route : DEFAULT_ERROR_ROUTE;

  return (request, response) => {
    if (cors.isCorsOn) {
      cors.runCors(response);
    }

    if (request.method === METHOD_GET) {
      routesWithMethodGet.forEach(route => route(request, response));
    } else if (request.method === METHOD_POST) {
      routesWithMethodPost.forEach(route => route(request, response));
    } else if (request.method === METHOD_OPTIONS) {
      DEFAULT_METHOD_OPTIONS_RESPONSE(request, response);
    }

    handleError(errorRoute, request, response);
  };
};

module.exports = { services };