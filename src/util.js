const fs = require('fs');

const UTF8 = 'utf-8';

const isNumber = (value) => typeof value === 'number';
const isBoolean = (value) => typeof value === 'boolean';
const isString = (value) => typeof value === 'string';
const isObject = (value) => typeof value === 'object';
const isObjectLike = (value) => value !== null && typeof value === 'object';
const xOr = (a, b) => (!a && b) || (a && !b);
const isNotEmpty = (targetObject) => {
  if (!targetObject || !Object.keys(targetObject).length) {
    return false;
  }

  const entries = Object.keys(targetObject);
  const atLeastOneNotNull = entries.some((key) => !isNil(targetObject[key]));

  return atLeastOneNotNull;
};
const isNil = (value) => value === null || value === undefined;
const isEmpty = (targetObject) => !isNotEmpty(targetObject);
const isEqual = (entry1, entry2) => {
  if (!(isObjectLike(entry1) && isObjectLike(entry1))) {
    return entry1 === entry2;
  }
  if (xOr(isEmpty(entry1), isEmpty(entry2))) {
    return false;
  }

  const keys1 = Object.keys(entry1);
  const keys2 = Object.keys(entry2);

  if (keys1.length !== keys2.length) {
    return false;
  }

  const checkEquality = keys1.reduce((accumulator, key) => {
    const child1 = entry1[key];
    const child2 = entry2[key];

    return isObjectLike(child1) && isObjectLike(child2)
      ? accumulator && isEqual(child1, child2)
      : accumulator && child1 === child2;
  }, true);

  return checkEquality;
};

const writeToFile = (filepath, content) => {
  try {
    fs.writeFileSync(filepath, content);
    return {
      error: false,
      message: 'Wrote to file:' + filepath
    };
  } catch (e) {
    return {
      error: true,
      message: e
    };
  }
};

const updateFile = (path, content) => {
  try {
    fs.writeFileSync(path, JSON.stringify(content));
    return '';
  } catch (e) {
    return e;
  }
};

const deleteFile = (path) => {
  try {
    fs.unlinkSync(path);
    return 'successfully deleted file';
  } catch (err) {
    return err;
  }
};

const loadFile = (filepath) => {
  return fs.existsSync(filepath) ? fs.readFileSync(filepath, UTF8) : null;
};

const loadJSONFromFile = (path, defaultValue) => {
  return fs.existsSync(path) ? JSON.parse(fs.readFileSync(path, UTF8)) : defaultValue;
};

const readDirectory = (dir) => fs.readdirSync(dir);

module.exports = {
  isNumber,
  isBoolean,
  isString,
  isObject,
  isEqual,
  writeToFile,
  updateFile,
  deleteFile,
  loadFile,
  loadJSONFromFile,
  readDirectory
};
