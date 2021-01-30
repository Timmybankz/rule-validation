const express = require('express');
const router = express.Router();
const resFunc = require('../utils/functions');
const data = require('../utils/my-info');


router.get('/', async (req, res) => {

  const myDetails = data.myInfo;
  return res.status(200).json(resFunc.successResponse('My Rule-Validation API.', myDetails));
});


module.exports = router;
