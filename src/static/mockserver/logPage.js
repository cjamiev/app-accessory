const viewDetails = item => {
  return () => {
    document.getElementById('log-payload-details').innerHTML = JSON.stringify(item, undefined, 2);
  };
};

const createRow = entry => {
  const tr = document.createElement('tr');
  const keys = Object.keys(entry);

  keys.forEach(item => {
    const value = entry[item];
    if (typeof value === 'object') {
      const viewObjectButton = document.createElement('button');
      viewObjectButton.innerHTML = 'Click to see value below';
      viewObjectButton.onclick = viewDetails(value);
      const newCell = document.createElement('td');
      newCell.appendChild(viewObjectButton);
      tr.appendChild(newCell);
    } else {
      const newCell = document.createElement('td');
      newCell.innerHTML = value || 'none';
      tr.appendChild(newCell);
    }
  });

  return tr;
};

const setTableHTML = (data) => {
  const tableBody = document.getElementById('log-body');

  data.forEach(entry => {
    const newRow = createRow(entry);
    tableBody.appendChild(newRow);
  });
};

const loadLog = () => {
  fetch('/log')
    .then(resp => resp.json())
    .then(data => {
      setTableHTML(data);
    })
    .catch(() => {
    });
};

const clearLog = () => {
  fetch('/clearLog')
    .then(resp => resp.json())
    .then(data => {
      loadLog();
      location.reload();
    })
    .catch(() => {
    });
};

loadLog();