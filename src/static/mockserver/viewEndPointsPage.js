const viewDetails = item => {
  return () => {
    document.getElementById('view-response-details').innerHTML = JSON.stringify(item, undefined, 2);
  };
};

const loadResponse = responsePath => {
  return () => {
    fetch('/loadMockResponse', {
      headers: {
        'Accept': 'application/json',
        'Content-Type': 'application/json'
      },
      body: JSON.stringify({ responsePath }),
      method: 'POST'
    })
      .then(resp => resp.json())
      .then(mockResponse => {
        document.getElementById('view-response-details').innerHTML = JSON.stringify(mockResponse, undefined, 2);
      });
  };
};

const createRow = ({ method, url, responsePath }) => {
  const tr = document.createElement('tr');
  const methodCell = document.createElement('td');
  const urlCell = document.createElement('td');
  const detailsCell = document.createElement('td');

  methodCell.innerHTML = method || 'none';
  if (method.toUpperCase() === 'GET') {
    const methodLink = document.createElement('a');
    const linkText = document.createTextNode(url);
    methodLink.href = url;
    methodLink.target = '_blank';
    methodLink.appendChild(linkText);
    urlCell.appendChild(methodLink);
  } else {
    urlCell.innerHTML = url || 'none';
  }
  if (responsePath) {
    const viewObjectButton = document.createElement('button');
    viewObjectButton.innerHTML = 'Load Response';
    viewObjectButton.onclick = loadResponse(responsePath);
    detailsCell.appendChild(viewObjectButton);
  }

  const viewObjectButton = document.createElement('button');
  viewObjectButton.innerHTML = 'Delete Entry';
  viewObjectButton.onclick = deleteEndpoint({ method, url, responsePath });
  detailsCell.appendChild(viewObjectButton);

  tr.appendChild(methodCell);
  tr.appendChild(urlCell);
  tr.appendChild(detailsCell);

  return tr;
};

const setTableHTML = (data) => {
  const tableBody = document.getElementById('view-endpoints-body');

  data.sort((a, b) => {
    if (a.url > b.url) {
      return 1;
    }
    if (b.url > a.url) {
      return -1;
    }
    return 0;
  });

  data.forEach(entry => {
    const newRow = createRow(entry);
    tableBody.appendChild(newRow);
  });
};

const filterTableBySearch = () => {
  const filterBy = document.getElementById('view-endpoints-filter').value;
  const mockContent = JSON.parse(sessionStorage.getItem('mockContent'));

  const filteredMockContent = mockContent.filter(entry => entry.url.includes(filterBy));

  deleteAllChildren(document.getElementById('view-endpoints-body'));
  setTableHTML(filteredMockContent);
};

const loadEndpoints = () => {
  fetch('/mockRequests')
    .then(resp => resp.json())
    .then(mockContent => {
      sessionStorage.setItem('mockContent', JSON.stringify(mockContent));
      setTableHTML(mockContent);
    });
};

const deleteEndpoint = (endpoint) => {
  return () => {
    fetch('/deleteMockEndpoint', {
      headers: {
        'Accept': 'application/json',
        'Content-Type': 'application/json'
      },
      body: JSON.stringify(endpoint),
      method: 'POST'
    })
      .then(resp => resp.json())
      .then(response => {
        document.getElementById('view-endpoints-message').innerHTML = response.message;
        deleteAllChildren(document.getElementById('view-endpoints-body'));
        loadEndpoints();
      });
  };
};

loadEndpoints();