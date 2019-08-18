const createClipMarkPayloadId = 'clipmark-payload';
const responseDivId = 'clipmark-payload-response';

const addClipMarkEntry = () => {
  const loadClipMarkSelection = JSON.parse(sessionStorage.getItem(createClipMarkPayloadId));

  const payload = {
    type: 'Clipboard',
    ...loadClipMarkSelection
  };

  fetch('/add-clipmark-entry', {
    headers: {
      'Accept': 'application/json',
      'Content-Type': 'application/json'
    },
    body: JSON.stringify(payload),
    method: 'POST'
  })
    .then(resp => resp.json())
    .then(data => {
      const responseType = data.error ? 'error' : 'success';
      const responseMessage = data.error ? data.message : 'Added new entry';

      const responseAlert = createAlert('clipmark-payload-alert', responseType, responseMessage);
      document.getElementById(responseDivId).appendChild(responseAlert);
    });
};

const routeCreateClipMark = () => {
  const typeOfClipboard = {
    id: 'type',
    type: 'select',
    label: 'Type',
    values: ['Clipboard', 'Url', 'Command']
  };
  const nameOfClipboard = {
    id: 'name',
    type: 'text',
    label: 'Name'
  };
  const valueOfClipboard = {
    id: 'value',
    type: 'text',
    label: 'Value'
  };

  const router = document.getElementById('router');

  const typeOfClipboardComponent = createSelect(typeOfClipboard, createClipMarkPayloadId);
  const nameOfClipboardComponent = createText(nameOfClipboard, createClipMarkPayloadId);
  const valueOfClipboardComponent = createText(valueOfClipboard, createClipMarkPayloadId);

  const submitButton = document.createElement('input');
  submitButton.innerHTML = 'submit';
  submitButton.type = 'submit';
  submitButton.onclick = addClipMarkEntry;

  const responseDiv = document.createElement('div');
  responseDiv.id = responseDivId;

  const formDiv = document.createElement('div');
  formDiv.className = 'form-container';

  formDiv.appendChild(responseDiv);
  formDiv.appendChild(typeOfClipboardComponent);
  formDiv.appendChild(nameOfClipboardComponent);
  formDiv.appendChild(valueOfClipboardComponent);
  formDiv.appendChild(submitButton);

  router.appendChild(formDiv);
};