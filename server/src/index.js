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
import { createClipboard, getClipboard } from './clipboard-service';

const server = express();
const PUBLIC_DIR = path.resolve(__dirname, '../public');
const port = 3001;

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

server.listen(port, () => {
  console.info('server is running on http://localhost:' + port);
});