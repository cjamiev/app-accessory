const HEADERS = {
  Accept: 'application/json',
  'Content-Type': 'application/json'
};

const api = {
  post: (url, payload, options = {}) => {
    return fetch(url, {
      headers: options.headers || HEADERS,
      body: JSON.stringify(payload),
      method: 'POST',
      crossDomain: options.crossDomain || false
    })
      .then((resp) => {
        return options.sendFullResponse ? { response: resp, promise: resp.json() } : resp.json();
      })
      .catch((error) => console.log('error:', error));
  },
  get: (url, options = {}) => {
    return fetch(url, {
      headers: options.headers || HEADERS,
      method: 'GET',
      crossDomain: options.crossDomain || false
    })
      .then((resp) => {
        return options.sendFullResponse ? { response: resp, promise: resp.json() } : resp.json();
      })
      .catch((error) => console.log('error:', error));
  }
};

const executeCommand = (mode = 'simple', filename, inputEl) => {
  const args = inputEl && document.getElementById(inputEl).value;
  const url = `/command?mode=${mode}&file=${filename}&args=${args}`;

  return fetch(url, {
    method: 'GET',
    headers: HEADERS
  })
    .then((response) => response.json())
    .then((result) => {
      if (mode === 'simple') {
        const responseDiv = document.getElementById('response');
        const responseElements = [...document.getElementsByClassName('card-text')];
        responseElements.forEach((el) => {
          responseDiv.removeChild(el);
        });

        if (typeof result.message === 'string') {
          const lines = result.message
            .replace('\r', '')
            .split('\n')
            .filter((line) => line);
          lines.forEach((line) => {
            const p = document.createElement('p');
            p.textContent = line;
            p.classList.add('card-text');

            responseDiv.appendChild(p);
          });
        } else {
          const p = document.createElement('p');
          p.textContent = JSON.stringify(result.message);
          p.classList.add('card-text');

          responseDiv.appendChild(p);
        }
      }
    })
    .catch((error) => console.log('error:', error));
};
