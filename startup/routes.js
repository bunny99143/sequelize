const bodyParser = require('body-parser');
const express = require('express');
const customers = require('../routes/customer');

module.exports = function(app) {
  app.use(bodyParser.urlencoded({
    extended: true
  }));
  app.use(bodyParser.json());

  app.use('/api/', customers);
}