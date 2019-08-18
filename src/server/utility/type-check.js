const parseObject = obj => {
  try {
    return JSON.parse(obj);
  } catch (e) {
    return null;
  }
};

const isJSONString = value => (isString(value) && parseObject(value) ? true : false);

const isString = value => typeof value === 'string';

module.exports = {
  isJSONString
};
