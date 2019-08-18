const { serverFactory } = require('./core/server');
const { addStaticRoutes } = require('./core/staticRouter');
const { clipmarkRouter } = require('./routers/clipmarkRouter');
const { testRouter } = require('./routers/testRouter');

const server = serverFactory();

const port = 8081;

server
  .addCors()
  .addRoute(addStaticRoutes('./src/client/'))
  .addRoute(clipmarkRouter)
  .addRoute(testRouter);

server.start(port);