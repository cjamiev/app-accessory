const routeHome = () => {
  const router = document.getElementById('router');
};

const createClipMarkPayloadId = 'clipmark-payload';

const submitClipMarkEntry = () => {
  const payloadSelection = JSON.parse(sessionStorage.getItem(createClipMarkPayloadId));
  const payload = {
    name: payloadSelection.name,
    value: payloadSelection.value
  };

  fetch('/add-clipboard-entry', {
    headers: {
      'Accept': 'application/json',
      'Content-Type': 'application/json'
    },
    body: JSON.stringify(payload),
    method: 'POST'
  })
    .then(resp => resp.json())
    .then(data => {
      console.log(data);
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
  submitButton.onclick = submitClipMarkEntry;

  const formDiv = document.createElement('div');
  formDiv.className = 'form-container';

  formDiv.appendChild(typeOfClipboardComponent);
  formDiv.appendChild(nameOfClipboardComponent);
  formDiv.appendChild(valueOfClipboardComponent);
  formDiv.appendChild(submitButton);

  router.appendChild(formDiv);
};