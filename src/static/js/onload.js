getAllFiles();
setInterval(countdown, 1000);
loadItems();

const months = ['January', 'February', 'March', 'April', 'May', 'June', 'July', 'August', 'September', 'October', 'November', 'December'];
const dayOfWeek = ['Sunday', 'Monday', 'Tuesday', 'Wednesday', 'Thursday', 'Friday', 'Saturday'];

setInterval(() => {
  const now = new Date();
  const amOrpm = now.getHours() > 12 ? 'PM' : 'AM';
  const minutes = now.getMinutes() > 9 ? now.getMinutes() : '0' + now.getMinutes();
  const seconds = now.getSeconds() > 9 ? now.getSeconds() : '0' + now.getSeconds();
  const hours = now.getHours() > 9 ? now.getHours() % 12 : '0' + now.getHours();
  const displayTime = hours + ':' + minutes + ':' + seconds + ' ' + amOrpm;
  document.getElementById('current-clock').innerHTML = displayTime;
}, 1000);
const today = new Date();
const displayDate = dayOfWeek[today.getDay()] + ', ' + months[today.getMonth()] + ' ' + today.getDate() + ', ' + today.getFullYear();
document.getElementById('current-date').innerHTML = displayDate;