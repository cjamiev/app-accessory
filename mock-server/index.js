import express from 'express';
import bodyParser from 'body-parser';
import cors from 'cors';

import { mockGets, mockPosts } from './mock-service';
import { isEqual, isEmpty, replaceStringByObjectMapper } from '../my_modules';
import { getConfiguration } from './config';

const server = express();
const mockServerError = { message: 'mock server error has occurred' };
const noValidMockPostResponseFound = { message: 'no valid response found found' };
const { port }  = getConfiguration();

server
  .use(cors())
  .use(bodyParser.json());
  
const mockGetHandler = response => {
  return (req, res) => {
    const { error } = getConfiguration();
    if(error){
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
    const { error } = getConfiguration();
    if(error){
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
  console.info('mock server is running on http://localhost:' + port);
});