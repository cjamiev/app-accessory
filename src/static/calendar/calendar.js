const loadTotal = () => {
  const totalFields = document.querySelectorAll('[data-week-total]');
  let total = ZERO;
  totalFields.forEach((field) => {
    const fieldId = field.getAttribute('data-week-total');
    const weekFields = document.querySelectorAll(`[data-week="${fieldId}"]`);
    let weekTotal = ZERO;
    weekFields.forEach((item) => {
      weekTotal += Number(item.value);
    });

    field.textContent = Math.round(weekTotal * 100) / 100;
    total += weekTotal;
  });

  document.getElementById('total').textContent = Math.round(total * 100) / 100;
};

const changeByDays = (date, days) => new Date(date.getTime() + days * DAY_IN_MILLISECONDS);

const getEntireWeek = (selectedDay) => {
  const baseDay = selectedDay ? selectedDay : new Date();
  const firstDayOfWeek = changeByDays(baseDay, 0 - baseDay.getDay());
  const secondDayOfWeek = changeByDays(baseDay, 1 - baseDay.getDay());
  const thirdDayOfWeek = changeByDays(baseDay, 2 - baseDay.getDay());
  const fourthDayOfWeek = changeByDays(baseDay, 3 - baseDay.getDay());
  const fifthDayOfWeek = changeByDays(baseDay, 4 - baseDay.getDay());
  const sixthDayOfWeek = changeByDays(baseDay, 5 - baseDay.getDay());
  const seventhDayOfWeek = changeByDays(baseDay, 6 - baseDay.getDay());

  return [
    firstDayOfWeek,
    secondDayOfWeek,
    thirdDayOfWeek,
    fourthDayOfWeek,
    fifthDayOfWeek,
    sixthDayOfWeek,
    seventhDayOfWeek
  ];
};

const getEntireMonth = (selectedDay) => {
  const baseDay = selectedDay ? selectedDay : new Date();
  const firstDayofNextMonth = new Date(baseDay.getFullYear(), baseDay.getMonth() + 1, 1, 5, 0, 0);
  const lastDayofMonth = changeByDays(firstDayofNextMonth, -1);
  const weeksOfMonth = [];
  if (lastDayofMonth.getDay() > ZERO) {
    weeksOfMonth.push(getEntireWeek(lastDayofMonth));
  }

  const numberOfWeeksOfMonthInMonth =
    weeksOfMonth.length > ZERO
      ? Math.ceil(lastDayofMonth.getDate() / DAYS_IN_A_WEEK) - 1
      : Math.ceil(lastDayofMonth.getDate() / DAYS_IN_A_WEEK);
  let count = ZERO;
  while (count < numberOfWeeksOfMonthInMonth) {
    count++;
    const newDay = changeByDays(lastDayofMonth, -DAYS_IN_A_WEEK * count);
    const newWeek = getEntireWeek(newDay);
    weeksOfMonth.push(newWeek);
  }

  return weeksOfMonth.reverse();
};

const createCalendarWeek = (week, id) => {
  const today = new Date();
  const parentDiv = document.createElement('div');
  parentDiv.className = 'calendar-week';

  week.forEach((day) => {
    if (today.getDate() === day.getDate() && today.getMonth() === day.getMonth()) {
      parentDiv.className = 'calendar-week calendar-week-highlight';
    }

    const el = document.createElement('div');
    el.className = 'calendar-day';

    const spanEl = document.createElement('span');
    spanEl.textContent = day.getDate();
    spanEl.className = 'calendar-day-span';

    const inEl = document.createElement('input');
    inEl.type = 'text';
    inEl.onchange = loadTotal;
    inEl.className = 'calendar-day-input';
    inEl.setAttribute('data-week', id);
    inEl.id = day.getMonth() + '-' + day.getDate();

    el.appendChild(spanEl);
    el.appendChild(inEl);
    parentDiv.appendChild(el);
  });

  const totalEl = document.createElement('div');
  totalEl.className = 'total-week-cell';
  totalEl.setAttribute('data-week-total', id);

  parentDiv.appendChild(totalEl);
  return parentDiv;
};

