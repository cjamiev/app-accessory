const clipboardDivId = 'clipboard-div';
const commandDivId = 'command-div';
const urlDivId = 'url-div';
const useResponseDiv = 'use-response-div';

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
        document.getElementById(useResponseDiv).innerHTML = data.message;
      });
  };
};

const deleteClipMarkEntry = (content) => {
  return () => {
    fetch('/delete-clipmark-entry', {
      headers: {
        'Accept': 'application/json',
        'Content-Type': 'application/json'
      },
      body: JSON.stringify(content),
      method: 'POST'
    })
      .then(resp => resp.json())
      .then(data => {
        const responseType = data.error ? 'error' : 'success';
        const responseMessage = data.error ? data.message : 'Successfully removed entry';

        const responseAlert = createAlert('clipmark-delete-alert', responseType, responseMessage);
        document.getElementById(useResponseDiv).appendChild(responseAlert);
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
    const itemDiv = document.createElement('div');

    const copyButton = document.createElement('button');
    copyButton.innerHTML = item.name;
    copyButton.className = 'copy-btn';
    copyButton.onclick = copyToClipboard(item.value);

    const deleteButton = document.createElement('button');
    deleteButton.innerHTML = 'x';
    deleteButton.className = 'delete-btn';
    deleteButton.onclick = deleteClipMarkEntry(item);

    itemDiv.appendChild(copyButton);
    itemDiv.appendChild(deleteButton);
    clipboardDiv.appendChild(itemDiv);
  });

  router.appendChild(clipboardDiv);
};

const createCommandButtons = (data) => {
  const router = document.getElementById('router');
  const commandDiv = document.createElement('div');
  commandDiv.id = commandDivId;

  data.forEach(item => {
    const itemDiv = document.createElement('div');

    const commandButton = document.createElement('button');
    commandButton.innerHTML = item.name;
    commandButton.className = 'command-btn';
    commandButton.onclick = executeCommand(item.value);

    const deleteButton = document.createElement('button');
    deleteButton.innerHTML = 'x';
    deleteButton.className = 'delete-btn';
    deleteButton.onclick = deleteClipMarkEntry(item);

    itemDiv.appendChild(commandButton);
    itemDiv.appendChild(deleteButton);
    commandDiv.appendChild(itemDiv);
  });

  router.appendChild(commandDiv);
};

const createUrlLinks = (data) => {
  const router = document.getElementById('router');
  const urlDiv = document.createElement('div');
  urlDiv.id = urlDivId;

  data.forEach(item => {
    const itemDiv = document.createElement('div');

    const urlLink = document.createElement('a');
    urlLink.innerHTML = item.name;
    urlLink.className = 'url-link';
    urlLink.href = item.value;
    urlLink.target = '_blank';

    const deleteButton = document.createElement('button');
    deleteButton.innerHTML = 'x';
    deleteButton.className = 'delete-btn';
    deleteButton.onclick = deleteClipMarkEntry(item);

    itemDiv.appendChild(urlLink);
    itemDiv.appendChild(deleteButton);
    urlDiv.appendChild(itemDiv);
  });

  router.appendChild(urlDiv);
};

const routeUseClipMark = () => {
  const router = document.getElementById('router');
  const commandDiv = document.createElement('div');
  commandDiv.id = useResponseDiv;


  router.appendChild(commandDiv);
  loadClipMarks();
};
