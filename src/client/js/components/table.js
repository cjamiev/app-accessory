const createTable = (tableHeader = [], tableBody = []) => {
  const table = document.createElement('table');
  table.className = 'table';
  const thead = document.createElement('thead');
  const headRow = document.createElement('tr');

  tableHeader.forEach(text => {
    const head = document.createElement('th');
    head.innerHTML = text;

    headRow.appendChild(head);
  });
  thead.append(headRow);

  const tbody = document.createElement('tbody');

  tableBody.forEach(row => {
    const bodyRow = document.createElement('tr');

    row.forEach(({ type, onclick, innerHTML }) => {
      const cellParent = document.createElement('td');
      const cell = type === 'button' ? document.createElement('button') : document.createElement('span');
      cell.innerHTML = innerHTML;
      cell.onclick = onclick;

      cellParent.appendChild(cell);
      bodyRow.appendChild(cellParent);
    });

    tbody.appendChild(bodyRow);
  });

  table.appendChild(thead);
  table.appendChild(tbody);

  return table;
};
