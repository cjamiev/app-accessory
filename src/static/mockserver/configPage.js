const PORT_ERROR = 'Port must be a valid number';
const DELAY_ERROR = 'Delay must be a valid number (milliseconds)';
const OVERRIDE_RESPONSE_ERROR = 'Override Response Body must be valid JSON';

const DELAY_ONE_SECOND = 1000;

const validateOverrideResponse = () => {
  document.getElementById('payload-config-message').innerHTML = '';
  validateJSON('payload-config-overrideResponse', 'payload-config-message', 'Override Response Body');
};

const setConfigHTML = (data) => {
  document.getElementById('payload-config-port').value = data.port;
  document.getElementById('payload-config-delay').value = data.delay;
  document.getElementById('payload-config-delayUrls').value = data.delayUrls;
  if (data.log) {
    document.getElementById('payload-config-log-true').checked = true;
  } else {
    document.getElementById('payload-config-log-false').checked = true;
  }
  if (data.error) {
    document.getElementById('payload-config-error-true').checked = true;
  } else {
    document.getElementById('payload-config-error-false').checked = true;
  }
  document.getElementById('payload-config-overrideUrls').value = data.overrideUrls;
  document.getElementById('payload-config-overrideStatusCode').value = data.overrideStatusCode;
  document.getElementById('payload-config-overrideResponse').value = JSON.stringify(data.overrideResponse);
};

const loadConfiguration = () => {
  fetch('/config')
    .then(resp => resp.json())
    .then(data => {
      setConfigHTML(data);
    })
    .catch(() => {
    });
};

const updateConfiguration = () => {
  const port = getNumberValue('payload-config-port');
  const delay = getNumberValue('payload-config-delay');
  const delayUrls = getArrayFromCommaSeparatedValue('payload-config-delayUrls');
  const log = getRadioButtonValue('payload-config-log');
  const error = getRadioButtonValue('payload-config-error');
  const overrideUrls = getArrayFromCommaSeparatedValue('payload-config-overrideUrls');
  const overrideStatusCode = getNumberValue('payload-config-overrideStatusCode');
  const overrideResponse = parseJSONObject(document.getElementById('payload-config-overrideResponse').value);

  const payload = {
    port,
    delay,
    delayUrls,
    log,
    error,
    overrideUrls,
    overrideStatusCode,
    overrideResponse
  };

  const portError = isNumber(port) ? '' : PORT_ERROR;
  const delayError = isNumber(delay) ? '' : DELAY_ERROR;
  const overrideResponseError = isValidJSONObject(JSON.stringify(overrideResponse)) ? '' : OVERRIDE_RESPONSE_ERROR;

  if (portError || delayError || overrideResponseError) {
    document.getElementById('payload-config-message').innerHTML = 'ERRORS:' + portError + ' ' + delayError + ' ' + overrideResponseError;
  } else {
    fetch('/config', {
      headers: {
        'Accept': 'application/json',
        'Content-Type': 'application/json'
      },
      body: JSON.stringify(payload),
      method: 'POST'
    })
      .then(resp => resp.json())
      .then(data => {
        setTimeout(loadConfiguration(), DELAY_ONE_SECOND);
        document.getElementById('payload-config-message').innerHTML = data.message;
      })
      .catch(err => {
        document.getElementById('payload-config-message').innerHTML = err.message;
      });
  }
};

loadConfiguration();