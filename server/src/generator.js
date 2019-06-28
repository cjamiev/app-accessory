import { getUniqueArray } from '../global';

const HANDLE_BARS_GLOBAL_REGEX = /{{.+}}/g;
const HANDLE_BARS_REGEX = /{{.+}}/;
const LETTERS_AND_SPACE_REGEX = /{{[a-zA-Z ]+/g; 
const NEW_LINE = '\n';
const FOLDER_SEPARATOR = '\\';

const getTemplateHandlebars = (template) => {
  if(!HANDLE_BARS_GLOBAL_REGEX.test(template)){
    return [];
  }

  const reduceToHandlebarsOnly = template.split('}}')
    .join(NEW_LINE)
    .match(LETTERS_AND_SPACE_REGEX)
    .map(line => line.replace('{{','').trim());
  const uniqueHandlebars = getUniqueArray(reduceToHandlebarsOnly);

  return uniqueHandlebars;
}

const getCategorizedFiles = (templatesAndHandlebars) => {
  const foldersFilesAndHandlebars = templatesAndHandlebars.map(filePathAndHandlebars => {
    const file = filePathAndHandlebars.file.split(FOLDER_SEPARATOR)
      .filter(filePathSegment => filePathSegment !== '..' && filePathSegment !== 'generator');
    const handlebars = filePathAndHandlebars.handlebars;

    return { file, handlebars }
  });

  const categorizedFilesAndHandlebars = foldersFilesAndHandlebars.map(fileAndHandlebars => {
    const category = fileAndHandlebars.file[0];
    const groups = fileAndHandlebars.file[1];
    const files = [fileAndHandlebars.file[2]];
    const handlebars = fileAndHandlebars.handlebars;

    return { category, groups, files, handlebars }
  });

  return categorizedFilesAndHandlebars;
}

const getMergedFiles = (groups, item) => {
	const mergedGroups = groups.map(group => {
		if(group.type === item.groups){
      const merged = group.files.concat(item.files);
      const mergedHandlebars = group.handlebars.concat(item.handlebars);
      const uniqueHandlebars = getUniqueArray(mergedHandlebars);
			return { type: item.groups, files: merged, handlebars: uniqueHandlebars };
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
				
	return { category: item.category, groups: [...generator.groups,{ type: item.groups, files: item.files, handlebars: item.handlebars }]};
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
    return [...total,{ category: item.category, groups: [{ type: item.groups, files: item.files, handlebars: item.handlebars }] }];
  },[]);

  return generatorsAsJSON;
}

const getCustomizedLine = (line,handlebars) => {
  const handleBarsHandlebars = Object.keys(handlebars)
    .map(variable => `{{${variable}}}`)
    .join('|');  
  const handlebarsRegex = RegExp(handleBarsHandlebars,'g');
  
  const customizedLine = line.replace(handlebarsRegex, (matched) => {
    const matchedHandlebarKey = matched.replace(/{|}/g,'');
    
    return handlebars[matchedHandlebarKey];
  });
  
  return customizedLine;
}

const getCustomizedFile = (file,handlebars) => {
  const customizedLines = file.split(NEW_LINE)
    .map(line => (HANDLE_BARS_REGEX.test(line,handlebars)) ? getCustomizedLine(line,handlebars): line);
  const customizedFile = customizedLines.join(NEW_LINE);

  return customizedFile;
};


export {
  getTemplateHandlebars,
  getCategorizedFiles,
  getGeneratorsAsJSON,
  getCustomizedLine,
  getCustomizedFile
};