const express = require('express');
const path = require('path');
const bodyParser = require('body-parser');
const cors = require('cors');
const Service = require('./api-service');
const mockGets = require('./mock-service').mockGets;
const mockPosts = require('./mock-service').mockPosts;

const server = express();
const PUBLIC_DIR = path.resolve(__dirname, '../public');
const ApiService = new Service();
const port = process.env.PORT || 8080;

server
  .use(cors())
  .use(express.static(PUBLIC_DIR))
  .use(bodyParser.json())
  .get('/api/generator', ApiService.getGenerator)
  .post('/api/generator', ApiService.postRunGenerator)
  .post('/api/create-template', ApiService.postCreateTemplate)
  .post('/api/delete-template', ApiService.postDeleteTemplate);
  
mockGets.forEach(file => {
    server.get(file.url,(req, res) => {
      res.status(200).send(file.body);
    });
  });

mockPosts.forEach(file => {
    server.get(file.url,(req, res) => {
      res.status(200).send(file.body);
    });
  });

server  
  .listen(port, () => {
    console.info('server is running on http://localhost:' + port);
  });

module.exports = server;