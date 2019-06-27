import express from 'express';
import path from 'path';
import bodyParser from 'body-parser';
import cors from 'cors';
import fs from 'fs';

import {  
  getGenerator,
  generateCustomTemplates,
  createGeneratorTemplate,
  deleteGeneratorTemplate
} from './generator-service';
import { mockGets, mockPosts } from './mock-service';
import { createClipboard, getClipboard } from './clipboard-service';
import { isEqual, isEmpty, replaceStringByObjectMapper } from '../global';

const server = express();
const PUBLIC_DIR = path.resolve(__dirname, '../public');
const serverConfigPath = `storage\\serverConfig.json`;
const mockServerError = { message: 'mock server error has occurred' };
const noValidMockPostResponseFound = { message: 'no valid response found found' };
const serviceConfig = JSON.parse(fs.readFileSync(serverConfigPath,'utf8'));
const port = serviceConfig.port || 8080;

server
  .use(cors())
  .use(express.static(PUBLIC_DIR))
  .use(bodyParser.json())
  .get('/api/get-clipboard', getClipboard)
  .post('/api/create-clipboard', createClipboard)
  .get('/api/generator', getGenerator)
  .post('/api/generator', generateCustomTemplates)
  .post('/api/create-template', createGeneratorTemplate)
  .post('/api/delete-template', deleteGeneratorTemplate);
  
const mockGetHandler = response => {
  return (req, res) => {
    const { mockError } = JSON.parse(fs.readFileSync(serverConfigPath,'utf8'));
    if(mockError){
      res.status(500).send(mockServerError);
    } else {
      res.status(200).send(response);
    }
  };
};

mockGets.forEach(({url, defaultResponse, body}) => {
  if(body){
    body.forEach(({queryParameters, response }) => {
      const parameterizedURL = replaceStringByObjectMapper(url, queryParameters);
      server.get(parameterizedURL,mockGetHandler(response));
    });
  }
  else {
    server.get(url,mockGetHandler(defaultResponse));
  }
});

mockPosts.forEach(({url, defaultResponse, body}) => {
  server.post(url,(req, res) => {
    const { mockError } = JSON.parse(fs.readFileSync(serverConfigPath,'utf8'));
    if(mockError){
      res.status(500).send(mockServerError);
    } 
    else {
      const match = body.find(entry => isEqual(entry.request,req.body));

      if(!isEmpty(match)){
        res.status(200).send(match.response);
      } else {
        res.status(200).send(defaultResponse|| noValidMockPostResponseFound);
      }
    }
  });
});

server.listen(port, () => {
  console.info('server is running on http://localhost:' + port);
});