import fs from 'fs';

import { getAllFilesInTreeDirectory } from '../global';

import {
  getTemplateHandlebars,
  getCategorizedFiles,
  getGeneratorsAsJSON,
  getCustomizedFile
} from './generator';

const getGenerator = (req, res) => {
  const files = getAllFilesInTreeDirectory('storage/generator');
  const templatesAndHandlebars = files.map(file => {
    const template = fs.readFileSync(file,'utf8');
    const fileRebased = file.replace('storage\\','');
    const handlebars = getTemplateHandlebars(template);
    
    return { file:fileRebased, handlebars }
  });
  
  const categorizedFiles = getCategorizedFiles(templatesAndHandlebars);
  const generators = getGeneratorsAsJSON(categorizedFiles);

  res.status(200).send(generators||{ message:'cannot load generators' });
};

const generateCustomTemplates = (req, res) => {
  const { body } = req;
  if (!body.files) {
    res.status(400).send({ message:'missing files parameter' });
    return;
  }
  if (!body.handlebars) {
    res.status(400).send({ message:'missing handlebars parameter' });
    return;
  }

  const templates = body.files.map(file => fs.readFileSync(`storage\\generator\\${file}`,'utf8'));
  const customizedFiles = templates.map(template => getCustomizedFile(template,body.handlebars));

  res.status(200).send(customizedFiles||{ message:'cannot find generators' });
};

const createGeneratorTemplate = (req, res) => {
  const { body } = req;
  if (!body.file) {
    res.status(400).send({ message:'missing file parameter' });
    return;
  }
  if (!body.content) {
    res.status(400).send({ message:'missing content parameter' });
    return;
  }

  const segments = body.file.split('\\');
  if(segments.length !== 3){
    res.status(400).send({ message:'file format is not correct' });
    return;
  }
  if (!fs.existsSync(`storage\\generator\\${segments[0]}`)) {
    fs.mkdirSync(`storage\\generator\\${segments[0]}`);
  }
  if (!fs.existsSync(`storage\\generator\\${segments[0]}\\${segments[1]}`)) {
    fs.mkdirSync(`storage\\generator\\${segments[0]}\\${segments[1]}`);
  }

  fs.writeFile(`storage\\generator\\${body.file}`,body.content, err => {
    if(err){
      res.status(200).send({ message:`error in creating file: ${err}` });
    } else {
      res.status(200).send({ message:'successfully created file' });
    }
  });
};

const deleteGeneratorTemplate = (req, res) => {
  const { body } = req;
  if (!body.file) {
    res.status(400).send({ message:'missing file parameter' });
    return;
  }
  const segments = body.file.split('\\');
  if(segments.length !== 3){
    res.status(400).send({ message:'file format is not correct' });
    return;
  }

  fs.unlink(`storage\\generator\\${body.file}`, err => {
    if(err){
      res.status(200).send({ message:`error in deleting file: ${err}` });
    } else {
      res.status(200).send({ message:'successfully deleted file' });
    }
  });
};

export {
  getGenerator,
  generateCustomTemplates,
  createGeneratorTemplate,
  deleteGeneratorTemplate
};
