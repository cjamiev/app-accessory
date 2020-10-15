const parseObject = obj => {
  try {
    JSON.parse(obj);
  } catch (e) {
    return 'invalid';
  }
  return 'valid';
};

const getCurrentTime = () => {
  const today = new Date();

  return {
    year: today.getFullYear(),
    month: today.getMonth() + 1,
    date: today.getDate(),
    hour: today.getHours(),
    minute: today.getMinutes(),
    second: today.getSeconds()
  };
};