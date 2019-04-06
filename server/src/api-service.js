const fs = require('fs');
const getAllFilesInTreeDirectory = require('../utility/file').getAllFilesInTreeDirectory;
const getTemplateVariables = require('../utility/generator').getTemplateVariables;
const getCategorizedFiles = require('../utility/generator').getCategorizedFiles;
const getGeneratorsAsJSON = require('../utility/generator').getGeneratorsAsJSON;
const getCustomizedFile = require('../utility/generator').getCustomizedFile;

class ApiService {
  constructor() {
    this.getGenerator = this.getGenerator.bind(this);
    this.postRunGenerator = this.postRunGenerator.bind(this);
    this.postCreateTemplate = this.postCreateTemplate.bind(this);
    this.postDeleteTemplate = this.postDeleteTemplate.bind(this);
  }

  static shouldSendServerError() {
    return Math.random() > 1;
  }

  getGenerator(req, res){
    if (ApiService.shouldSendServerError()) {
      res.status(500).send({ message: 'Oops, a server error occurred' });
      return;
    }

    const files = getAllFilesInTreeDirectory('server/generator');
    const templatesAndVariables = files.map(file => {
      const template = fs.readFileSync(file,'utf8');
      const fileRebased = file.replace('server\\','');
      const variables = getTemplateVariables(template);
      
      return { file:fileRebased, variables }
    });
    
    const categorizedFiles = getCategorizedFiles(templatesAndVariables);
    const generators = getGeneratorsAsJSON(categorizedFiles);

    res.status(200).send(generators||{ message:'cannot load generators' });
  }

  postRunGenerator(req, res) {
    if (ApiService.shouldSendServerError()) {
      res.status(500).send(this.serverErrorMessage);
      return;
    }

    const { body } = req;
    if (!body.files) {
      res.status(400).send({ message:'missing files parameter' });
      return;
    }
    if (!body.variables) {
      res.status(400).send({ message:'missing variables parameter' });
      return;
    }

    const templates = body.files.map(file => fs.readFileSync(`server\\generator\\${file}`,'utf8'));
    const customizedFiles = templates.map(template => getCustomizedFile(template,body.variables));

    res.status(200).send(customizedFiles||{ message:'cannot find generators' });
  }

  postCreateTemplate(req, res) {
    if (ApiService.shouldSendServerError()) {
      res.status(500).send(this.serverErrorMessage);
      return;
    }

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
  }

  postDeleteTemplate(req, res) {
    if (ApiService.shouldSendServerError()) {
      res.status(500).send(this.serverErrorMessage);
      return;
    }

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
  }
}

module.exports = ApiService;
