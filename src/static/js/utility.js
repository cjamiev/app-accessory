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
  setOutput({ error: false, message: 'Successfully copied' });
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

const setOutput = (data) => {
  const alertField = document.getElementById('alert-field');
  const alertFieldContainer = document.getElementById('alert-field-container');
  alertField.innerHTML = data.message;

  const alertClass = data.error ? 'error' : 'success';
  alertField.classList.remove('success');
  alertField.classList.remove('error');
  alertField.classList.add(alertClass);
  alertFieldContainer.classList.add('alert-field-active');
  setTimeout(removeOutput, 5000);
};

const removeOutput = () => {
  const alertField = document.getElementById('alert-field');
  const alertFieldContainer = document.getElementById('alert-field-container');

  alertField.classList.remove('success');
  alertField.classList.remove('error');
  alertFieldContainer.classList.remove('alert-field-active');
}

const validateJson = () => {
  const response = parseObject(document.getElementById('contentData').innerHTML);
  const alertField = document.getElementById('alert-field');
  const alertFieldContainer = document.getElementById('alert-field-container');
  alertField.innerHTML = response.message;

  const alertClass = response.error ? 'error' : 'success';
  alertField.classList.remove('success');
  alertField.classList.remove('error');
  alertField.classList.add(alertClass);
  alertFieldContainer.classList.add('alert-field-active');
};