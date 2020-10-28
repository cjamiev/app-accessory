getAllFiles();
loadItems();

setInterval(() => {
  countdown();
  const displayTime = getCurrentClock();
  document.getElementById('current-clock').innerHTML = displayTime;
}, 1000);

const today = new Date();
const displayDate = dayOfWeek[today.getDay()] + ', ' + months[today.getMonth()] + ' ' + today.getDate() + ', ' + today.getFullYear();
document.getElementById('current-date').innerHTML = displayDate;

const contentDataEl = document.getElementById('contentData');
contentDataEl.addEventListener('blur', () => {
  contentDataEl.innerHTML = contentDataEl.innerHTML.replace(/(<([^>]+)>)/ig, '') || '{}';
});