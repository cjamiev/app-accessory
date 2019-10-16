const executeCommand = (command, async = false) => {
  const url = async ? '/command-async' : '/command';

  return fetch(url + command, {
    method: 'GET'
  })
    .then(response => response.json())
    .then(result => {
      console.log(result);
      const lines = result.message.replace('\r', '').split('\n').filter(line => line);
      const responseDiv = document.getElementById('response');
      const responseElements = [...document.getElementsByClassName('card-text')];
      responseElements.forEach(el => {
        responseDiv.removeChild(el);
      });

      lines.forEach(line => {
        const p = document.createElement('p');
        p.innerHTML = line;
        p.classList.add('card-text');

        responseDiv.appendChild(p);
      });
    })
    .catch(error => console.log('error:', error));
};

const countdown = () => {
  const timerElements = document.querySelectorAll('[data-date]');
  const today = new Date();

  timerElements.forEach(el => {
    const data = el.getAttribute('data-date').split(',').map(item => Number(item));
    const futureDate = new Date(...data);
    const { weeks, days, hours, minutes, seconds } = clockBetweenDates(futureDate, today);

    if (weeks > 0) {
      el.innerHTML = weeks + ' week(s) and ' + (days + hours / 24).toPrecision(2) + ' day(s)';
    }
    else if (days > 0) {
      el.innerHTML = (days + hours / 24).toPrecision(2) + ' day(s)';
    }
    else {
      el.innerHTML = formattedClock(hours, minutes, seconds);
    }
  });
};

setInterval(countdown, 1000);