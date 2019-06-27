import fs from 'fs';
import { getAllFilesInTreeDirectory } from './file';

const searchFile = (fileName, pattern) => {
  const file = fs.readFileSync(fileName, 'utf8');
  const lines = file.split('\n');
  
  const matchedLines = lines.filter(line => pattern.test(line));
  const matchedLinesAndLocation = matchedLines.map(item => {
    const index = lines.indexOf(item);
    const line = lines[index];
    return { lineNumber:index+1, line};
  });

  return matchedLinesAndLocation;
}

const searchDirectory = (directory, pattern) => {
  const allFiles = getAllFilesInTreeDirectory(directory);

  const regexTestOnAllFiles = allFiles.map(file => {
    const matchedLines = searchFile(file,pattern);
    return { fileName: file, matchedLines }
  });
  const nonEmptyLineMatchesForAllFiles = regexTestOnAllFiles.filter(item => item.matchedLines.length !==0);

  return nonEmptyLineMatchesForAllFiles;
}

module.exports.searchFile = searchFile;
module.exports.searchDirectory = searchDirectory;