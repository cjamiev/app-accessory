const DELIMITERS = [',', '\n', ' '];
const sortByDelimiter = (content, delimiter = ' ') => content.split(delimiter).sort().join(delimiter);
const sortDecendingByDelimiter = (content, delimiter = ' ') => content.split(delimiter).sort().reverse().join(delimiter);

const copyToClipboard = text => {
  const copyText = document.createElement('textarea');
  copyText.value = text.replace(/&lt;/gm, '<').replace(/&gt;/gm, '>');
  document.body.appendChild(copyText);
  copyText.select();
  document.execCommand('copy');
  document.body.removeChild(copyText);
};

const copyContentToClipboard = (elementId) => {
  copyToClipboard(document.getElementById(elementId).innerHTML);
};

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