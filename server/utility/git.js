const exec = require('child_process').exec; 
const execSync = require('child_process').execSync; 

const getListOfModifiedFiles = (file) => {
  const lines = file.split('\n');
  const removeDeletedFiles = lines.filter(line => !/^D/.test(line)); 
  const listOfModifiedFiles = removeDeletedFiles.map(line => line.replace(/^\w+\s+/,''));
  
  return listOfModifiedFiles.join('\n');
};

const copyModifiedFiles = (projectDirectory, branchName) => {
  const cdIntoDirectory = `cd ${projectDirectory}`;
  const indexAllFilesCmd = 'git add -A';
  const unstageAllFilesCmd = 'git reset HEAD';
  const gitModifiedFilesCmd = `git diff --name-status ${branchName}`;
  const allCommands = `${cdIntoDirectory} && ${indexAllFilesCmd} && ${gitModifiedFilesCmd}`;
  
  const result = execSync(allCommands, { encoding: 'utf8' });
  const modifiedFiles = getListOfModifiedFiles(result);
  exec(`${cdIntoDirectory} && ${unstageAllFilesCmd}`);

  return modifiedFiles;
};

module.exports.copyModifiedFiles = copyModifiedFiles;