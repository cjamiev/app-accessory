const setOutput = (data) => {
  document.getElementById('response').innerHTML = JSON.stringify(data, undefined, 4);
};

const validateJson = () => {
  const contentData = parseObject(document.getElementById('contentData').innerHTML);
  document.getElementById('response').innerHTML = contentData;
};

const writeToFile = () => {
  const filename = document.getElementById('filenameData').value;
  const content = document.getElementById('contentData').innerHTML;

  api.post('/', { filename, content }).then(data => {
    setOutput(data);
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