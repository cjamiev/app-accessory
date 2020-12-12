const months = [
  'January',
  'February',
  'March',
  'April',
  'May',
  'June',
  'July',
  'August',
  'September',
  'October',
  'November',
  'December'
];
const dayOfWeek = ['Sun', 'Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat'];
const WEEK_IN_MILLISECONDS = 604800000;
const DAY_IN_MILLISECONDS = 86400000;
const HOUR_IN_MILLISECONDS = 3600000;
const MINUTE_IN_MILLISECONDS = 60000;
const SECOND_IN_MILLISECONDS = 1000;
const SIXTY_TIMES_SIXTY = 3600;
const SIXTY = 60;
const HOURS_IN_DAY = 24;
const DOUBLE_DIGIT = 10;
const DAYS_IN_A_WEEK = 7;
const PRECISION_LEVEL = 3;
const DECIMAL_FORMAT = 2;
const ONE = 1;
const ZERO = 0;

const getCurrentClock = () => {
  const now = new Date();
  const amOrpm = now.getHours() > 11 ? 'PM' : 'AM';
  const minutes = now.getMinutes() > 9 ? now.getMinutes() : '0' + now.getMinutes();
  const seconds = now.getSeconds() > 9 ? now.getSeconds() : '0' + now.getSeconds();
  const format12Hour = now.getHours() > 9 ? now.getHours() % 12 : '0' + now.getHours();
  const hours = format12Hour === 0 ? 12 : format12Hour;

  return hours + ':' + minutes + ':' + seconds + ' ' + amOrpm;
};

const secondsToClock = (s) => {
  const hours = Math.floor(s / SIXTY_TIMES_SIXTY);
  const minutes = Math.floor(s / SIXTY) % SIXTY;
  const seconds = s % SIXTY;

  return { hours, minutes, seconds };
};

const minutesToClock = (m) => {
  const hours = Math.floor(m / SIXTY);
  const minutes = m % SIXTY;
  const seconds = ZERO;

  return { hours, minutes, seconds };
};

const normalizeClock = (h = ZERO, m = ZERO, s = ZERO) => {
  const clockFromSeconds = secondsToClock(s);
  const clockFromMinutes = minutesToClock(m + clockFromSeconds.minutes);

  const seconds = clockFromSeconds.seconds;
  const minutes = clockFromMinutes.minutes;
  const hours = h + clockFromMinutes.hours + clockFromSeconds.hours;

  return { hours, minutes, seconds };
};

const getFormattedMinutes = (minutes) => (minutes < DOUBLE_DIGIT ? `:0${minutes}` : `:${minutes}`);

const getFormattedSeconds = (seconds) => (seconds < DOUBLE_DIGIT ? `:0${seconds}` : `:${seconds}`);

const formattedClock = (h = ZERO, m = ZERO, s = ZERO) => {
  const { hours, minutes, seconds } = normalizeClock(h, m, s);

  return `${hours}${getFormattedMinutes(minutes)}${getFormattedSeconds(seconds)}`;
};

const clockBetweenDates = (date1, date2) => {
  const diff = date1.getTime() - date2.getTime();

  if (diff < ZERO) {
    return { hours: ZERO, minutes: ZERO, seconds: ZERO };
  }

  const weeks = Math.floor(diff / WEEK_IN_MILLISECONDS);
  const days = Math.floor((diff - weeks * WEEK_IN_MILLISECONDS) / DAY_IN_MILLISECONDS);
  const hours = Math.floor((diff - weeks * WEEK_IN_MILLISECONDS - days * DAY_IN_MILLISECONDS) / HOUR_IN_MILLISECONDS);
  const minutes = Math.floor(
    (diff - weeks * WEEK_IN_MILLISECONDS - days * DAY_IN_MILLISECONDS - hours * HOUR_IN_MILLISECONDS) /
      MINUTE_IN_MILLISECONDS
  );
  const seconds = Math.floor(
    (diff -
      weeks * WEEK_IN_MILLISECONDS -
      days * DAY_IN_MILLISECONDS -
      hours * HOUR_IN_MILLISECONDS -
      minutes * MINUTE_IN_MILLISECONDS) /
      SECOND_IN_MILLISECONDS
  );

  return { weeks, days, hours, minutes, seconds };
};

const getDateAtSetTime = (date, { hours = ZERO, minutes = ZERO, seconds = ZERO }) => {
  const updatedDate = new Date(date.getTime());
  updatedDate.setHours(hours);
  updatedDate.setMinutes(minutes);
  updatedDate.setSeconds(seconds);
  updatedDate.setMilliseconds(ZERO);

  return updatedDate;
};

const daysBetween = (date1, date2) => {
  const tempDate1 = getDateAtSetTime(date1, {});
  const tempDate2 = getDateAtSetTime(date2, {});
  const numberOfDays = Math.round(Math.abs(tempDate1.getTime() - tempDate2.getTime()) / DAY_IN_MILLISECONDS);

  return isNaN(numberOfDays) ? null : numberOfDays;
};

const weeksBetween = (date1, date2) =>
  parseFloat((daysBetween(date1, date2) / DAYS_IN_A_WEEK).toFixed(PRECISION_LEVEL));

const countdown = () => {
  const timerElements = document.querySelectorAll('[data-date]');
  const today = new Date();

  timerElements.forEach((el) => {
    const data = el.getAttribute('data-date');
    const isStringFormat = data.split(',').length > 2;
    const parsedData = isStringFormat ? data.split(',').map((item) => Number(item)) : data;
    const futureDate = isStringFormat ? new Date(...parsedData) : new Date(parsedData);
    const { weeks, days, hours, minutes, seconds } = clockBetweenDates(futureDate, today);

    if (weeks > ZERO) {
      el.textContent = weeks + ' week(s) and ' + (days + hours / HOURS_IN_DAY).toPrecision(DECIMAL_FORMAT) + ' day(s)';
    } else if (days > ZERO) {
      el.textContent = (days + hours / HOURS_IN_DAY).toPrecision(DECIMAL_FORMAT) + ' day(s)';
    } else if (hours > ZERO || minutes > ZERO || seconds > ZERO) {
      el.textContent = formattedClock(hours, minutes, seconds);
    } else {
      el.className = 'blinking-alert';
      el.textContent = 'DONE!!!';
    }
  });
};

const getCurrentTime = () => {
  const today = new Date();

  return {
    year: today.getFullYear(),
    month: today.getMonth() + ONE,
    date: today.getDate(),
    hour: today.getHours(),
    minute: today.getMinutes(),
    second: today.getSeconds()
  };
};
