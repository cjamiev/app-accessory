import express from 'express';
import path from 'path';
import bodyParser from 'body-parser';
import cors from 'cors';

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
const port = process.env.PORT || 8080;

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
  
mockGets.forEach(file => {
    if(file.body){
      file.body.forEach(entry => {

        const parameterizedURL = replaceStringByObjectMapper(file.url, entry.queryParameters);
        server.get(parameterizedURL,(req, res) => {
          res.status(200).send(entry.response);
        });
      });
    }
    else {
      server.get(file.url,(req, res) => {
        res.status(200).send(file.defaultResponse);
      });
    }
  });

mockPosts.forEach(file => {
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