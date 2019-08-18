const clipboardDivId = 'clipboard-div';
const urlDivId = 'url-div';

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
    newCopyButton.className = 'command-btn';
    newCopyButton.onclick = copyToClipboard(item.value);

    clipboardDiv.appendChild(newCopyButton);
  });

  router.appendChild(clipboardDiv);
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

  loadClipMarks();
};
