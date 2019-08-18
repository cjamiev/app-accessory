const execSync = require('child_process').execSync;
const { loadJSONFromFile } = require('../utility/read');
const { writeToFile } = require('../utility/write');

const CLIPMARK_PATH = './storage/clipmark.json';
const UTF8 = 'utf8';

const createClipmark = (content) => writeToFile(CLIPMARK_PATH, JSON.stringify(content));

const loadClipmark = () => loadJSONFromFile(CLIPMARK_PATH, {});

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

module.exports = {
  createClipmark,
  executeCommand,
  loadClipmark
};