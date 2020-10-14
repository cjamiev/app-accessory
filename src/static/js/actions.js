const showAddNewItemForm = () => {
  const button = document.getElementById('add-form-btn');
  const content = document.getElementById('formcontent');
  const header = document.getElementById('formheader');
  button.classList.toggle('hide-add-form-btn');
  content.classList.toggle('formcontent-active');
  header.classList.toggle('formheader-active');
};

const addNewItem = () => {
  const operationType = [...document.getElementsByName('operation')].find(el => el.checked).value;
  const name = document.getElementById('new-item-name').value;
  const value = document.getElementById('new-item-value').innerHTML;

  const clipboard = JSON.parse((localStorage.getItem('clipboard') || '[]'));
  clipboard.push({ name, value, operationType });
  localStorage.setItem('clipboard', JSON.stringify(clipboard));
};

const copyToClipboard = text => {
  const copyText = document.createElement('textarea');
  copyText.value = text;
  document.body.appendChild(copyText);
  copyText.select();
  document.execCommand('copy');
  document.body.removeChild(copyText);
};

const loadItems = () => {
  const clipboardData = JSON.parse((localStorage.getItem('clipboard') || '[]'));
  const quickClipboard = document.getElementById('quick-clipboard');
  clipboardData.forEach(entry => {
    if (entry.operationType === 'copy') {
      const el = document.createElement('button');
      el.className = 'quick-clipboard-copy-btn';
      el.onclick = () => { copyToClipboard(entry.value); };
      el.innerHTML = entry.name;

      quickClipboard.appendChild(el);
    }
    else if (entry.operationType === 'timer') {
      const elParent = document.createElement('div');
      elParent.className = 'quick-clipboard-timer';

      const elName = document.createElement('span');
      elName.innerHTML = entry.name;
      elParent.appendChild(elName);

      const elTimer = document.createElement('span');
      elTimer.setAttribute('data-date', entry.value);
      elParent.appendChild(elTimer);

      quickClipboard.appendChild(elParent);
    }
  });
};

const parseObject = obj => {
  try {
    JSON.parse(obj);
  } catch (e) {
    return 'invalid';
  }
  return 'valid';
};