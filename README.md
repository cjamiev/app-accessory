# q
This project is designed to improve work efficiency. It features a UI with the following capabilities
- Executing batch scripts at the click of a button (including passing in arguments) 
  Note scripts can either 'detach' (will not block UI but will autoclose terminal when finished), 'block' (will block UI but will not autoclose terminal), or will not open up terminal.
- Copy content on to clipboard
- Timer for events (pop up alert when done)
- Links to saved pages

## Testing
- For quick javascript coding/testing use 'q.js' at the base of the app and run 'node q.js' to execute. Not meant for saving. 
- For quick testing of html,css,javascript use index.html with liveserver in testing folder.
- For TDD with new functions or performance testing use main.js 

## Home
### Quick Clipboard
Quickly add copy buttons or timers.  Can be quickly deleted as well.

![Copy Feature](./documentation/quick-clipboard-copy-feature.png)
![Timer Feature](./documentation/quick-clipboard-timer-feature.png)

### Read/Write files
Form for reading and writing to files.  Files must be deleted manually at the moment.  
- Ascending/Descending Sort
- Splitting into seperate Lines by delimiter
- Copy content of file to clipboard
- Validate JSON format
- Find/Replace string
**Copy and paste content into notepad++ first in order to get rid of formatting**

![Read and Write Feature](./documentation/read-write-feature.png)

### Clipboard
Page to store executable commands, lists, favorite links, etc. This page is dynamically created using the below format as example.
The type can be link, timer, copy, command, or group where you can have multiple of the previous. Timer must have value that uses Javascript Date constructor format.
Command can be 'block' for pop up terminal or any other string for no terminal.
```
{
  "sectionTitle": 'optional title here',
  "sectionData": [
    {
      "listTitle": "list title here",
      "listId": "list-id-here",
      "listData": [
        {
          "type": "group",
          "value": [
            {
              "type": "link",
              "label": "cjamiev/playground",
              "value": "https://github.com/cjamiev/playground"
            },
            {
              "type": "copy",
              "label": "User Name",
              "value": "user1"
            },
            {
              "type": "copy",
              "label": "Password",
              "value": "password1"
            }
          ]
        },
        {
          "type": "timer",
          "label": "35th Bday",
          "value": "2023,2,18,0,0,0"
        },
        {
          "type": "command",
          "label": "find port",
          "value": {
            "mode": "simple",
            "name": "find-port.bat",
            "argsId": "find-port-args"
          }
        
      ]
    }
  ]
}
```

![Clipboard Feature](./documentation/clipboard-feature.png)

### Calender
This page is used to store log numerical data for the month such as running miles or expenses.

### Snippets
This page is used to store commonly used html tags, javascript functions, css and other code snippets.

### Mock Server
These pages can be used to create custom mock endpoints (including conditional post calls) as well as view endpoints and have configuration for timed delays of responses.

Example of conditionalResponse format
```
"conditionalResponse": [
  {
    "payload": {
      "user": "CJV"
    },
    "body": {
      "key3": "value3"
    }
  }
]
```

### API Testing
This page is used to test api calls.

## Notes
You can add the following to another project while this project is running to record api calls:

```
post: (filename, payload) => {
    return fetch('http://localhost:999/write', {
      headers: {
        'Accept': 'application/json',
        'Content-Type': 'application/json'
      },
      body: JSON.stringify({ filename, content:payload}),
      method: 'POST',
      crossDomain: true
    })
      .then(resp => resp.json())
      .catch(error => console.log('error:', error));
  }
```

Future Features
- Format button for Read/Write files