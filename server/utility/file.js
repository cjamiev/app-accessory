import fs from 'fs';
import path from 'path';

const getAllFilesInTreeDirectory = (dir, filelist = []) => {
  fs.readdirSync(dir).forEach(file => {
    filelist = fs.statSync(path.join(dir, file)).isDirectory()
      ? getAllFilesInTreeDirectory(path.join(dir, file), filelist)
      : filelist.concat(path.join(dir, file));
  });

  return filelist;
}

const getAllDirectoriesInFolder = dir => fs.readdirSync(dir);


export {
  getAllFilesInTreeDirectory,
  getAllDirectoriesInFolder
};