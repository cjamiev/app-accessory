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
    const groups = fileAndVariables.file[1];
    const files = [fileAndVariables.file[2]];
    const variables = fileAndVariables.variables

    return { category, groups, files, variables }
  });

  return categorizedFilesAndVariables;
}

const getMergedFiles = (groups, item) => {
	const mergedGroups = groups.map(group => {
		if(group.type === item.groups){
      const merged = group.files.concat(item.files);
      const mergedVariables = group.variables.concat(item.variables);
			const reducedVariables = getUniqueArray(mergedVariables)
			return { type: item.groups, files: merged, variables: reducedVariables };
		}
			
		return generator;
	});
		
	return { category: item.category, groups: [...mergedGroups ]}; 	
}
		
const getMergedGroups = (generator,item) => {
	const isFound = generator.groups.findIndex(group => group.type === item.groups) !==-1;
	if(isFound){
		return getMergedFiles(generator.groups,item);
	}
				
	return { category: item.category, groups: [...generator.groups,{ type: item.groups, files: item.files, variables: item.variables }]};
}

const getMergedCategory = (total,item) => {
	return total.map(generator => {
		if(generator.category === item.category){
			return getMergedGroups(generator,item);
		}
		return generator;
	});
}		

const getGeneratorsAsJSON = (categorizedFiles) => {
  const generatorsAsJSON = categorizedFiles.reduce((total,item) => {
    const isFound = total.findIndex(generator=> generator.category === item.category) !== -1;
    if(isFound){
      return getMergedCategory(total,item);
    }
    return [...total,{ category: item.category, groups: [{ type: item.groups, files: item.files, variables: item.variables }] }];
  },[]);

  return generatorsAsJSON;
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