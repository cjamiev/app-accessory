const fs = require('fs'); 
const path = require('path');

const getAllFilesInTreeDirectory = (dir, filelist = []) => {
  fs.readdirSync(dir).forEach(file => {
    filelist = fs.statSync(path.join(dir, file)).isDirectory()
      ? getAllFilesInTreeDirectory(path.join(dir, file), filelist)
      : filelist.concat(path.join(dir, file));
  });

  return filelist;
}

function walkSync(dir) {
  return fs.lstatSync(dir).isDirectory()
      ? fs.readdirSync(dir).map(f => walkSync(path.join(dir, f)))
      : dir;
}

module.exports.getAllFilesInTreeDirectory = getAllFilesInTreeDirectory;
module.exports.walkSync = walkSync;