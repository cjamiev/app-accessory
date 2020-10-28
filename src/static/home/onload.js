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

const editableElements = document.querySelectorAll('[contenteditable]');
editableElements.forEach(element => {
  element.addEventListener('paste', () => {
    setTimeout(() => {
      const currentContent = element.innerHTML;
      const sanitizedContent = currentContent.replace(/(<([^>]+)>)/ig, '');

      element.innerHTML = sanitizedContent;
    }, 50);
  });
});