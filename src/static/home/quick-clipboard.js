const loadItems = () => {
  const clipboardData = JSON.parse(localStorage.getItem('clipboard') || '[]');
  const quickClipboard = document.getElementById('quick-clipboard');
  const copyBtns = document.querySelectorAll('.quick-clipboard-copy-btn');
  const timerEls = document.querySelectorAll('.quick-clipboard-timer');
  Array.prototype.forEach.call(copyBtns, (el) => {
    quickClipboard.removeChild(el);
  });
  Array.prototype.forEach.call(timerEls, (el) => {
    quickClipboard.removeChild(el);
  });
  clipboardData.forEach((entry, index) => {
    if (entry.operationType === 'copy') {
      const el = document.createElement('button');
      el.className = 'quick-clipboard-copy-btn';
      el.setAttribute('data-clip-item', index);
      el.onclick = () => {
        copyToClipboard(entry.value);
      };
      el.textContent = entry.name;

      quickClipboard.appendChild(el);
    } else if (entry.operationType === 'timer') {
      const elParent = document.createElement('div');
      elParent.className = 'quick-clipboard-timer';
      elParent.setAttribute('data-clip-item', index);

      const elName = document.createElement('span');
      elName.textContent = entry.name;
      elParent.appendChild(elName);

      const elTimer = document.createElement('span');
      elTimer.setAttribute('data-date', entry.value);
      elTimer.textContent = 'Loading...';
      elParent.appendChild(elTimer);

      const date = entry.value.split(',').map((item) => Number(item));
      const futureDate = new Date(...date);
      const today = new Date();
      const diff = futureDate.getTime() - today.getTime();

      setTimeout(() => {
        alert(entry.name + ' is done!');
      }, diff);

      quickClipboard.appendChild(elParent);
    }
  });
};

const showQuickClipboardForm = () => {
  const tooltip = document.getElementById('quick-clipboard-add-new-container');
  tooltip.classList.toggle('quick-clipboard-add-new-container-active');
  const curTime = getCurrentTime();

  const amOrpm = curTime.hour > 12 ? 'pm' : 'am';
  const hour = curTime.hour % 12 === 0 ? 12 : curTime.hour % 12;

  document.getElementById('new-item-name').value = '';
  document.getElementById('new-item-value').textContent = '';
  document.getElementById('new-item-year').value = curTime.year;
  document.getElementById('new-item-month').value = curTime.month;
  document.getElementById('new-item-day').value = curTime.date;
  document.getElementById('new-item-hour').value = hour;
  document.getElementById('new-item-minute').value = 0;
  document.getElementById('new-item-second').value = 0;
  document.getElementById('amorpm').value = amOrpm;
};

const getInputValue = (operationType) => {
  if (operationType === 'copy') {
    return document.getElementById('new-item-value').textContent;
  }

  const amOrpm = document.getElementById('amorpm').value === 'am' ? 0 : 12;

  const year = document.getElementById('new-item-year').value;
  const month = document.getElementById('new-item-month').value - 1;
  const day = document.getElementById('new-item-day').value;
  const hour = (document.getElementById('new-item-hour').value % 12) + amOrpm;
  const minute = document.getElementById('new-item-minute').value;
  const second = document.getElementById('new-item-second').value;

  return year + ',' + month + ',' + day + ',' + hour + ',' + minute + ',' + second;
};

const addNewItem = () => {
  const operationType = [...document.getElementsByName('operation')].find((el) => el.checked).value;
  const name = document.getElementById('new-item-name').value;
  const value = getInputValue(operationType);

  const clipboard = JSON.parse(localStorage.getItem('clipboard') || '[]');
  clipboard.push({ name, value, operationType });
  localStorage.setItem('clipboard', JSON.stringify(clipboard));
  showQuickClipboardForm();
  loadItems();
};

const deleteMode = () => {
  const copyBtns = document.querySelectorAll('.quick-clipboard-copy-btn');
  const timers = document.querySelectorAll('.quick-clipboard-timer');
  Array.prototype.forEach.call(copyBtns, (el) => {
    el.classList.toggle('quick-clipboard-copy-btn-delete');
    el.onclick = () => {
      deleteClipboardItem(el.textContent);
    };
  });
  Array.prototype.forEach.call(timers, (el) => {
    el.classList.toggle('quick-clipboard-copy-btn-delete');
    const name = el.children[0].textContent;
    el.onclick = () => {
      deleteClipboardItem(name);
    };
  });
};

const deleteClipboardItem = (text) => {
  const clipboardData = JSON.parse(localStorage.getItem('clipboard') || '[]');
  const updatedClipboardData = clipboardData.filter((item) => item.name !== text);
  localStorage.setItem('clipboard', JSON.stringify(updatedClipboardData));
  loadItems();
};

const quickClipboardOperation = (op) => {
  const timerFieldsDateEl = document.getElementById('timer-fields-date');
  const timerFieldsClockEl = document.getElementById('timer-fields-clock');
  const copyFieldsEl = document.getElementById('copy-fields');

  if (op === 'copy') {
    timerFieldsClockEl.classList = ['timer-fields-hide'];
    timerFieldsDateEl.classList = ['timer-fields-hide'];
    copyFieldsEl.classList = [''];
  } else {
    copyFieldsEl.classList = ['copy-fields-hide'];
    timerFieldsClockEl.classList = [''];
    timerFieldsDateEl.classList = [''];
  }
};

const switchAMorPM = () => {
  const amOrpmEl = document.getElementById('amorpm');
  const currentValue = amOrpmEl.value;
  const updatedValue = currentValue === 'am' ? 'pm' : 'am';

  amOrpmEl.value = updatedValue;
};
