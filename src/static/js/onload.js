setInterval(() => {
  countdown();
  const displayTime = getCurrentClock();
  document.getElementById('current-clock').innerHTML = displayTime;
}, 1000);

const today = new Date();
const displayDate = dayOfWeek[today.getDay()] + ', ' + months[today.getMonth()] + ' ' + today.getDate();
document.getElementById('current-date').innerHTML = displayDate;