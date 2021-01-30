const express = require('express');
const myDetails = require('../controllers/my-details');
const ruleValidation = require('../controllers/rule-validation');
const error = require('../controllers/error');

module.exports = function(app) {
  app.use(express.json());
  app.use('/', myDetails);
  app.use('/validate-rule', ruleValidation);
  app.use(error);
}
