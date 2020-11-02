const deleteAllChildren = parent => {
  let child = parent.lastElementChild;
  while (child) {
    parent.removeChild(child);
    child = parent.lastElementChild;
  }
};

const copyToClipboard = (id) => {
  const temporaryElement = document.createElement('input');
  document.body.appendChild(temporaryElement);
  temporaryElement.value = document.getElementById(id).innerHTML;
  temporaryElement.select();
  document.execCommand('copy', false);
  temporaryElement.remove();
};

const getNumberValue = name => {
  const element = document.getElementById(name);

  return element ? Number(element.value) : undefined;
};

const getRadioButtonValue = name => {
  const radioButton = document.querySelector(`input[name=${name}]:checked`);

  return radioButton.value === 'true';
};

const getSelectDropdownValue = id => {
  const dropdown = document.getElementById(id);

  return dropdown.options[dropdown.selectedIndex].value;
};

const getArrayFromCommaSeparatedValue = name => {
  const commaSeparatedValues = document.getElementById(name).value;

  return commaSeparatedValues ? commaSeparatedValues.split(',') : [];
};

const parseJSONObject = object => {
  let parsed = {};
  try {
    parsed = JSON.parse(object);
  } catch (e) {
    parsed = null;
  }

  return parsed;
};

const validateJSON = (jsonFieldId, errorFieldId, fieldname) => {
  const body = parseJSONObject(document.getElementById(jsonFieldId).value);
  const isValid = isValidJSONObject(JSON.stringify(body));
  if (isValid) {
    document.getElementById(errorFieldId).innerHTML += fieldname + ' is Valid ';
  } else {
    document.getElementById(errorFieldId).innerHTML += fieldname + ' is NOT Valid JSON Format ';
  }
};

const isNumber = value => !isNaN(value);
const isBoolean = value => typeof value === 'boolean';
const isString = value => typeof value === 'string';
const isObject = value => typeof value === 'object';
const isValidJSONObject = value => {
  const parsed = parseJSONObject(value);
  return parsed && typeof parsed === 'object';
};