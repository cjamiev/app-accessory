const execSync = require('child_process').execSync;
const { loadJSONFromFile } = require('../utility/read');
const { writeToFile } = require('../utility/write');

const CLIPBOARD_PATH = './storage/clipboard.json';
const UTF8 = 'utf8';

const executeCommand = (command) => {
  try {
    return execSync(command, { encoding: UTF8 });
  } catch (ex) {
    return {
      error: {
        status: ex.status,
        message: ex.message
      }
    };
  }
};

const loadClipboardEntries = () => loadJSONFromFile(CLIPBOARD_PATH, []);

const addClipboardEntry = (content) => {
  const currentClipboard = loadClipboardEntries();

  const matched = currentClipboard.find(item => item.name === content.name);

  if (matched) {
    return 'duplicate name';
  }
  else {
    const updatedClipboard = currentClipboard.concat([content]);

    return writeToFile(CLIPBOARD_PATH, JSON.stringify(updatedClipboard));
  }
};

const deleteClipboardEntry = (name) => {
  const currentClipboard = loadClipboardEntries();

  const updatedClipboard = currentClipboard.filter(item => item.name !== name);

  return writeToFile(CLIPBOARD_PATH, JSON.stringify(updatedClipboard));
};

module.exports = {
  addClipboardEntry,
  deleteClipboardEntry,
  loadClipboardEntries,
  executeCommand
};