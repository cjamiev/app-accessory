const fs = require('fs');
const getAllFilesInTreeDirectory = require('./file').getAllFilesInTreeDirectory;

const GENERATOR_DIR = '../generator';
const GENERATOR_FILE_EXT = '.hbs';
const HANDLE_BARS_REGEX = /{{.+}}/;

const uniqueElementsOnly = (arr) => {
  return arr.filter((item, pos) => arr.indexOf(item) === pos);
}

const getTemplateVariables = (template) => {
  const reduceToVariablesOnly = template.split('}}').join('\n').match(/{{[a-zA-Z ]+/g).map(item => item.replace('{{','').trim());
  const uniqueVariables = uniqueElementsOnly(reduceToVariablesOnly);

  return uniqueVariables;
}

const getGenerators = () => {
  const allFiles = getAllFilesInTreeDirectory(GENERATOR_DIR);
  const foldersAndFiles = allFiles.map(item => item.split('\\').filter(item => item!=='..'&&item!=='generator'));
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
  const categorizedFoldersAndFiles = getGenerators();

  const foldersAndFilesJSON = categorizedFoldersAndFiles.reduce((total, item)=>{
    if(total[item.category] && total[item.category][item.group]){
      const template = fs.readFileSync(`..\\generator\\${item.category}\\${item.group}\\${item.file}`, 'utf8');
      const templateVariables = getTemplateVariables(template);
      const reducedTemplateVariables = uniqueElementsOnly(templateVariables.concat(total[item.category][item.group].variables));
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

const replaceVariables = (line,variables) => {
  const regexes = Object.keys(variables).map(item => `{{${item}}}`).join('|');  
  const regex = RegExp(regexes,'g');

  const newLine = line.replace(regex, (matched) => {
    const newMatched = matched.replace(/{|}/g,'')
    return mapObj[newMatched];
  });

  return newLine;
}

const getCustomizedFile = (file,variables) => {
  const customizedLines = file.split('\n').map(line => (HANDLE_BARS_REGEX.test(line,variables)) ? replaceVariables(line): line);

  return customizedLines.join('\n');
};

const generateFile = (generatorType, fileType, variables) => {
  if(!generatorType||!fileType||!variables){
    console.log('Arguments Error: variables, file type and generator type is required');
    return;
  }

  try {
    const template = fs.readFileSync(`${GENERATOR_DIR}/${generatorType}/${fileType}${GENERATOR_FILE_EXT}`, 'utf8');
    const customizedFile = getCustomizedFile(template,variables);

    fs.writeFileSync(`${fileName}.js`, customizedFile);
  } catch(err){
    console.log(`code:${err.code} file:${err.path}`);
  }
};

module.exports.generateFile = generateFile;
module.exports.getGeneratorsAsJSON = getGeneratorsAsJSON;