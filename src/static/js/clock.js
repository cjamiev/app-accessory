const WEEK_IN_MILLISECONDS = 604800000;
const DAY_IN_MILLISECONDS = 86400000;
const HOUR_IN_MILLISECONDS = 3600000;
const MINUTE_IN_MILLISECONDS = 60000;
const SECOND_IN_MILLISECONDS = 1000;
const SIXTY_TIMES_SIXTY = 3600;
const SIXTY = 60;
const DOUBLE_DIGIT = 10;
const ZERO = 0;

const secondsToClock = s => {
  const hours = Math.floor(s / SIXTY_TIMES_SIXTY);
  const minutes = Math.floor(s / SIXTY) % SIXTY;
  const seconds = s % SIXTY;

  return { hours, minutes, seconds };
};

const minutesToClock = m => {
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

const getFormattedMinutes = minutes => (minutes < DOUBLE_DIGIT ? `:0${minutes}` : `:${minutes}`);

const getFormattedSeconds = seconds => (seconds < DOUBLE_DIGIT ? `:0${seconds}` : `:${seconds}`);

const formattedClock = (h = ZERO, m = ZERO, s = ZERO) => {
  const { hours, minutes, seconds } = normalizeClock(h, m, s);

  return `${hours}${getFormattedMinutes(minutes)}${getFormattedSeconds(seconds)}`;
};

const clockBetweenDates = (date1, date2) => {
  const diff = date1.getTime() - date2.getTime();

  if (diff < 0) {
    return { hours: 0, minutes: 0, seconds: 0 };
  }

  const weeks = Math.floor(diff / WEEK_IN_MILLISECONDS);
  const days = Math.floor((diff - weeks * WEEK_IN_MILLISECONDS) / DAY_IN_MILLISECONDS);
  const hours = Math.floor((diff - weeks * WEEK_IN_MILLISECONDS - days * DAY_IN_MILLISECONDS) / HOUR_IN_MILLISECONDS);
  const minutes = Math.floor((diff - weeks * WEEK_IN_MILLISECONDS - days * DAY_IN_MILLISECONDS - hours * HOUR_IN_MILLISECONDS) / MINUTE_IN_MILLISECONDS);
  const seconds = Math.floor(
    (diff - weeks * WEEK_IN_MILLISECONDS - days * DAY_IN_MILLISECONDS - hours * HOUR_IN_MILLISECONDS - minutes * MINUTE_IN_MILLISECONDS) /
    SECOND_IN_MILLISECONDS
  );

  return { weeks, days, hours, minutes, seconds };
};