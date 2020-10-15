const parseObject = obj => {
  try {
    JSON.parse(obj);
  } catch (e) {
    return 'invalid';
  }
  return 'valid';
};