const clipboardDivId = 'clipboard-div';

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
      console.log(data);
      createClipboardButtons(data.clipmarks.clipboards);
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

const routeUseClipMark = () => {
  const router = document.getElementById('router');

  loadClipMarks();
};
