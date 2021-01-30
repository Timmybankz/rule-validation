const express = require('express');
const router = express.Router();
const resFunc = require('../utils/functions');
const data = require('../utils/my-info');


router.get('/', async (req, res) => {

  const myDetails = data.myInfo;
  const { resPayload } = resFunc.successResponse('My Rule-Validation API', myDetails);
  return res.status(200).json(resPayload);
});


module.exports = router;
