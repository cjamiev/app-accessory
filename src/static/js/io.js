const setOutput = (data) => {
  document.getElementById('output').innerHTML = JSON.stringify(data, undefined, 4);
};

const copyFileToClipboard = () => {
  copyToClipboard(document.getElementById('contentData').value);
};

const validateJson = () => {
  const contentData = parseObject(document.getElementById('contentData').value);
  document.getElementById('output').value = contentData;
};

const writeToFile = () => {
  const filename = document.getElementById('filenameData').value;
  const content = document.getElementById('contentData').value;

  api.post('/', { filename, content }).then(data => {
    setOutput(data);
    getAllFiles();
  });

  return false;
};

const getAllFiles = () => {
  api.get('/').then(result => {
    const filenames = result.data;

    const fileDropdown = document.getElementById('filesData');
    fileDropdown.querySelectorAll('*').forEach(node => node.remove());

    const initialOption = document.createElement('option');
    initialOption.value = 'select';
    initialOption.innerHTML = 'select';
    fileDropdown.appendChild(initialOption);

    filenames.forEach(name => {
      const option = document.createElement('option');
      option.value = name;
      option.innerHTML = name;

      fileDropdown.appendChild(option);
    });
  });
};

const getFile = () => {
  const filesData = document.getElementById('filesData');
  const filename = filesData.options[filesData.selectedIndex].value;
  const nameAndExt = filename.split('.');

  const url = '/?read=true&name=' + nameAndExt[0] + '&ext=' + nameAndExt[1];

  api.get(url).then(result => {
    document.getElementById('contentData').value = result.data;
    document.getElementById('filenameData').value = filename;
  });
};