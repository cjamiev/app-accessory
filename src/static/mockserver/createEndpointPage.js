const MODE_RAW_TEXT = 'Raw Text Mode';
const MODE_FORM_TEXT = 'Form Mode';
const FILENAME_ERROR = 'File name is required';
const REQUEST_ERROR = 'Request url and method are required';
const CONTENT_ERROR = 'Content must be valid JSON format and must contain request and response keys';
const HEADERS_ERROR = 'Headers must be valid JSON format';
const BODY_ERROR = 'Body must be valid JSON format';
const CONDITIONAL_RESPONSE_ERROR = 'Conditional Response must be valid JSON format';
const STATUS_ERROR = 'Status must be valid number';
const DEFAULT_MOCK_DATA = {
  request: {
    url: '/test',
    method: 'GET'
  },
  response: {
    headers: {
      Accept: 'application/json',
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

const onLoad = (content) => {
  document.getElementById('payload-create-endpoint-content').value = JSON.stringify(content, undefined, 2);
  document.getElementById('payload-create-endpoint-url').value = content.request.url;
  document.getElementById('payload-create-endpoint-response-headers').value = JSON.stringify(
    content.response.headers,
    undefined,
    2
  );
  document.getElementById('payload-create-endpoint-response-body').value = JSON.stringify(
    content.response.body,
    undefined,
    2
  );
  document.getElementById('payload-create-endpoint-conditional-response-body').value = JSON.stringify(
    content.response.conditionalResponse,
    undefined,
    2
  );
};

const switchMode = () => {
  const modeEl = document.getElementById('payload-mode');
  const mode = modeEl.textContent;
  const updatedMode = mode === MODE_RAW_TEXT ? MODE_FORM_TEXT : MODE_RAW_TEXT;
  const content = getUserInput(mode);

  modeEl.textContent = updatedMode;
  onLoad(content);
  document.getElementById('payload-create-content-container').classList.toggle('hide');
  document.getElementById('payload-create-content-container').classList.toggle('show');
  document.getElementById('payload-create-form-container').classList.toggle('hide');
  document.getElementById('payload-create-form-container').classList.toggle('show');
};

const getUserInput = (mode) => {
  if (mode === 'Raw Text Mode') {
    return parseJSONObject(document.getElementById('payload-create-endpoint-content').value);
  } else {
    const url = document.getElementById('payload-create-endpoint-url').value;
    const method = getSelectDropdownValue('payload-create-endpoint-method');
    const headers = parseJSONObject(document.getElementById('payload-create-endpoint-response-headers').value);
    const status = Number(getSelectDropdownValue('payload-create-endpoint-response-status-code'));
    const body = parseJSONObject(document.getElementById('payload-create-endpoint-response-body').value);
    const conditionalResponse = parseJSONObject(
      document.getElementById('payload-create-endpoint-conditional-response-body').value
    );

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

const checkResponseErrors = (response) => {
  const statusError = isNumber(response.status) ? '' : STATUS_ERROR;
  const headersError = isValidJSONObject(JSON.stringify(response.headers)) ? '' : HEADERS_ERROR;
  const bodyError = isValidJSONObject(JSON.stringify(response.body)) ? '' : BODY_ERROR;
  const conditionalResponseError = isValidJSONObject(JSON.stringify(response.conditionalResponse))
    ? ''
    : CONDITIONAL_RESPONSE_ERROR;

  return statusError + ' ' + headersError + ' ' + bodyError + ' ' + conditionalResponseError;
};

const checkErrors = (content) => {
  const contentError = isValidJSONObject(JSON.stringify(content)) ? '' : CONTENT_ERROR;
  if (contentError || !content.request || !content.response) {
    return contentError;
  } else if (!content.request.url || !content.request.method) {
    return REQUEST_ERROR;
  } else {
    return checkResponseErrors(content.response);
  }
};

const createMockEndpoint = () => {
  const name = document.getElementById('payload-create-endpoint-file-name').value;
  const mode = document.getElementById('payload-mode').textContent;
  const content = getUserInput(mode);
  const error = checkErrors(content);

  if (error.replace(/ /g, '')) {
    document.getElementById('payload-create-endpoint-message').textContent = error;
  } else {
    const cleanedUrl = content.request.url.replace(/[<>://\\|?*]/g, '-');
    const urlError = content.request.url ? '' : URL_ERROR;
    const filename = name ? name : `${content.request.method}-${cleanedUrl}.json`;

    const payload = {
      filename,
      content
    };

    fetch('/api/mockserver/createMockEndpoint', {
      headers: {
        Accept: 'application/json',
        'Content-Type': 'application/json'
      },
      body: JSON.stringify(payload),
      method: 'POST'
    })
      .then((resp) => resp.json())
      .then((data) => {
        setOutput({ message: data.message || 'Successfully created endpoint', error: data.error });
      })
      .catch((err) => {
        setOutput({ message: err.message, error: true });
      });
  }
};

onLoad(DEFAULT_MOCK_DATA);
