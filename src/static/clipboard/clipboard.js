const createElement = (item) => {
  if (item.type === 'link') {
    const link = document.createElement('a');
    link.innerHTML = item.label;
    link.href = item.value;
    link.target = '_blank';
    link.className = 'links';

    return [link];
  }
  else if (item.type === 'copy') {
    const copyBtn = document.createElement('button');
    copyBtn.innerHTML = item.label;
    copyBtn.className = 'copy-btn';
    copyBtn.onclick = () => { copyToClipboard(item.value); };

    return [copyBtn];
  }
  else if (item.type === 'command') {
    const commandBtn = document.createElement('button');

    commandBtn.innerHTML = item.label;
    commandBtn.className = 'command-btn';
    commandBtn.onclick = () => { executeCommand(item.value.mode, item.value.name, item.value.argsId); };

    if (item.value.argsId) {
      const commandInput = document.createElement('input');
      commandInput.id = item.value.argsId;
      commandInput.type = 'text';
      commandInput.placeholder = item.value.name + ' arguments...';

      return [commandBtn, commandInput];
    }

    return [commandBtn];
  }
  else if (item.type === 'timer') {
    const timerDiv = document.createElement('div');
    const labelSpan = document.createElement('span');
    const timerSpan = document.createElement('span');

    timerDiv.className = 'timer-cell';
    labelSpan.innerHTML = item.label;
    timerSpan.setAttribute('data-date', item.value);

    timerDiv.appendChild(labelSpan);
    timerDiv.appendChild(timerSpan);

    return [timerDiv];
  } else if (item.type === 'group') {

    return item.value.map(groupItem => createElement(groupItem)).reduce((current, total) => total.concat(current), []);
  }
};

const createListEntry = (listEntry) => {
  const listTitle = document.createElement('div');
  listTitle.innerHTML = listEntry.listTitle;
  listTitle.className = 'clipboard-header';
  const listContent = document.createElement('div');
  listContent.id = listEntry.listId;
  listContent.className = 'list-content';

  listEntry.listData.map(item => {
    const childElements = createElement(item);
    const listDiv = document.createElement('div');
    listDiv.classList.add('clipboard-cell');

    childElements.forEach(element => {
      listDiv.appendChild(element);
    });

    listContent.appendChild(listDiv);
  });

  return { listTitle, listContent };
};

const createListEntries = (entries) => {
  const main = document.getElementById('main');

  const section = document.createElement('section');
  const title = document.createElement('h2');
  const sectionContent = document.createElement('div');

  title.className = 'section-title';
  title.innerHTML = entries.sectionTitle;
  sectionContent.className = 'section-content';

  section.appendChild(title);

  entries.sectionData.forEach(entry => {
    const listContainer = document.createElement('div');

    listContainer.className = 'list-group';

    const list = createListEntry(entry);
    listContainer.appendChild(list.listTitle);
    listContainer.appendChild(list.listContent);

    sectionContent.appendChild(listContainer);
  });

  section.appendChild(sectionContent);
  main.appendChild(section);
};