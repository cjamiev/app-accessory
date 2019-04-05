const getUniqueArray = require('./data-util').getUniqueArray;

const HANDLE_BARS_GLOBAL_REGEX = /{{.+}}/g;
const HANDLE_BARS_REGEX = /{{.+}}/;
const LETTERS_AND_SPACE_REGEX = /{{[a-zA-Z ]+/g; 
const NEW_LINE = '\n';
const FOLDER_SEPARATOR = '\\';

const getTemplateVariables = (template) => {
  if(!HANDLE_BARS_GLOBAL_REGEX.test(template)){
    return [];
  }

  const reduceToVariablesOnly = template.split('}}')
    .join(NEW_LINE)
    .match(LETTERS_AND_SPACE_REGEX)
    .map(line => line.replace('{{','').trim());
  const uniqueVariables = getUniqueArray(reduceToVariablesOnly);

  return uniqueVariables;
}

const getCategorizedFiles = (templatesAndVariables) => {
  const foldersFilesAndVariables = templatesAndVariables.map(filePathAndVariables => {
    const file = filePathAndVariables.file.split(FOLDER_SEPARATOR)
      .filter(filePathSegment => filePathSegment !== '..' && filePathSegment !== 'generator');
    const variables = filePathAndVariables.variables;

    return { file, variables }
  });

  const categorizedFilesAndVariables = foldersFilesAndVariables.map(fileAndVariables => {
    const category = fileAndVariables.file[0];
    const group = fileAndVariables.file[1];
    const file = [fileAndVariables.file[2]];
    const variables = fileAndVariables.variables

    return { category, group, file, variables }
  });

  return categorizedFilesAndVariables;
}

const getGeneratorsAsJSON = (categorizedFiles) => {
  const foldersAndFilesJSON = categorizedFiles.reduce((total, generator)=>{
    if(total[generator.category] && total[generator.category][generator.group]){
      const reducedVariables = getUniqueArray(total[generator.category][generator.group].variables.concat(generator.variables));
      const mergedGroup = total[generator.category][generator.group].file.concat(generator.file);
      const mergedCategory = { [generator.category]: {[generator.group]: {file: mergedGroup, variables: reducedVariables}}};

      return { ...total, ...mergedCategory };      
    }
    if(total[generator.category]){
      const mergedCategory = { [generator.category]: {[generator.group]: {file: generator.file, variables: generator.variables}, ...total[generator.category]}};

      return { ...total, ...mergedCategory };      
    }
    return { ...total, [generator.category]: {[generator.group]: {file: generator.file, variables: generator.variables} }};
  }, {});

  return foldersAndFilesJSON;
}

const getCustomizedLine = (line,variables) => {
  const handleBarsVariables = Object.keys(variables)
    .map(variable => `{{${variable}}}`)
    .join('|');  
  const variablesRegex = RegExp(handleBarsVariables,'g');
  
  const customizedLine = line.replace(variablesRegex, (matched) => {
    const matchedVariableKey = matched.replace(/{|}/g,'');
    
    return variables[matchedVariableKey];
  });
  
  return customizedLine;
}

const getCustomizedFile = (file,variables) => {
  const customizedLines = file.split(NEW_LINE)
    .map(line => (HANDLE_BARS_REGEX.test(line,variables)) ? getCustomizedLine(line,variables): line);
  const customizedFile = customizedLines.join(NEW_LINE);

  return customizedFile;
};

module.exports.getTemplateVariables = getTemplateVariables;
module.exports.getCategorizedFiles = getCategorizedFiles;
module.exports.getGeneratorsAsJSON = getGeneratorsAsJSON;
module.exports.getCustomizedLine = getCustomizedLine;
module.exports.getCustomizedFile = getCustomizedFile;