const fs = require('fs');

const SUCCESS = 'SUCCESS';

const writeToFile = (filepath, content) => {
  try {
    fs.writeFileSync(filepath, content);
    return SUCCESS;
  } catch (e) {
    return e;
  }
};

module.exports = {
  writeToFile
};