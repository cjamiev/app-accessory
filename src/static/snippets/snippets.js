const htmlTags = [
  {
    label: 'Html Page',
    value:
      '<!DOCTYPE html>\n<html lang="en">\n<head>\n\t<meta charset="utf-8">\n\t<link rel="stylesheet" href="css/styles.css">\n\t<title>Your Website</title>\n</head>\n<body>\n\t<script src="js/scripts.js"></script>\n</body>\n</html>'
  },
  { label: 'Textual Tags', value: '<h1>This is a h1</h1>\n<p> This is a p</p>\n<value> This is a value </value>' },
  {
    label: 'Semantical Tags',
    value:
      '<div> This is a div </div>\n<span> This is a span </span>\n<header>This is a header</header>\n<nav>This is a nav</nav>\n<main> This is a main</main>\n<section>This is a section</section>\n<article>This is an article</article>\n<aside>This is an aside</aside>\n<footer>This is an footer</footer>\n'
  },
  {
    label: 'Input Tags',
    value:
      '<input type="button" value="A button"/>\n<input type="text"/>\n<input type="password"/>\n\n<input type="radio" name="radiogroup" value="Radio Button 1" />\n<input type="radio" name="radiogroup" value="Radio Button 2" />\n\n<input type="checkbox" value="Checkbox Button 1" />\n\n<select name="selectinput">\n\t<option value="value1">Selection 1</option>\n\t<option value="value2">Selection 2</option>\n</select>\n'
  },
  {
    label: 'Form',
    value:
      '<form>\n\t<fieldset>\n\t\t<legend>Personalia:</legend>\n\t\t<value for="name">Name:</value>\n\t\t<input id="name" type="text"><br>\n\t\t<value for="email">Email:</value>\n\t\t<input id="email" type="text"><br>\n\t\t<value for="dob">Date of birth:</value>\n\t\t<input id="dob" type="text"><br>\n\t\t<input type="submit" value="Submit">\n\t</fieldset>\n</form>\n'
  },
  {
    label: 'Table Tags',
    value:
      '<table>\n\t<thead>\n\t\t<tr>\n\t\t\t<th>Column 1 Header</th>\n\t\t</tr>\n\t</thead>\n\t<tbody>\n\t\t<tr>\n\t\t\t<td>Cell 11</td>\n\t\t</tr>\n\t\t<tr>\n\t\t\t<td>Cell 21</td>\n\t</tbody>\n</table>'
  },
  { label: 'List Tags', value: '<ul>\n\t<li>List 1</li>\n\t<li>List 2</li>\n</ul>' },
  {
    label: 'Link Tags',
    value:
      '<a href="http://www.google.com" target="_blank">This is a hyperlink</a>\n<img src="smiley.gif" alt="Smiley face" height="42" width="42">'
  },
  { label: 'Seperation Tags', value: '<br/>\n<hr>' }
];

const dateMethods = [
  { label: 'Constructor', value: 'Date(year, monthIndex [, day [, hours [, minutes [, seconds [, milliseconds]]]]])' },
  { label: 'Year', value: 'getFullYear()', comments: 'Get the year as a four digit number (yyyy)' },
  { label: 'Month', value: 'getMonth()', comments: 'Get the month as a number (0-11)' },
  { label: 'Date', value: 'getDate()', comments: 'Get the day as a number (1-31)' },
  { label: 'Hour', value: 'getHours()', comments: 'Get the hour (0-23)' },
  { label: 'Minute', value: 'getMinutes()', comments: 'Get the minute (0-59)' },
  { label: 'Second', value: 'getSeconds()', comments: 'Get the second (0-59)' },
  { label: 'Millisecond', value: 'getMilliseconds()', comments: 'Get the millisecond (0-999)' },
  { label: 'Day', value: 'getDay()', comments: 'Get the weekday as a number (0-6)' },
  { label: 'Time', value: 'getTime()', comments: 'Get the time (milliseconds since January 1, 1970)' }
];

const eventMethods = [
  { label: 'Event Listener', value: 'addEventListener(event, function)' },
  { label: 'Click', value: 'onclick' },
  { label: 'Change', value: 'onchange' },
  { label: 'Mouse Over', value: 'onmouseover' },
  { label: 'Mouse Out', value: 'onmouseout' },
  { label: 'Mouse Up', value: 'onmouseup' },
  { label: 'Mouse Down', value: 'onmousedown' },
  { label: 'Mouse Move', value: 'onmousemove' },
  { label: 'Key Up', value: 'onkeyup' },
  { label: 'Key Down', value: 'onkeydown' },
  { label: 'Key Press', value: 'onkeypress' },
  { label: 'Drag', value: 'ondrag' },
  { label: 'Blur', value: 'onblur' },
  { label: 'Focus', value: 'onfocus' },
  { label: 'Load', value: 'onload' },
  { label: 'Unload', value: 'onunload' }
];

