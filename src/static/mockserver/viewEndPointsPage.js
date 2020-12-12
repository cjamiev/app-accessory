const RESPONSE_ERROR = 'Response must be valid JSON format';

const viewDetails = (item) => {
  return () => {
    document.getElementById('view-response-details').textContent = JSON.stringify(item, undefined, 2);
  };
};

const loadResponse = ({ method, url, responsePath }) => {
  return () => {
    fetch('/api/mockserver/loadMockResponse', {
      headers: {
        Accept: 'application/json',
        'Content-Type': 'application/json'
      },
      body: JSON.stringify({ responsePath }),
      method: 'POST'
    })
      .then((resp) => resp.json())
      .then((mockResponse) => {
        const viewResponseDetails = document.getElementById('view-response-details');
        viewResponseDetails.value = JSON.stringify(mockResponse.data, undefined, 2);
        viewResponseDetails.setAttribute('data-method-url', JSON.stringify({ method, url }));
        document.getElementById('view-endpoints-message').textContent = '';
      });
  };
};

const updateEndpoint = () => {
  const viewResponseDetails = document.getElementById('view-response-details');
  const response = parseJSONObject(viewResponseDetails.value);
  const request = parseJSONObject(viewResponseDetails.getAttribute('data-method-url'));

  const responseError = isValidJSONObject(JSON.stringify(response)) ? '' : RESPONSE_ERROR;

  const payload = {
    content: {
      request,
      response
    }
  };

  if (responseError) {
    document.getElementById('view-endpoints-message').textContent = responseError;
  } else {
    fetch('/api/mockserver/updateMockEndpoint', {
      headers: {
        Accept: 'application/json',
        'Content-Type': 'application/json'
      },
      body: JSON.stringify(payload),
      method: 'POST'
    })
      .then((resp) => resp.json())
      .then((data) => {
        setOutput({ message: data.message || 'Successfully updated endpoint', error: data.error });
      })
      .catch((err) => {
        setOutput({ message: err.message, error: true });
      });
  }
};

const createRow = ({ method, url, responsePath }) => {
  const tr = document.createElement('tr');
  const methodCell = document.createElement('td');
  const urlCell = document.createElement('td');
  const detailsCell = document.createElement('td');

  methodCell.textContent = method || 'none';
  if (method.toUpperCase() === 'GET') {
    const methodLink = document.createElement('a');
    const linkText = document.createTextNode(url);
    methodLink.href = url;
    methodLink.target = '_blank';
    methodLink.appendChild(linkText);
    urlCell.appendChild(methodLink);
  } else {
    urlCell.textContent = url || 'none';
  }
  if (responsePath) {
    const viewObjectButton = document.createElement('button');
    viewObjectButton.textContent = 'Load';
    viewObjectButton.onclick = loadResponse({ method, url, responsePath });
    viewObjectButton.className = 'btns';
    detailsCell.appendChild(viewObjectButton);
  }

  const viewObjectButton = document.createElement('button');
  viewObjectButton.textContent = 'Delete';
  viewObjectButton.onclick = deleteEndpoint({ method, url, responsePath });
  viewObjectButton.className = 'btns';
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

  data.forEach((entry) => {
    const newRow = createRow(entry);
    tableBody.appendChild(newRow);
  });
};

const filterTableBySearch = () => {
  const filterBy = document.getElementById('view-endpoints-filter').value;
  const mockContent = JSON.parse(sessionStorage.getItem('mockContent'));

  const filteredMockContent = mockContent.filter((entry) => entry.url.includes(filterBy));

  deleteAllChildren(document.getElementById('view-endpoints-body'));
  setTableHTML(filteredMockContent);
};

const loadEndpoints = () => {
  fetch('/api/mockserver/mockRequests')
    .then((resp) => resp.json())
    .then((mockContent) => {
      sessionStorage.setItem('mockContent', JSON.stringify(mockContent.data));
      setTableHTML(mockContent.data);
    });
};

const deleteEndpoint = (endpoint) => {
  return () => {
    fetch('/api/mockserver/deleteMockEndpoint', {
      headers: {
        Accept: 'application/json',
        'Content-Type': 'application/json'
      },
      body: JSON.stringify(endpoint),
      method: 'POST'
    })
      .then((resp) => resp.json())
      .then((data) => {
        setOutput({ message: data.message || 'Successfully deleted endpoint', error: data.error });
        deleteAllChildren(document.getElementById('view-endpoints-body'));
        loadEndpoints();
      });
  };
};

loadEndpoints();
