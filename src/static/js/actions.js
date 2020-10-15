const loadItems = () => {
  const clipboardData = JSON.parse((localStorage.getItem('clipboard') || '[]'));
  const quickClipboard = document.getElementById('quick-clipboard');
  const copyBtns = document.querySelectorAll('.quick-clipboard-copy-btn');
  const timerEls = document.querySelectorAll('.quick-clipboard-timer');
  Array.prototype.forEach.call(copyBtns, el => {
    quickClipboard.removeChild(el);
  });
  Array.prototype.forEach.call(timerEls, el => {
    quickClipboard.removeChild(el);
  });
  clipboardData.forEach((entry, index) => {
    if (entry.operationType === 'copy') {
      const el = document.createElement('button');
      el.className = 'quick-clipboard-copy-btn';
      el.setAttribute('data-clip-item', index);
      el.onclick = () => { copyToClipboard(entry.value); };
      el.innerHTML = entry.name;

      quickClipboard.appendChild(el);
    }
    else if (entry.operationType === 'timer') {
      const elParent = document.createElement('div');
      elParent.className = 'quick-clipboard-timer';
      elParent.setAttribute('data-clip-item', index);

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

const showAddNewItemForm = () => {
  const button = document.getElementById('add-form-btn');
  const content = document.getElementById('formcontent');
  const header = document.getElementById('formheader');
  button.classList.toggle('hide-add-form-btn');
  content.classList.toggle('formcontent-active');
  header.classList.toggle('formheader-active');
};

const showQuickClipboardForm = () => {
  const tooltip = document.getElementById('quick-clipboard-add-new-container');
  tooltip.classList.toggle('quick-clipboard-add-new-container-active');
};

const addNewItem = () => {
  const operationType = [...document.getElementsByName('operation')].find(el => el.checked).value;
  const name = document.getElementById('new-item-name').value;
  const value = document.getElementById('new-item-value').innerHTML;

  const clipboard = JSON.parse((localStorage.getItem('clipboard') || '[]'));
  clipboard.push({ name, value, operationType });
  localStorage.setItem('clipboard', JSON.stringify(clipboard));
  showQuickClipboardForm();
  loadItems();
};

const copyToClipboard = text => {
  const copyText = document.createElement('textarea');
  copyText.value = text;
  document.body.appendChild(copyText);
  copyText.select();
  document.execCommand('copy');
  document.body.removeChild(copyText);
};

const deleteMode = () => {
  const copyBtns = document.querySelectorAll('.quick-clipboard-copy-btn');
  Array.prototype.forEach.call(copyBtns, el => {
    el.classList.toggle('quick-clipboard-copy-btn-delete');
    el.onclick = () => { deleteClipboardItem(el.innerHTML); };
  });
};

const deleteClipboardItem = text => {
  const clipboardData = JSON.parse((localStorage.getItem('clipboard') || '[]'));
  const updatedClipboardData = clipboardData.filter(item => item.name !== text);
  localStorage.setItem('clipboard', JSON.stringify(updatedClipboardData));
  loadItems();
};