const switchAPIMethod = () => {
  const apiMethod = document.getElementById('api-method');
  const currentValue = apiMethod.value;
  const updatedValue = currentValue === 'GET' ? 'POST' : 'GET';

  apiMethod.value = updatedValue;
};

const testApi = () => {
  const url = document.getElementById('api-url').value;
  const method = document.getElementById('api-method').value;
  const payload = document.getElementById('api-body').textContent || '{}';

  if (method === 'GET') {
    api.get(url, { sendFullResponse: true }).then(({ promise, response }) => {
      promise.then((res) => {
        document.getElementById('api-response-body').textContent = JSON.stringify(res, null, 2);
      });
      document.getElementById('api-response-headers').textContent = `Status: ${response.status}\nUrl: ${
        response.url
      }\nHeaders: ${JSON.stringify(response.headers)}`;
    });
  } else {
    api.post(url, JSON.parse(payload), { sendFullResponse: true }).then(({ promise, response }) => {
      promise.then((res) => {
        document.getElementById('api-response-body').textContent = JSON.stringify(res, null, 2);
      });
      document.getElementById('api-response-headers').textContent = `Status: ${response.status}\nUrl: ${
        response.url
      }\nHeaders: ${JSON.stringify(response.headers)}`;
    });
  }
};
