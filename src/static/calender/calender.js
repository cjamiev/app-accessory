const loadTotal = () => {
  const totalFields = document.querySelectorAll('[data-week-total]');
  let total = ZERO;
  totalFields.forEach(field => {
    const fieldId = field.getAttribute('data-week-total');
    const weekFields = document.querySelectorAll(`[data-week="${fieldId}"]`);
    let weekTotal = ZERO;
    weekFields.forEach(item => {
      weekTotal += Number(item.value);
    });

    field.innerHTML = Math.round(weekTotal * 100) / 100;
    total += weekTotal;
  });

  document.getElementById('total').innerHTML = Math.round(total * 100) / 100;
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

  return [firstDayOfWeek, secondDayOfWeek, thirdDayOfWeek, fourthDayOfWeek, fifthDayOfWeek, sixthDayOfWeek, seventhDayOfWeek];
};

const getEntireMonth = (selectedDay) => {
  const baseDay = selectedDay ? selectedDay : new Date();
  const firstDayofNextMonth = new Date(baseDay.getFullYear(), baseDay.getMonth() + 1, 1, 5, 0, 0);
  const lastDayofMonth = changeByDays(firstDayofNextMonth, -1);
  const weeksOfMonth = [];
  if (lastDayofMonth.getDay() > ZERO) {
    weeksOfMonth.push(getEntireWeek(lastDayofMonth));
  }

  const numberOfWeeksOfMonthInMonth = weeksOfMonth.length > ZERO ? Math.ceil(lastDayofMonth.getDate() / DAYS_IN_A_WEEK) - 1 : Math.ceil(lastDayofMonth.getDate() / DAYS_IN_A_WEEK);
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
  parentDiv.className = 'calender-week';

  week.forEach(day => {
    if (today.getDate() === day.getDate() && today.getMonth() === day.getMonth()) {
      parentDiv.className = 'calender-week calender-week-highlight';
    }

    const el = document.createElement('div');
    el.className = 'calendar-day';

    const spanEl = document.createElement('span');
    spanEl.innerHTML = day.getDate();
    spanEl.className = 'calender-day-span';

    const inEl = document.createElement('input');
    inEl.type = 'text';
    inEl.onchange = loadTotal;
    inEl.className = 'calender-day-input';
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
  monthDiv.className = 'calender-month';

  const calendarHeader = document.createElement('div');
  calendarHeader.className = 'calender-header';
  const sundayHeader = document.createElement('span');
  sundayHeader.className = 'calender-header-span';
  sundayHeader.innerHTML = 'Sunday';
  const mondayHeader = document.createElement('span');
  mondayHeader.className = 'calender-header-span';
  mondayHeader.innerHTML = 'Monday';
  const tuesdayHeader = document.createElement('span');
  tuesdayHeader.className = 'calender-header-span';
  tuesdayHeader.innerHTML = 'Tuesday';
  const wednesdayHeader = document.createElement('span');
  wednesdayHeader.className = 'calender-header-span';
  wednesdayHeader.innerHTML = 'Wednesday';
  const thursdayHeader = document.createElement('span');
  thursdayHeader.className = 'calender-header-span';
  thursdayHeader.innerHTML = 'Thursday';
  const fridayHeader = document.createElement('span');
  fridayHeader.className = 'calender-header-span';
  fridayHeader.innerHTML = 'Friday';
  const saturdayHeader = document.createElement('span');
  saturdayHeader.className = 'calender-header-span';
  saturdayHeader.innerHTML = 'Saturday';
  const totalHeader = document.createElement('span');
  totalHeader.className = 'calender-header-span';
  totalHeader.innerHTML = 'Total';
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
  parentDiv.className = 'calender-week';
  const totalFillerEl = document.createElement('div');
  totalFillerEl.className = 'total-filler';
  const totalEl = document.createElement('div');
  totalEl.className = 'total-cell';
  totalEl.innerHTML = '0';
  totalEl.id = 'total';

  parentDiv.appendChild(totalFillerEl);
  parentDiv.appendChild(totalEl);
  monthDiv.appendChild(parentDiv);

  return monthDiv;
};

const save = () => {
  const weekFields = document.querySelectorAll('[data-week]');
  const data = [];
  weekFields.forEach(field => {
    const fieldData = {
      id: field.id,
      value: field.value
    };
    data.push(fieldData);
  });
  const mode = document.getElementById('calender-title').innerHTML;
  api.post('/calender-data', { filename: mode.toLocaleLowerCase() + '.json', content: data }).then(result => {
    setOutput(result.data);
  });
};

const loadCalender = (title) => {
  const mode = title ? title : document.getElementById('calender-title').innerHTML;
  api.get('/calender-data/' + mode.toLocaleLowerCase() + '.json').then(result => {
    const calenderData = JSON.parse(result.data);
    calenderData.forEach(field => {
      document.getElementById(field.id).value = field.value;
    });
    loadTotal();
  });
};

const switchMode = (title) => {
  document.getElementById('calender-title').innerHTML = title;
  loadCalender(title);
};

document.getElementById('main-content').style.zoom = "150%";
const monthDiv = createCalendarMonth();
const monthName = months[new Date().getMonth()];

document.getElementById('page-title').innerHTML = monthName;
document.getElementById('calender-title').after(monthDiv);

loadCalender();
loadTotal();
