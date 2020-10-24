const dateMethods = [
  { key: 'year', label: 'getFullYear()', comments: 'Get the year as a four digit number (yyyy)' },
  { key: 'month', label: 'getMonth()', comments: 'Get the month as a number (0-11)' },
  { key: 'date', label: 'getDate()', comments: 'Get the day as a number (1-31)' },
  { key: 'hour', label: 'getHours()', comments: 'Get the hour (0-23)' },
  { key: 'minute', label: 'getMinutes()', comments: 'Get the minute (0-59)' },
  { key: 'second', label: 'getSeconds()', comments: 'Get the second (0-59)' },
  { key: 'millisecond', label: 'getMilliseconds()', comments: 'Get the millisecond (0-999)' },
  { key: 'day', label: 'getDay()', comments: 'Get the weekday as a number (0-6)' },
  { key: 'time', label: 'getTime()', comments: 'Get the time (milliseconds since January 1, 1970)' }
];

const htmlTags = [
  { key: 'html-page', label: '<!DOCTYPE html>\n<html lang="en">\n<head>\n\t<meta charset="utf-8">\n\t<link rel="stylesheet" href="css/styles.css">\n\t<title>Your Website</title>\n</head>\n<body>\n\t<script src="js/scripts.js"></script>\n</body>\n</html>' },
  { key: 'textual-tags', label: '<h1>This is a h1</h1>\n<p> This is a p</p>\n<label> This is a label </label>' },
  { key: 'semantical-tags', label: '<div> This is a div </div>\n<span> This is a span </span>\n<header>This is a header</header>\n<nav>This is a nav</nav>\n<main> This is a main</main>\n<section>This is a section</section>\n<article>This is an article</article>\n<aside>This is an aside</aside>\n<footer>This is an footer</footer>\n' },
  { key: 'input-tags', label: '<input type="button" value="A button"/>\n<input type="text"/>\n<input type="password"/>\n\n<input type="radio" name="radiogroup" value="Radio Button 1" />\n<input type="radio" name="radiogroup" value="Radio Button 2" />\n\n<input type="checkbox" value="Checkbox Button 1" />\n\n<select name="selectinput">\n\t<option value="value1">Selection 1</option>\n\t<option value="value2">Selection 2</option>\n</select>\n' },
  { key: 'form', label: '<form>\n\t<fieldset>\n\t\t<legend>Personalia:</legend>\n\t\t<label for="name">Name:</label>\n\t\t<input id="name" type="text"><br>\n\t\t<label for="email">Email:</label>\n\t\t<input id="email" type="text"><br>\n\t\t<label for="dob">Date of birth:</label>\n\t\t<input id="dob" type="text"><br>\n\t\t<input type="submit" value="Submit">\n\t</fieldset>\n</form>\n' },
  { key: 'table-tags', label: '<table>\n\t<thead>\n\t\t<tr>\n\t\t\t<th>Column 1 Header</th>\n\t\t</tr>\n\t</thead>\n\t<tbody>\n\t\t<tr>\n\t\t\t<td>Cell 11</td>\n\t\t</tr>\n\t\t<tr>\n\t\t\t<td>Cell 21</td>\n\t</tbody>\n</table>' },
  { key: 'list-tags', label: '<ul>\n\t<li>List 1</li>\n\t<li>List 2</li>\n</ul>' },
  { key: 'link-tags', label: '<a href="http://www.google.com" target="_blank">This is a hyperlink</a>\n<img src="smiley.gif" alt="Smiley face" height="42" width="42">' },
  { key: 'seperation-tags', label: '<br/>\n<hr>' }
];

const loadDateMethod = key => {
  const dateMethod = dateMethods.find(item => item.key === key);
  document.getElementById('copy-snippet').innerHTML = dateMethod.label;
  document.getElementById('comments').innerHTML = dateMethod.comments;
  copyHTMLContentToClipboard('copy-snippet');
};

const loadHTMLTags = key => {
  const htmlTag = htmlTags.find(item => item.key === key);
  document.getElementById('copy-snippet').innerHTML = replaceHTMLCharactersWithEscapeCharacters(htmlTag.label);
  document.getElementById('comments').innerHTML = htmlTag.comments || '';
  copyHTMLContentToClipboard('copy-snippet');
};