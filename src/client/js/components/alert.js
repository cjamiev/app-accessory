const alertMessage = {
  info: 'Info! ',
  warning: 'Warning! ',
  success: 'Success! ',
  error: 'Error! '
};

const createAlert = (alertId, type, content) => {
  const parentDiv = document.createElement('div');
  parentDiv.id = alertId;
  parentDiv.className = 'alert ' + type;
  const closeSpan = document.createElement('span');
  closeSpan.className = 'alert-close';
  closeSpan.innerHTML = '&times;';
  closeSpan.onclick = removeAlert(alertId);
  const typeLabel = document.createElement('strong');
  typeLabel.innerHTML = alertMessage[type];
  const text = document.createElement('span');
  text.innerHTML = content;

  parentDiv.appendChild(closeSpan);
  parentDiv.appendChild(typeLabel);
  parentDiv.appendChild(text);

  return parentDiv;
};

const removeAlert = alertId => {
  return () => {
    const alertComponent = document.getElementById(alertId);
    const parent = alertComponent.parentElement;
    parent.removeChild(alertComponent);
  };
};
