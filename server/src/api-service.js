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
}

module.exports = ApiService;