const storageMethods = [
  { label: 'Storage', value: 'localStorage', comments: 'Use sessionStorage if you do not want it to persist' },
  { label: 'Add', value: 'setItem(k,v)' },
  { label: 'Read', value: 'getItem(k)' },
  { label: 'Delete', value: 'removeItem(k)' },
  { label: 'Clear', value: 'clear()' }
];

const customSnippets = [
  {
    label: 'focus',
    value:
      '*:focus { \n  box-shadow: 0 0 5px rgba(255,0,0,1); \n  padding: 3px 0px 3px 3px; \n  margin: 5px 1px 3px 0px; \n  border: 1px solid rgba(144,0,0,1); \n}'
  },
  { label: 'blur', value: '* { \n  filter: blur(4px) \n}' },
  { label: 'grid', value: 'display: grid;\ngrid-template-columns: 1fr 1fr 1fr 1fr 1fr;\ngrid-template-rows: 1fr 1fr;' },
  {
    label: 'dropdown',
    value:
      '\n\t\t.custom-dropdown {\n\t\t\tposition: relative;\n\t\t\tdisplay: inline-block;\n\t\t}\n\n\t\t.custom-dropdown .dropdown-content {\n\t\t\tvisibility: hidden;\n\t\t\tposition: absolute;\n\n\t\t\tborder: 1px solid black;\n\t\t\tpadding: 5px 5px;\n\t\t\tmargin: 0 0 5px 5px;\n\t\t\tz-index: 1;\n\t\t\ttop: 100%;\n\t\t\tleft: 50%;\n\t\t}\n\n\t\t.dropdown-content {\n\t\t\tdisplay: flex;\n\t\t}\n\n\t\t.custom-dropdown-active .dropdown-content {\n\t\t\tvisibility: visible;\n\t\t}\n\t<div id="custom-dropdown" class="custom-dropdown" onClick="toggle()">\n\t\tClick Me\n\t\t<div id="dropdown-content" class="dropdown-content">Content</div>\n\t</div>\n\t\tconst toggle = () => {\n\t\t\tdocument.getElementById("custom-dropdown").classList.toggle("custom-dropdown-active");\n\t\t}'
  }
];

const loadData = (label, data, escapeHTML = false) => {
  const entry = data.find((item) => item.label === label);
  document.getElementById('copy-snippet').textContent = escapeHTML
    ? replaceHTMLCharactersWithEscapeCharacters(entry.value)
    : entry.value;
  document.getElementById('comments').textContent = entry.comments || '';
  copyHTMLContentToClipboard('copy-snippet');
};

const loadHTMLTags = (label) => loadData(label, htmlTags, true);
const loadEventMethod = (label) => loadData(label, eventMethods);
const loadDateMethod = (label) => loadData(label, dateMethods);
const loadStorageMethod = (label) => loadData(label, storageMethods);
const loadCustomSnippets = (label) => loadData(label, customSnippets);

const htmlTagsParent = document.getElementById('html-tags');
htmlTags.map((entry) => {
  const childBtn = document.createElement('button');
  childBtn.className = 'snippet-btn';
  childBtn.onclick = () => {
    loadHTMLTags(entry.label);
  };
  childBtn.textContent = entry.label;

  htmlTagsParent.appendChild(childBtn);
});

const dateMethodsParent = document.getElementById('date-methods');
dateMethods.map((entry) => {
  const childBtn = document.createElement('button');
  childBtn.className = 'snippet-btn';
  childBtn.onclick = () => {
    loadDateMethod(entry.label);
  };
  childBtn.textContent = entry.label;

  dateMethodsParent.appendChild(childBtn);
});

const eventMethodsParent = document.getElementById('event-methods');
eventMethods.map((entry) => {
  const childBtn = document.createElement('button');
  childBtn.className = 'snippet-btn';
  childBtn.onclick = () => {
    loadEventMethod(entry.label);
  };
  childBtn.textContent = entry.label;

  eventMethodsParent.appendChild(childBtn);
});

const storageMethodsParent = document.getElementById('storage-methods');
storageMethods.map((entry) => {
  const childBtn = document.createElement('button');
  childBtn.className = 'snippet-btn';
  childBtn.onclick = () => {
    loadStorageMethod(entry.label);
  };
  childBtn.textContent = entry.label;

  storageMethodsParent.appendChild(childBtn);
});

const customSnippetsParent = document.getElementById('custom-snippets');
customSnippets.map((entry) => {
  const childBtn = document.createElement('button');
  childBtn.className = 'snippet-btn';
  childBtn.onclick = () => {
    loadCustomSnippets(entry.label);
  };
  childBtn.textContent = entry.label;

  customSnippetsParent.appendChild(childBtn);
});
