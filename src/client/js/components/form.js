// CHECKBOX
const handleCheckboxChange = (id, payloadId) => {
  return ({ target: { value } }) => {
    const currentPayload = JSON.parse(sessionStorage.getItem(payloadId));
    if (currentPayload) {
      const selected = currentPayload[id];
      const shouldRemoveOrAdd = selected.find(item => item === value);
      const updatedSelection = shouldRemoveOrAdd ? selected.filter(item => item !== value) : selected.concat([value]);

      const updatedPayload = {
        ...currentPayload,
        [id]: updatedSelection
      };
      sessionStorage.setItem(payloadId, JSON.stringify(updatedPayload));
    } else {
      sessionStorage.setItem(payloadId, JSON.stringify({ [id]: [value] }));
    }
  };
};

const createCheckbox = ({ id, label, values }, payloadId) => {
  const payload = JSON.parse(sessionStorage.getItem(payloadId));
  const selected = payload ? payload[id] : [];

  const checkboxes = values.map(value => {
    const checkbox = document.createElement('div');
    const checkboxLabel = document.createElement('label');
    checkboxLabel.innerHTML = value;
    checkboxLabel.htmlFor = `${label}-${value}`;
    const checkboxInput = document.createElement('input');

    checkboxInput.id = `${label}-${value}`;
    checkboxInput.type = 'checkbox';
    checkboxInput.name = label;
    checkboxInput.value = value;
    if (selected.find(item => item === value)) {
      checkboxInput.checked = true;
    }
    checkboxInput.onchange = handleCheckboxChange(id, payloadId);

    checkbox.appendChild(checkboxInput);
    checkbox.appendChild(checkboxLabel);

    return checkbox;
  });

  const checkboxGroup = document.createElement('div');
  const checkboxGroupLabel = document.createElement('label');
  checkboxGroupLabel.innerHTML = label;
  checkboxGroupLabel.className = 'form-label';

  checkboxGroup.appendChild(checkboxGroupLabel);
  checkboxes.forEach(checkbox => {
    checkboxGroup.appendChild(checkbox);
  });

  return checkboxGroup;
};

// DATE
const handleDateChange = (id, payloadId) => {
  return ({ target: { value } }) => {
    const currentPayload = JSON.parse(sessionStorage.getItem(payloadId));
    if (currentPayload) {
      const updatedPayload = {
        ...currentPayload,
        [id]: value
      };
      sessionStorage.setItem(payloadId, JSON.stringify(updatedPayload));
    } else {
      sessionStorage.setItem(payloadId, JSON.stringify({ [id]: [value] }));
    }
  };
};

const createDate = ({ id, label }, payloadId) => {
  const payload = JSON.parse(sessionStorage.getItem(payloadId));
  const selected = payload ? payload[id] : null;

  const dateDiv = document.createElement('div');
  const dateLabel = document.createElement('label');
  dateLabel.innerHTML = label;
  dateLabel.className = 'form-label';
  const dateInput = document.createElement('input');
  dateInput.id = `${label}`;
  dateInput.type = 'date';
  dateInput.name = label;
  dateInput.value = selected || '';
  dateInput.onchange = handleDateChange(id, payloadId);

  dateDiv.appendChild(dateLabel);
  dateDiv.appendChild(dateInput);

  return dateDiv;
};

// RADIO
const handleRadioChange = (id, payloadId) => {
  return ({ target: { value } }) => {
    const currentPayload = JSON.parse(sessionStorage.getItem(payloadId));
    if (currentPayload) {
      const updatedPayload = {
        ...currentPayload,
        [id]: value
      };
      sessionStorage.setItem(payloadId, JSON.stringify(updatedPayload));
    } else {
      sessionStorage.setItem(payloadId, JSON.stringify({ [id]: [value] }));
    }
  };
};

const createRadio = ({ id, label, values }, payloadId) => {
  const payload = JSON.parse(sessionStorage.getItem(payloadId));
  const selected = payload ? payload[id] : null;

  const radios = values.map(value => {
    const radio = document.createElement('div');
    const radioLabel = document.createElement('label');
    radioLabel.innerHTML = value;
    radioLabel.htmlFor = `${label}-${value}`;
    const radioInput = document.createElement('input');

    radioInput.id = `${label}-${value}`;
    radioInput.type = 'radio';
    radioInput.name = label;
    radioInput.value = value;
    if (selected === value) {
      radioInput.checked = true;
    }
    radioInput.onchange = handleRadioChange(id, payloadId);

    radio.appendChild(radioInput);
    radio.appendChild(radioLabel);

    return radio;
  });

  const radioGroup = document.createElement('div');
  const radioGroupLabel = document.createElement('label');
  radioGroupLabel.className = 'form-label';
  radioGroupLabel.innerHTML = label;

  radioGroup.appendChild(radioGroupLabel);
  radios.forEach(radio => {
    radioGroup.appendChild(radio);
  });

  return radioGroup;
};

// SELECT
const handleSelectChange = (id, payloadId) => {
  return ({ target: { value } }) => {
    const currentPayload = JSON.parse(sessionStorage.getItem(payloadId));
    if (currentPayload) {
      const updatedPayload = {
        ...currentPayload,
        [id]: value
      };
      sessionStorage.setItem(payloadId, JSON.stringify(updatedPayload));
    } else {
      sessionStorage.setItem(payloadId, JSON.stringify({ [id]: [value] }));
    }
  };
};

const createSelect = ({ id, label, values }, payloadId) => {
  const payload = JSON.parse(sessionStorage.getItem(payloadId));
  const selected = payload ? payload[id] : null;

  const options = values.map(value => {
    const option = document.createElement('option');
    option.value = value;
    option.innerHTML = value;
    if (selected === value) {
      option.selected = selected;
    }

    return option;
  });

  const selectDiv = document.createElement('div');
  const select = document.createElement('select');
  select.onchange = handleSelectChange(id, payloadId);
  const selectLabel = document.createElement('label');
  selectLabel.innerHTML = label;
  selectLabel.className = 'form-label';

  options.forEach(option => {
    select.appendChild(option);
  });
  selectDiv.appendChild(selectLabel);
  selectDiv.appendChild(select);

  return selectDiv;
};

// TEXT
const handleTextChange = (id, payloadId) => {
  return ({ target: { value } }) => {
    const currentPayload = JSON.parse(sessionStorage.getItem(payloadId));
    if (currentPayload) {
      const updatedPayload = {
        ...currentPayload,
        [id]: value
      };
      sessionStorage.setItem(payloadId, JSON.stringify(updatedPayload));
    } else {
      sessionStorage.setItem(payloadId, JSON.stringify({ [id]: [value] }));
    }
  };
};

const createText = ({ id, label }, payloadId) => {
  const payload = JSON.parse(sessionStorage.getItem(payloadId));
  const selected = payload ? payload[id] : null;

  const textDiv = document.createElement('div');
  const textLabel = document.createElement('label');
  textLabel.innerHTML = label;
  textLabel.className = 'form-label';
  const textInput = document.createElement('input');
  textInput.id = `${label}`;
  textInput.type = 'text';
  textInput.name = label;
  textInput.value = selected || '';
  textInput.onchange = handleTextChange(id, payloadId);

  textDiv.appendChild(textLabel);
  textDiv.appendChild(textInput);

  return textDiv;
};
