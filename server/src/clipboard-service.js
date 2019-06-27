const fs = require('fs');

const createClipboard = (req, res) => {
  const clipboard = fs.readFileSync(`storage\\clipboard.json`,'utf8');

  createBackup(clipboard);

  fs.writeFile(`storage\\clipboard.json`,JSON.stringify(req.body.content), err => {
    if(err){
      res.status(200).send({ message:`error in creating file: ${err}` });
    } else {
      res.status(200).send({ message:'successfully created file' });
    }
  });
};

const getClipboard = (req, res) => {
  const clipboard = fs.readFileSync(`storage\\clipboard.json`,'utf8');

  res.status(200).send(clipboard);
}

const createBackup = (clipboard) => {
  const date = new Date();
  const timestamp = `${date.getFullYear()}-${date.getMonth() + 1}-${date.getDate()}-${date.getHours()}-${date.getMinutes()}-${date.getSeconds()}`;

  fs.writeFile(`backup\\clipboard-${timestamp}.json`,clipboard, err => { console.log(err)});
}

module.exports = {
  createClipboard,
  getClipboard
};