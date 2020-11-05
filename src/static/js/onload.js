setInterval(() => {
  countdown();
  const displayTime = getCurrentClock();
  document.getElementById('current-clock').innerHTML = displayTime;
}, 1000);

const today = new Date();
const displayDate = dayOfWeek[today.getDay()] + ', ' + months[today.getMonth()] + ' ' + today.getDate();
document.getElementById('current-date').innerHTML = displayDate;
document.getElementById('current-week').innerHTML = 'Week ' + (1 + weeksBetween(new Date(2020, 0, 1, 0, 0, 0), new Date()));