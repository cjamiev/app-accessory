const express = require('express');
const path = require('path');
const bodyParser = require('body-parser');
const cors = require('cors');
const fs = require('fs'); 
const getAllFilesInTreeDirectory = require('../utility/file').getAllFilesInTreeDirectory;
const Service = require('./api-service');
const mockServiceFiles = getAllFilesInTreeDirectory('./server/mock-services');

const mockFiles = mockServiceFiles.map(fileName => {
  const file = fs.readFileSync(fileName, 'utf8');
  const cleanLines = file.split('\n').map(line => line.trim().replace(/[^\x20-\x7E]/g, ''));
  const cleanFile = cleanLines.join('');

  return JSON.parse(cleanFile);
});
const mockGets = mockFiles.filter(file => (file.type).toUpperCase()==='GET');
const mockPosts = mockFiles.filter(file => (file.type).toUpperCase()==='POST');

const server = express();
const PUBLIC_DIR = path.resolve(__dirname, '../public');
const ApiService = new Service();
const port = process.env.PORT || 8080;




server
  .use(cors())
  .use(express.static(PUBLIC_DIR))
  .use(bodyParser.json())
  .get('/api', ApiService.getData)
  .post('/api', ApiService.postData)
  .delete('/api', ApiService.deleteData)
  
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