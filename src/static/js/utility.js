const DELIMITERS = [',', '\n', ' '];
const sortByDelimiter = (content, delimiter = ' ') => content.split(delimiter).sort().join(delimiter);
const sortDecendingByDelimiter = (content, delimiter = ' ') => content.split(delimiter).sort().reverse().join(delimiter);
const replaceHTMLCharactersWithEscapeCharacters = (text) => text.replace(/</gm, '&lt;').replace(/>/gm, '&gt;');
const replaceEscapeCharactersWithHTMLCharacters = (text) => text.replace(/&lt;/gm, '<').replace(/&gt;/gm, '>');

const copyToClipboard = text => {
  const copyText = document.createElement('textarea');
  copyText.value = text;
  document.body.appendChild(copyText);
  copyText.select();
  document.execCommand('copy');
  document.body.removeChild(copyText);
};

const copyContentToClipboard = (elementId) => {
  copyToClipboard(document.getElementById(elementId).innerHTML);
};

const copyHTMLContentToClipboard = (elementId) => {
  const text = replaceEscapeCharactersWithHTMLCharacters(document.getElementById(elementId).innerHTML);
  copyToClipboard(text);
};

const parseObject = obj => {
  try {
    JSON.parse(obj);
  } catch (e) {
    console.log(e);
    return { error: true, message: 'Invalid JSON Format' };
  }
  return { error: false, message: 'Valid JSON Format' };
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