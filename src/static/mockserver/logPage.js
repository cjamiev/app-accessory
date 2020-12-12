const viewDetails = (item) => {
  return () => {
    document.getElementById('log-payload-details').textContent = JSON.stringify(item, undefined, 2);
  };
};

const createRow = (entry) => {
  const tr = document.createElement('tr');
  const keys = Object.keys(entry);

  keys.forEach((item) => {
    const value = entry[item];
    if (typeof value === 'object') {
      const viewObjectButton = document.createElement('button');
      viewObjectButton.textContent = 'Load';
      viewObjectButton.onclick = viewDetails(value);
      viewObjectButton.className = 'btns';
      const newCell = document.createElement('td');
      newCell.appendChild(viewObjectButton);
      tr.appendChild(newCell);
    } else {
      const newCell = document.createElement('td');
      newCell.textContent = value || 'none';
      tr.appendChild(newCell);
    }
  });

  return tr;
};

const setTableHTML = (data) => {
  const tableBody = document.getElementById('log-body');

  data.forEach((entry) => {
    const newRow = createRow(entry);
    tableBody.appendChild(newRow);
  });
};

const loadLog = () => {
  fetch('/api/mockserver/loadLog')
    .then((resp) => resp.json())
    .then((result) => {
      setTableHTML(result.data);
    })
    .catch(() => {});
};

const clearLog = () => {
  fetch('/api/mockserver/clearLog')
    .then((resp) => resp.json())
    .then((data) => {
      loadLog();
      location.reload();
    })
    .catch(() => {});
};

loadLog();
