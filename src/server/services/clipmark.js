const execSync = require('child_process').execSync;
const { loadJSONFromFile } = require('../utility/read');
const { writeToFile } = require('../utility/write');

const CLIPBOARD_PATH = './storage/clipboard.json';
const URL_PATH = './storage/url.json';
const COMMAND_PATH = './storage/command.json';
const UTF8 = 'utf8';
const filepathMap = {
  'Clipboard': CLIPBOARD_PATH,
  'Url': URL_PATH,
  'Command': COMMAND_PATH
};

const executeCommand = (command) => {
  try {
    const message = execSync(command, { encoding: UTF8 });
    return {
      error: false,
      message
    };
  } catch (ex) {
    return {
      error: true,
      status: ex.status,
      message: ex.message
    };
  }
};

const loadClipmarkByType = (filepath) => loadJSONFromFile(filepath, []);

const loadClipmarkEntries = () => {
  const clipboards = loadClipmarkByType(CLIPBOARD_PATH);
  const urls = loadClipmarkByType(URL_PATH);
  const commands = loadClipmarkByType(COMMAND_PATH);

  return {
    clipboards,
    urls,
    commands
  };
};

const addClipmarkEntry = (content) => {
  const filepath = filepathMap[content.type];
  current = loadClipmarkByType(filepath);

  const matched = current.find(item => item.name === content.name);

  if (matched) {
    return {
      error: true,
      message: 'duplicate name'
    };
  }
  else {
    const updated = current.concat([content]);

    return writeToFile(filepath, JSON.stringify(updated));
  }
};

const deleteClipmarkEntry = (content) => {
  const filepath = filepathMap[content.type];
  const currentClipmark = loadClipmarkByType(filepath);

  const updatedClipmark = currentClipmark.filter(item => item.name !== content.name);

  return writeToFile(filepath, JSON.stringify(updatedClipmark));
};

module.exports = {
  addClipmarkEntry,
  deleteClipmarkEntry,
  loadClipmarkEntries,
  executeCommand
};