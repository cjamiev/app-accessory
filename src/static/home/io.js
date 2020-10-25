const setOutput = (data) => {
  const alertField = document.getElementById('alert-field');
  alertField.innerHTML = data.message;

  const alertClass = data.error ? 'error' : 'success';
  alertField.classList.remove('success');
  alertField.classList.remove('error');
  alertField.classList.add(alertClass);
};

const validateJson = () => {
  const response = parseObject(document.getElementById('contentData').innerHTML);
  const alertField = document.getElementById('alert-field');
  const alertContainer = document.getElementById('alert-container');
  alertField.innerHTML = response.message;

  const alertClass = response.error ? 'error' : 'success';
  alertContainer.classList.remove('success');
  alertContainer.classList.remove('error');
  alertContainer.classList.add(alertClass);
};

const writeToFile = () => {
  const filename = document.getElementById('filenameData').value;
  const content = document.getElementById('contentData').innerHTML;

  api.post('/', { filename, content }).then(result => {
    setOutput(result.data);
    getAllFiles();
  });

  return false;
};

const getAllFiles = () => {
  api.get('/').then(result => {
    const filenames = result.data;

    const fileDiv = document.getElementById('all-files');
    const fileEls = document.querySelectorAll('.file-btn');

    Array.prototype.forEach.call(fileEls, el => {
      fileDiv.removeChild(el);
    });

    filenames.forEach((name, index) => {
      const button = document.createElement('button');
      button.className = 'file-btn';
      button.setAttribute('data-clip-item', index);
      button.onclick = () => { loadFile(name); };
      button.innerHTML = name;

      fileDiv.appendChild(button);
    });
  });
};

const loadFile = (filename) => {
  const nameAndExt = filename.split('.');

  const url = '/?read=true&name=' + nameAndExt[0] + '&ext=' + nameAndExt[1];

  api.get(url).then(result => {
    document.getElementById('contentData').innerHTML = result.data;
    document.getElementById('filenameData').value = filename;
  });
};

const sortFile = (descending = false) => {
  const contentDataElement = document.getElementById('contentData');
  const delimiterSelection = document.getElementById('delimiterData');
  const delimiterValue = delimiterSelection.options[delimiterSelection.selectedIndex].value;
  const delimiter = DELIMITERS[delimiterValue];
  const content = contentDataElement.innerHTML;

  contentDataElement.innerHTML = descending ? sortDecendingByDelimiter(content, delimiter) : sortByDelimiter(content, delimiter);
};

const splitFileLines = () => {
  const contentDataElement = document.getElementById('contentData');
  const delimiterSelection = document.getElementById('delimiterData');
  const delimiterValue = delimiterSelection.options[delimiterSelection.selectedIndex].value;
  const delimiter = DELIMITERS[delimiterValue];
  const content = contentDataElement.innerHTML;

  contentDataElement.innerHTML = content.split(delimiter).join('\n');
};

const joinFileLines = () => {
  const contentDataElement = document.getElementById('contentData');
  const delimiterSelection = document.getElementById('delimiterData');
  const delimiterValue = delimiterSelection.options[delimiterSelection.selectedIndex].value;
  const delimiter = DELIMITERS[delimiterValue];
  const content = contentDataElement.innerHTML;

  contentDataElement.innerHTML = content.split('\n').join(delimiter);
};

const replaceAll = () => {
  const contentDataElement = document.getElementById('contentData');

  const content = contentDataElement.innerHTML;
  const find = document.getElementById('findData').value;
  const replaceText = document.getElementById('replaceData').value;

  const regex = new RegExp(find, 'gm');
  contentDataElement.innerHTML = content.replace(regex, replaceText);
};

const minifyContent = () => {
  const contentDataElement = document.getElementById('contentData');

  const content = contentDataElement.innerHTML;
  const newLineRegex = new RegExp(/\n|\t|\r|\s\s/, 'gm');
  const result = content.replace(newLineRegex, '');

  contentDataElement.innerHTML = result;
};