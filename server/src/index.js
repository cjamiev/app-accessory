const express = require('express');
const path = require('path');
const bodyParser = require('body-parser');
const cors = require('cors');

const generatorService = require('./generator-service');
const mockService = require('./mock-service');
const clipboardService = require('./clipboard-service');
const isEqual = require('./objectHelper').isEqual;
const isEmpty = require('./objectHelper').isEmpty;

const server = express();
const PUBLIC_DIR = path.resolve(__dirname, '../public');
const port = process.env.PORT || 8080;


server
  .use(cors())
  .use(express.static(PUBLIC_DIR))
  .use(bodyParser.json())
  .get('/api/get-clipboard', clipboardService.getClipboard)
  .post('/api/create-clipboard', clipboardService.createClipboard)
  .get('/api/generator', generatorService.getGenerator)
  .post('/api/generator', generatorService.generateCustomTemplates)
  .post('/api/create-template', generatorService.createGeneratorTemplate)
  .post('/api/delete-template', generatorService.deleteGeneratorTemplate);
  
mockService.mockGets.forEach(file => {
    server.get(file.url,(req, res) => {
      res.status(200).send(file.response);
    });
  });

mockService.mockPosts.forEach(file => {
    server.post(file.url,(req, res) => {

      const match = file.body.find(entry => isEqual(entry.request,req.body));

      if(!isEmpty(match)){
        res.status(200).send(match.response);
      } else {
        
        res.status(200).send(file.defaultResponse||{message: 'no valid response found found'})
      }
    });
  });

server  
  .listen(port, () => {
    console.info('server is running on http://localhost:' + port);
  });

module.exports = server;