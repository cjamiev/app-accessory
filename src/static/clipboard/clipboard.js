const createElement = (item) => {
  if (item.type === 'link') {
    const link = document.createElement('a');
    link.textContent = item.label;
    link.href = item.value;
    link.target = '_blank';
    link.className = 'links flex-item';

    return [link];
  } else if (item.type === 'copy') {
    const copyBtn = document.createElement('button');
    copyBtn.textContent = item.label;
    copyBtn.className = 'copy-btn flex-item';
    copyBtn.onclick = () => {
      copyToClipboard(item.value);
    };

    return [copyBtn];
  } else if (item.type === 'command') {
    const commandBtn = document.createElement('button');

    commandBtn.textContent = item.label;
    commandBtn.className = 'command-btn flex-item';
    commandBtn.onclick = () => {
      executeCommand(item.value.mode, item.value.name, item.value.argsId);
    };

    if (item.value.argsId) {
      const commandInput = document.createElement('input');
      commandInput.id = item.value.argsId;
      commandInput.type = 'text';
      commandInput.className = 'flex-item';
      commandInput.placeholder = 'Enter arguments...';

      return [commandInput, commandBtn];
    }

    return [commandBtn];
  } else if (item.type === 'timer') {
    const timerDiv = document.createElement('div');
    const labelSpan = document.createElement('span');
    const timerSpan = document.createElement('span');

    timerDiv.className = 'timer-cell  flex-item';
    labelSpan.textContent = item.label;
    timerSpan.setAttribute('data-date', item.value);
    timerSpan.textContent = 'Loading...';

    timerDiv.appendChild(labelSpan);
    timerDiv.appendChild(timerSpan);

    return [timerDiv];
  } else if (item.type === 'text') {
    const labelSpan = document.createElement('span');
    labelSpan.textContent = item.label;

    return [labelSpan];
  } else if (item.type === 'group') {
    return item.value
      .map((groupItem) => createElement(groupItem))
      .reduce((current, total) => total.concat(current), []);
  }
};

const createListEntry = (listEntry) => {
  const listTitle = document.createElement('div');
  listTitle.textContent = listEntry.listTitle;
  listTitle.className = 'clipboard-header';
  const listContent = document.createElement('div');
  listContent.id = listEntry.listId;
  listContent.className = 'list-content';

  listEntry.listData.forEach((item) => {
    const childElements = createElement(item);
    const listDiv = document.createElement('div');
    listDiv.classList.add('clipboard-cell');

    childElements.forEach((element) => {
      listDiv.prepend(element);
    });

    listContent.appendChild(listDiv);
  });

  return { listTitle, listContent };
};

const createListEntries = (entries) => {
  const main = document.getElementById('main-content');

  const section = document.createElement('section');
  const sectionContent = document.createElement('div');

  sectionContent.className = 'section-content';

  if (entries.sectionTitle) {
    const title = document.createElement('h2');
    title.className = 'section-title';
    title.textContent = entries.sectionTitle;

    section.appendChild(title);
  }

  entries.sectionData.forEach((entry) => {
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

api.get('/clipboard-config').then((result) => {
  result.data.forEach((sectionData) => {
    createListEntries(JSON.parse(sectionData));
  });
});
