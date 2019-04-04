const fs = require('fs');
const getAllFilesInTreeDirectory = require('./file').getAllFilesInTreeDirectory;
const getUniqueArray = require('./data-util').getUniqueArray;

const GENERATOR_DIR = '../generator';
const HANDLE_BARS_GLOBAL_REGEX = /{{.+}}/g;
const HANDLE_BARS_REGEX = /{{.+}}/;

const getTemplateVariables = (template) => {
  if(!HANDLE_BARS_GLOBAL_REGEX.test(template)){
    return [];
  }

  const reduceToVariablesOnly = template.split('}}').join('\n').match(/{{[a-zA-Z ]+/g).map(item => item.replace('{{','').trim());
  const uniqueVariables = getUniqueArray(reduceToVariablesOnly);

  return uniqueVariables;
}

const getGenerators = (files) => {
  const foldersAndFiles = files.map(item => item.split('\\').filter(item => item !== '..' && item !== 'generator'));
  const categorizedFoldersAndFiles = foldersAndFiles.map(item => {
    const category = item[0];
    const group = item[1];
    const file = [item[2]];
    return { 
      category, group, file
    }
  });

  return categorizedFoldersAndFiles;
}

const getGeneratorsAsJSON = () => {
  const files = getAllFilesInTreeDirectory(GENERATOR_DIR);
  const categorizedFoldersAndFiles = getGenerators(files);

  const foldersAndFilesJSON = categorizedFoldersAndFiles.reduce((total, item)=>{
    if(total[item.category] && total[item.category][item.group]){
      const template = fs.readFileSync(`..\\generator\\${item.category}\\${item.group}\\${item.file}`, 'utf8');
      const templateVariables = getTemplateVariables(template);
      const reducedTemplateVariables = getUniqueArray(templateVariables.concat(total[item.category][item.group].variables));
      const mergedGroup = total[item.category][item.group].file.concat(item.file);
      const mergedCategory = { [item.category]: {[item.group]: {file: mergedGroup, variables: reducedTemplateVariables}}};
      return {...total, ...mergedCategory};      
    }
    if(total[item.category]){
      const template = fs.readFileSync(`..\\generator\\${item.category}\\${item.group}\\${item.file}`, 'utf8');
      const templateVariables = getTemplateVariables(template);
      const mergedCategory = { [item.category]: {[item.group]: {file: item.file, variables: templateVariables}, ...total[item.category]}};
      return {...total, ...mergedCategory};      
    }
    const template = fs.readFileSync(`..\\generator\\${item.category}\\${item.group}\\${item.file}`, 'utf8');
    const templateVariables = getTemplateVariables(template);
    return {...total, [item.category]: {[item.group]: {file: item.file, variables: templateVariables} }};
  }, {});

  return foldersAndFilesJSON;
}

const getCustomizedLine = (line,variables) => {
  const handleBarsVariables = Object.keys(variables).map(item => `{{${item}}}`).join('|');  
  const variablesRegex = RegExp(handleBarsVariables,'g');
  
  const customizedLine = line.replace(variablesRegex, (matched) => {
    const matchedVariableKey = matched.replace(/{|}/g,'');
    return variables[matchedVariableKey];
  });
  
    return customizedLine;
}

const getCustomizedFile = (file,variables) => {
  const customizedLines = file.split('\n').map(line => (HANDLE_BARS_REGEX.test(line,variables)) ? getCustomizedLine(line,variables): line);

  return customizedLines.join('\n');
};

const generateFile = (file, variables) => {
  if(!file||!variables){
    console.log('Arguments Error: file and variables are required');
    return;
  }

  const template = fs.readFileSync(`..\\generator\\${file}`, 'utf8');
  const customizedFile = getCustomizedFile(template,variables);

  return customizedFile;
};

module.exports.getTemplateVariables = getTemplateVariables;
module.exports.getGenerators = getGenerators;
module.exports.getGeneratorsAsJSON = getGeneratorsAsJSON;
module.exports.getCustomizedLine = getCustomizedLine;
module.exports.getCustomizedFile = getCustomizedFile;
module.exports.generateFile = generateFile;