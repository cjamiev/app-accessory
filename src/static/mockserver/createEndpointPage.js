const MODE_RAW_TEXT = 'Raw Text Mode';
const MODE_FORM_TEXT = 'Form Mode';
const FILENAME_ERROR = 'File name is required';
const URL_ERROR = 'Url is required';
const HEADERS_ERROR = 'Headers must be valid JSON format';
const BODY_ERROR = 'BODY must be valid JSON format';
const DEFAULT_MOCK_DATA = {
  request: {
    url: '/test',
    method: 'GET'
  },
  response: {
    headers: {
      'Content-Type': 'application/json'
    },
    status: 200,
    body: {
      test: 'testing post'
    },
    conditionalResponse: [
      {
        payload: {
          key: 'condition'
        },
        body: {
          test: 'testing conditional post'
        }
      }
    ]
  }
};

const onLoad = () => {
  document.getElementById('payload-create-endpoint-content').value = JSON.stringify(DEFAULT_MOCK_DATA, undefined, 2);
  document.getElementById('payload-create-endpoint-url').value = DEFAULT_MOCK_DATA.request.url;
  document.getElementById('payload-create-endpoint-response-headers').value = JSON.stringify(DEFAULT_MOCK_DATA.response.headers);
  document.getElementById('payload-create-endpoint-response-body').value = JSON.stringify(DEFAULT_MOCK_DATA.response.body, undefined, 2);
  document.getElementById('payload-create-endpoint-conditional-response-body').value = JSON.stringify(DEFAULT_MOCK_DATA.response.conditionalResponse, undefined, 2);
};

const switchMode = () => {
  const modeEl = document.getElementById('payload-mode');
  const mode = modeEl.innerHTML;
  if(mode === MODE_RAW_TEXT){
    modeEl.innerHTML = MODE_FORM_TEXT;
    document.getElementById('payload-create-content-container').className = 'hide';
    document.getElementById('payload-create-form-container').className = 'show';
  }
  else {
    modeEl.innerHTML = MODE_RAW_TEXT;
    document.getElementById('payload-create-content-container').className = 'show';
    document.getElementById('payload-create-form-container').className = 'hide';
  }
};

const getUserInput = () => {
  const mode = document.getElementById('payload-mode').innerHTML;
  if(mode === 'Raw Text Mode') {
    return parseJSONObject(document.getElementById('payload-create-endpoint-content').value);
  } else {
    const url = document.getElementById('payload-create-endpoint-url').value;
    const method = getSelectDropdownValue('payload-create-endpoint-method');
    const headers = parseJSONObject(document.getElementById('payload-create-endpoint-response-headers').value);
    const status = Number(getSelectDropdownValue('payload-create-endpoint-response-status-code'));
    const body = parseJSONObject(document.getElementById('payload-create-endpoint-response-body').value);
    const conditionalResponse = parseJSONObject(document.getElementById('payload-create-endpoint-conditional-response-body').value);

    return {
      request: {
        url,
        method
      },
      response: {
        headers,
        status,
        body,
        conditionalResponse
      }
    };
  }
};

const createMockEndpoint = () => {
  const name = document.getElementById('payload-create-endpoint-file-name').value;
  const content = getUserInput();
  const cleanedUrl = content.request.url.replace(/[<>://\\|?*]/g,'-');
  const filename = name ? name : `${content.request.method}-${cleanedUrl}.json`;

  const payload = {
    filename,
    content
  };

  const urlError = content.request.url ? '' : URL_ERROR;
  const headersError = isValidJSONObject(JSON.stringify(content.response.headers)) ? '' : HEADERS_ERROR;
  const bodyError = isValidJSONObject(JSON.stringify(content.response.body)) ? '' : BODY_ERROR;

  if (urlError || headersError || bodyError) {
    document.getElementById('payload-create-endpoint-message').innerHTML = 'ERRORS:' + urlError + ' ' + headersError + ' ' + bodyError;
  } else {
    fetch('/api/mockserver/createMockEndpoint', {
      headers: {
        'Accept': 'application/json',
        'Content-Type': 'application/json'
      },
      body: JSON.stringify(payload),
      method: 'POST'
    })
      .then(resp => resp.json())
      .then(data => {
        document.getElementById('payload-create-endpoint-message').innerHTML = data.message || 'Successfully created endpoint';
      })
      .catch(err => {
        document.getElementById('payload-create-endpoint-message').innerHTML = err.message;
      });
  }
};

onLoad();