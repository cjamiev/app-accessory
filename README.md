# q
This project is designed to improve work efficiency. It features a UI with the following capabilities
- Executing batch scripts at the click of a button (including passing in arguments) 
  Note scripts can either 'detach' (will not block UI but will autoclose terminal when finished), 'block' (will block UI but will not autoclose terminal), or will not open up terminal.
- Copy content on to clipboard
- Timer for events (pop up alert when done)
- Links to saved pages

## Testing
q.js at the base of the app is used for quick javascript coding/testing.  Run 'node q.js' to execute. Not meant for saving. 
The root index.html is used for quick testing of html,css,javascript
mockResponses.js is used for custom server end points with mock responses including conditional responses for post calls. 

## Home
### Quick Clipboard
Quickly add copy buttons or timers.  Can be quickly deleted as well.

![Quick Clipboard Feature](./documentation/quick-clipboard-feature.png)

### Read/Write files
Form for reading and writing to files.  Files must be deleted manually at the moment.  
- Ascending/Descending Sort
- Splitting into seperate Lines by delimiter
- Copy content of file to clipboard
- Validate JSON format

**Note there is a wierd bug where sometimes formatting code gets into content depending how content was added in. Double check in notepadd++ when copy/pasting**

![Read and Write Feature](./documentation/read-write-feature.png)

## Snippets
This page is used to store commonly used html tags, javascript functions, css and other code snippets

## Clipboard
Page to store executable commands, lists, favorite links, etc. 

## New
Template page for adding in new pages. 
