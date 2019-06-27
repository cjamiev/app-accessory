import { exec } from 'child_process'; 
import { execSync } from 'child_process';
 
const DAYS_IN_SECONDS = 1000 * 60 * 60 * 24;

const getListOfModifiedFiles = (file) => {
  const lines = file.split('\n');
  const removeDeletedFiles = lines.filter(line => !/^D/.test(line)); 
  const listOfModifiedFiles = removeDeletedFiles.map(line => line.replace(/^\w+\s+/,''));
  
  return listOfModifiedFiles.join('\n');
};

const shouldIgnoreBranch = (branch, branchesToIgnore) => {
  const matched = branchesToIgnore.filter(branchToIgnore => branch.includes(branchToIgnore));

  return matched.length !== 0;
}

const isMoreThanSpecifiedDays = (givenDate,numberOfDays) => {
  const now = (new Date()).getTime();
  const compareDate = (new Date(givenDate)).getTime();
  const diffInDays = (now - compareDate) / DAYS_IN_SECONDS;

  return Number(diffInDays) > numberOfDays;
}

const createPruningScript = (branches, branchesToIgnore, numberOfDays) => {
  const staleBranches = branches.filter(branch => !shouldIgnoreBranch(branch, branchesToIgnore) && isMoreThanSpecifiedDays(branch.slice(0,10),numberOfDays));
  const staleBranchesFile = staleBranches.join('\n');
  const pruneScript = staleBranches.map(line => `git push origin --delete ${line.slice(18)} \n`);
  const pruneScriptFile = pruneScript.join('\n');

  return { staleBranchesFile, pruneScriptFile };
}

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

const pruneStaleBranches = (branchName, branchesToIgnore, numberOfDays) => {
  const gitRetrieveBranchesCommand = `git for-each-ref --merged ${branchName} --sort=committerdate refs/remotes/ --format="%(committerdate:short) %(refname:short)"`;

  const result = execSync(gitRetrieveBranchesCommand, { encoding: 'utf8' });
  const branchesSortedByDate = result.split('\n').sort();
  const { staleBranchesFile, pruneScriptFile } = createPruningScript(branchesSortedByDate, branchesToIgnore, numberOfDays);

  return { staleBranchesFile, pruneScriptFile };
}

module.exports.copyModifiedFiles = copyModifiedFiles;
module.exports.pruneStaleBranches = pruneStaleBranches;