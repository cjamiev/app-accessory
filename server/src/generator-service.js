const fs = require('fs');
const getAllFilesInTreeDirectory = require('../utility/file').getAllFilesInTreeDirectory;
const getTemplateHandlebars = require('../utility/generator').getTemplateHandlebars;
const getCategorizedFiles = require('../utility/generator').getCategorizedFiles;
const getGeneratorsAsJSON = require('../utility/generator').getGeneratorsAsJSON;
const getCustomizedFile = require('../utility/generator').getCustomizedFile;

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
  if (!fs.existsSync(`server\\generator\\${segments[0]}`)) {
    fs.mkdirSync(`server\\generator\\${segments[0]}`);
  }
  if (!fs.existsSync(`server\\generator\\${segments[0]}\\${segments[1]}`)) {
    fs.mkdirSync(`server\\generator\\${segments[0]}\\${segments[1]}`);
  }

  fs.writeFile(`server\\generator\\${body.file}`,body.content, err => {
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

  fs.unlink(`server\\generator\\${body.file}`, err => {
    if(err){
      res.status(200).send({ message:`error in deleting file: ${err}` });
    } else {
      res.status(200).send({ message:'successfully deleted file' });
    }
  });
};

module.exports = {
  getGenerator,
  generateCustomTemplates,
  createGeneratorTemplate,
  deleteGeneratorTemplate
};