const createCalendarMonth = (baseDay) => {
  const thisMonth = getEntireMonth(baseDay);
  const monthDiv = document.createElement('div');
  monthDiv.id = 'current-month';
  monthDiv.className = 'calendar-month';

  const calendarHeader = document.createElement('div');
  calendarHeader.className = 'calendar-header';
  const sundayHeader = document.createElement('span');
  sundayHeader.className = 'calendar-header-span';
  sundayHeader.textContent = 'Sunday';
  const mondayHeader = document.createElement('span');
  mondayHeader.className = 'calendar-header-span';
  mondayHeader.textContent = 'Monday';
  const tuesdayHeader = document.createElement('span');
  tuesdayHeader.className = 'calendar-header-span';
  tuesdayHeader.textContent = 'Tuesday';
  const wednesdayHeader = document.createElement('span');
  wednesdayHeader.className = 'calendar-header-span';
  wednesdayHeader.textContent = 'Wednesday';
  const thursdayHeader = document.createElement('span');
  thursdayHeader.className = 'calendar-header-span';
  thursdayHeader.textContent = 'Thursday';
  const fridayHeader = document.createElement('span');
  fridayHeader.className = 'calendar-header-span';
  fridayHeader.textContent = 'Friday';
  const saturdayHeader = document.createElement('span');
  saturdayHeader.className = 'calendar-header-span';
  saturdayHeader.textContent = 'Saturday';
  const totalHeader = document.createElement('span');
  totalHeader.className = 'calendar-header-span';
  totalHeader.textContent = 'Total';
  calendarHeader.appendChild(sundayHeader);
  calendarHeader.appendChild(mondayHeader);
  calendarHeader.appendChild(tuesdayHeader);
  calendarHeader.appendChild(wednesdayHeader);
  calendarHeader.appendChild(thursdayHeader);
  calendarHeader.appendChild(fridayHeader);
  calendarHeader.appendChild(saturdayHeader);
  calendarHeader.appendChild(totalHeader);

  monthDiv.appendChild(calendarHeader);

  thisMonth.forEach((week, index) => {
    monthDiv.appendChild(createCalendarWeek(week, index));
  });

  const parentDiv = document.createElement('div');
  parentDiv.className = 'calendar-week';
  const totalFillerEl = document.createElement('div');
  totalFillerEl.className = 'total-filler';
  const totalEl = document.createElement('div');
  totalEl.className = 'total-cell';
  totalEl.textContent = '0';
  totalEl.id = 'total';

  parentDiv.appendChild(totalFillerEl);
  parentDiv.appendChild(totalEl);
  monthDiv.appendChild(parentDiv);

  return monthDiv;
};

const save = () => {
  const weekFields = document.querySelectorAll('[data-week]');
  const data = [];
  weekFields.forEach((field) => {
    const fieldData = {
      id: field.id,
      value: field.value
    };
    data.push(fieldData);
  });
  const mode = document.getElementById('calendar-title').textContent;
  api.post('/calendar-data', { filename: mode.toLocaleLowerCase() + '.json', content: data }).then((result) => {
    setOutput(result.data);
  });
};

const loadCalendar = (title) => {
  const mode = title ? title : document.getElementById('calendar-title').textContent;
  api.get('/calendar-data/' + mode.toLocaleLowerCase() + '.json').then((result) => {
    const calendarData = JSON.parse(result.data);
    calendarData.forEach((field) => {
      const dateCell = document.getElementById(field.id);
      if (dateCell) {
        dateCell.value = field.value;
      }
    });
    loadTotal();
  });
};

const switchMode = (title) => {
  document.getElementById('calendar-title').textContent = title;
  loadCalendar(title);
};

document.getElementById('main-content').style.zoom = '150%';
const monthDiv = createCalendarMonth();
const monthName = months[new Date().getMonth()];

document.getElementById('page-title').textContent = monthName;
document.getElementById('calendar-title').after(monthDiv);

loadCalendar();
loadTotal();
