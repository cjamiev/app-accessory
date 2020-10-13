const toggleSideMenu = () => {
  const sideMenu = document.getElementById('side-menu');
  sideMenu.classList.toggle('side-menu-active');
};

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
  const clipboard = JSON.parse((localStorage.getItem('clipboard') || '[]'));
  const menu = document.getElementById('side-menu-content');
  clipboard.forEach(entry => {
    if (entry.operationType === 'copy') {
      const el = document.createElement('button');
      el.className = 'copy-btn';
      el.onclick = () => { copyToClipboard(entry.value); };
      el.innerHTML = entry.name;

      menu.appendChild(el);
    }
    else if (entry.operationType === 'link') {
      const el = document.createElement('a');
      el.target = '_blank';
      el.href = entry.value;
      el.className = 'menu-link';
      el.innerHTML = entry.name;

      menu.appendChild(el);
    }
    else if (entry.operationType === 'timer') {
      const elParent = document.createElement('div');
      elParent.className = 'menu-timer';
      elParent.innerHTML = entry.name;
      const el = document.createElement('span');
      el.setAttribute('data-date', entry.value);
      elParent.appendChild(el);

      menu.appendChild(elParent);
    }
  });
};

const HEADERS = {
  'Accept': 'application/json',
  'Content-Type': 'application/json'
};

const api = {
  post: (url, payload) => {
    return fetch(url, {
      headers: HEADERS,
      body: JSON.stringify(payload),
      method: 'POST'
    })
      .then(resp => resp.json())
      .catch(error => console.log('error:', error));
  },
  get: (url) => {
    return fetch(url, {
      headers: HEADERS,
      method: 'GET'
    })
      .then(resp => resp.json())
      .catch(error => console.log('error:', error));
  }
};

const parseObject = obj => {
  try {
    JSON.parse(obj);
  } catch (e) {
    return 'invalid';
  }
  return 'valid';
};

const executeCommand = (command, async = false) => {
  const url = async ? '/command-async' : '/command';

  return fetch(url + command, {
    method: 'GET',
    headers: HEADERS
  })
    .then(response => response.json())
    .then(result => {
      const lines = result.message.replace('\r', '').split('\n').filter(line => line);
      const responseDiv = document.getElementById('response');
      const responseElements = [...document.getElementsByClassName('card-text')];
      responseElements.forEach(el => {
        responseDiv.removeChild(el);
      });

      lines.forEach(line => {
        const p = document.createElement('p');
        p.innerHTML = line;
        p.classList.add('card-text');

        responseDiv.appendChild(p);
      });
    })
    .catch(error => console.log('error:', error));
};