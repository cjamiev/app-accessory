setInterval(() => {
  countdown();
  const displayTime = getCurrentClock();
  document.getElementById('current-clock').innerHTML = displayTime;
}, 1000);

const today = new Date();
const newYears = new Date(today.getFullYear(), 0, 1, 0, 0, 0);
const firstWeekPartial = newYears.getDay() / 7 + 1.01;

const displayDate = dayOfWeek[today.getDay()] + ', ' + months[today.getMonth()].slice(0, 3) + ' ' + today.getDate();
document.getElementById('current-date').innerHTML = displayDate;
document.getElementById('current-week').innerHTML =
  'Week ' + Math.trunc(firstWeekPartial + weeksBetween(newYears, today));
