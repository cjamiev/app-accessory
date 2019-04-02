const fs = require('fs');
const getAllFilesInTreeDirectory = require('./file').getAllFilesInTreeDirectory;

const GENERATOR_DIR = '../generator';
const GENERATOR_FILE_EXT = '.hbs';
const HANDLE_BARS_REGEX = /{{.+}}/;

const getGeneratorsAsJSON = () => {
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
  const foldersAndFilesJSON = categorizedFoldersAndFiles.reduce((total, item)=>{
    if(total[item.category] && total[item.category][item.group]){
      const mergedGroup = total[item.category][item.group].concat(item.file);
      const mergedCategory = { [item.category]: {[item.group]: mergedGroup}};
      return {...total, ...mergedCategory};      
    }
    if(total[item.category]){
      const mergedCategory = { [item.category]: {[item.group]: item.file, ...total[item.category]}}
      return {...total, ...mergedCategory};      
    }
    return {...total, [item.category]: {[item.group]: item.file}};
  }, {});

  return foldersAndFilesJSON;
}

const getCustomizedFile = (file,fileName) => {
  const lines = file.split('\n');
  const customizedLines = lines
    .map(line => (HANDLE_BARS_REGEX.test(line)) ? line.replace(HANDLE_BARS_REGEX, fileName) : line);

  return customizedLines.join('\n');
};

const generateFile = (generatorType, fileType, fileName) => {
  if(!generatorType||!fileType||!fileName){
    console.log('Arguments Error: file name, file type and generator type is required');
    return;
  }

  try {
    const template = fs.readFileSync(`${GENERATOR_DIR}/${generatorType}/${fileType}${GENERATOR_FILE_EXT}`, 'utf8');
    const customizedFile = getCustomizedFile(template,fileName);

    fs.writeFileSync(`${fileName}.js`, customizedFile);
  } catch(err){
    console.log(`code:${err.code} file:${err.path}`);
  }
};

module.exports.generateFile = generateFile;
module.exports.getGeneratorsAsJSON = getGeneratorsAsJSON;