const FILENAME_ERROR = 'File name is required';
const URL_ERROR = 'Url is required';
const HEADERS_ERROR = 'Headers must be valid JSON format';
const BODY_ERROR = 'BODY must be valid JSON format';

const validateResponseBody = () => {
  document.getElementById('payload-create-endpoint-message').innerHTML = '';
  validateJSON('payload-create-endpoint-response-headers', 'payload-create-endpoint-message', 'Response Headers');
  validateJSON('payload-create-endpoint-response-body', 'payload-create-endpoint-message', 'Response Body');
};

const createMockEndpoint = () => {
  const filename = document.getElementById('payload-create-endpoint-file-name').value;
  const foldername = document.getElementById('payload-create-endpoint-folder-name').value;
  const url = document.getElementById('payload-create-endpoint-url').value;
  const method = getSelectDropdownValue('payload-create-endpoint-method');
  const headers = parseJSONObject(document.getElementById('payload-create-endpoint-response-headers').value);
  const status = Number(getSelectDropdownValue('payload-create-endpoint-response-status-code'));
  const body = parseJSONObject(document.getElementById('payload-create-endpoint-response-body').value);

  const payload = {
    filename,
    foldername,
    content: {
      request: {
        url,
        method
      },
      response: {
        headers,
        status,
        body
      }
    }
  };

  const filenameError = !filename ? FILENAME_ERROR : '';
  const urlError = url ? '' : URL_ERROR;
  const headersError = isValidJSONObject(JSON.stringify(headers)) ? '' : HEADERS_ERROR;
  const bodyError = isValidJSONObject(JSON.stringify(body)) ? '' : BODY_ERROR;

  if (filenameError || urlError || headersError || bodyError) {
    document.getElementById('payload-create-endpoint-message').innerHTML = 'ERRORS:' + filenameError + ' ' + urlError + ' ' + headersError + ' ' + bodyError;
  } else {
    fetch('/createMockEndpoint', {
      headers: {
        'Accept': 'application/json',
        'Content-Type': 'application/json'
      },
      body: JSON.stringify(payload),
      method: 'POST'
    })
      .then(resp => resp.json())
      .then(data => {
        document.getElementById('payload-create-endpoint-message').innerHTML = data.message;
      })
      .catch(err => {
        document.getElementById('payload-create-endpoint-message').innerHTML = err.message;
      });
  }
};