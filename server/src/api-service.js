const fs = require("fs"); 

class ApiService {
  constructor() {
    this.data = require('./data');
    this.missingDataMessage = 'Missing data: an id, name, date, and description is required';
    this.duplicateIdMessage = 'Data with this id already exists; ids must be unique';
    this.missingDataIdMessage = 'Missing data: an id is required';
    this.idDoesNotExistMessage = 'No exists with this id';
    this.serverErrorMessage = 'Oops, a server error occurred';

    this.getData = this.getData.bind(this);
    this.postData = this.postData.bind(this);
    this.deleteData = this.deleteData.bind(this);
  }

  static shouldSendServerError() {
    return Math.random() > 1;
  }

  static hasId(id, data) {
    return !!data.find(data => data.id === id);
  }

  createFile(filename, content) { 
    fs.writeFile(filename, content, (err) => { 
      err && console.log(err);
    });
  };

  getData(req, res) {
    if (ApiService.shouldSendServerError()) {
      res.status(500).send(this.serverErrorMessage);
      return;
    }

    res.status(200).send(this.data);
  }

  postData(req, res) {
    if (ApiService.shouldSendServerError()) {
      res.status(500).send(this.serverErrorMessage);
      return;
    }

    const { body } = req;
    if (!body.fileName) {
      res.status(400).send(this.missingDataMessage);
      return;
    }

    this.createFile(body.fileName,'test');
    res.status(200).end();
  }

  deleteData(req, res) {
    if (ApiService.shouldSendServerError()) {
      res.status(500).send(this.serverErrorMessage);
      return;
    }

    const { body } = req;
    if (!body || !body.id) {
      res.status(400).send(this.missingEventIdMessage);
      return;
    } else if (!ApiService.hasId(body.id, this.data)) {
      res.status(400).send(this.idDoesNotExistMessage);
      return;
    }

    this.data = this.data.filter(data => data.id !== body.id);
    res.status(200).end();
  }
}

module.exports = ApiService;
