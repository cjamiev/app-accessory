const clipboardDivId = 'clipboard-div';
const commandDivId = 'command-div';
const urlDivId = 'url-div';
const commandResponseDivId = 'command-response';

const copyToClipboard = text => {
  return () => {
    const copyText = document.createElement('textarea');
    copyText.value = text;
    document.body.appendChild(copyText);
    copyText.select();
    document.execCommand('copy');
    document.body.removeChild(copyText);
  };
};

const executeCommand = (command) => {
  return () => {
    fetch('/execute-command', {
      headers: {
        'Accept': 'application/json',
        'Content-Type': 'application/json'
      },
      body: JSON.stringify({ command }),
      method: 'POST'
    })
      .then(resp => resp.json())
      .then(data => {
        console.log(data.message);
        document.getElementById(commandResponseDivId).innerHTML = data.message;
      });
  };
};

const loadClipMarks = () => {
  fetch('/load-clipmark-entries', {
    headers: {
      'Accept': 'application/json',
      'Content-Type': 'application/json'
    },
    method: 'GET'
  })
    .then(resp => resp.json())
    .then(data => {
      createClipboardButtons(data.clipmarks.clipboards);
      createCommandButtons(data.clipmarks.commands);
      createUrlLinks(data.clipmarks.urls);
    });
};

const createClipboardButtons = (data) => {
  const router = document.getElementById('router');
  const clipboardDiv = document.createElement('div');
  clipboardDiv.id = clipboardDivId;

  data.forEach(item => {
    const newCopyButton = document.createElement('button');
    newCopyButton.innerHTML = item.name;
    newCopyButton.className = 'copy-btn';
    newCopyButton.onclick = copyToClipboard(item.value);

    clipboardDiv.appendChild(newCopyButton);
  });

  router.appendChild(clipboardDiv);
};

const createCommandButtons = (data) => {
  const router = document.getElementById('router');
  const commandDiv = document.createElement('div');
  commandDiv.id = commandDivId;

  data.forEach(item => {
    const newCommandButton = document.createElement('button');
    newCommandButton.innerHTML = item.name;
    newCommandButton.className = 'command-btn';
    newCommandButton.onclick = executeCommand(item.value);

    commandDiv.appendChild(newCommandButton);
  });

  router.appendChild(commandDiv);
};

const createUrlLinks = (data) => {
  const router = document.getElementById('router');
  const urlDiv = document.createElement('div');
  urlDiv.id = urlDivId;

  data.forEach(item => {
    const newUrlLink = document.createElement('a');
    newUrlLink.innerHTML = item.name;
    newUrlLink.className = 'url-link';
    newUrlLink.href = item.value;
    newUrlLink.target = '_blank';

    urlDiv.appendChild(newUrlLink);
  });

  router.appendChild(urlDiv);
};

const routeUseClipMark = () => {
  const router = document.getElementById('router');
  const commandDiv = document.createElement('div');
  commandDiv.id = commandResponseDivId;


  router.appendChild(commandDiv);
  loadClipMarks();
};
