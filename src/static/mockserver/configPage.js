const DELAY_ERROR = 'Delay must be a valid number (milliseconds)';
const OVERRIDE_RESPONSE_ERROR = 'Override Response Body must be valid JSON';

const DELAY_ONE_SECOND = 250;

const setConfigHTML = (data) => {
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
  fetch('/api/mockserver/config')
    .then((resp) => resp.json())
    .then((result) => {
      setConfigHTML(result.data);
    })
    .catch(() => {});
};

const updateConfiguration = () => {
  const delay = getNumberValue('payload-config-delay');
  const delayUrls = getArrayFromCommaSeparatedValue('payload-config-delayUrls');
  const log = getRadioButtonValue('payload-config-log');
  const error = getRadioButtonValue('payload-config-error');
  const overrideUrls = getArrayFromCommaSeparatedValue('payload-config-overrideUrls');
  const overrideStatusCode = getNumberValue('payload-config-overrideStatusCode');
  const overrideResponse = parseJSONObject(document.getElementById('payload-config-overrideResponse').value);

  const payload = {
    delay,
    delayUrls,
    log,
    error,
    overrideUrls,
    overrideStatusCode,
    overrideResponse
  };

  const delayError = isNumber(delay) ? '' : DELAY_ERROR;
  const overrideResponseError = isValidJSONObject(JSON.stringify(overrideResponse)) ? '' : OVERRIDE_RESPONSE_ERROR;

  if (delayError || overrideResponseError) {
    document.getElementById('payload-config-message').textContent =
      'ERRORS:' + ' ' + delayError + ' ' + overrideResponseError;
  } else {
    fetch('/api/mockserver/config', {
      headers: {
        Accept: 'application/json',
        'Content-Type': 'application/json'
      },
      body: JSON.stringify(payload),
      method: 'POST'
    })
      .then((resp) => resp.json())
      .then((result) => {
        setTimeout(loadConfiguration(), DELAY_ONE_SECOND);
        document.getElementById('payload-config-message').textContent = result.message;
      })
      .catch((err) => {
        document.getElementById('payload-config-message').textContent = err.message;
      });
  }
};

loadConfiguration();
