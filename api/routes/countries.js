const express = require('express');
const router = express.Router();

const countryController = require('../controller/country.controller');

router.route('/')
  .get(countryController.read)
  .post(countryController.create);

module.exports = router;