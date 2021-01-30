const express = require('express');
const router = express.Router();
const ruleModel = require('../models/rule');
const resFunc = require('../utils/functions');

router.post('/', async (req, res) => {

    const errorResp = resFunc.errorResWithoutData;

    if (!req.body) 
      return res.status(400).json(errorResp('Invalid JSON payload passed.'));

    const rule = req.body.rule;
    const data = req.body.data;

    if (!rule) 
      return res.status(400).json(errorResp('rule is required.'));
  
    if (!data) 
      return res.status(400).json(errorResp('data is required.'));

    if(typeof rule !== 'object' || (typeof rule === null || Array.isArray(rule)))
      return res.status(400).json(errorResp('rule should be an object.'));
  
    const { error: ruleNotValid } = ruleModel.validate(rule);
    if (ruleNotValid) {
      const validationErr = resFunc.getMissingFields(ruleNotValid.details);
      return res.status(400).json(validationErr);
    }

    if(typeof rule.field !== 'string' || typeof rule.field === null)
      return res.status(400).json(errorResp(`rule object field's field should be a string.`));


    const nestingCount = (rule.field.match(/\./g) || []).length;
    let firstNest = '';
    let secondNest = '';

    const { error: conditionNotValid } = ruleModel.validateConditionField(rule.condition);
    if (conditionNotValid)
      return res.status(400).json(
        errorResp(`Condition value in rule object must be either 'eq', 'neq', 'gt', 'gte' or 'contains.'`)
      );

    if (resFunc.conditionsToDataType)
        return res.status(400).json(errorResp('field condition_value should be a number for conditions gt and gte.'))

    if (nestingCount > 1)
      return res.status(400).json(errorResp('Maximum of two layer nesting for rule object\'s field.'));


    // THIS HANDLES VALIATION FOR NESTED OBJECTS

    if (nestingCount > 0) {

      firstNest = rule.field.split('.')[0];
      secondNest = rule.field.split('.')[1];
      
      const firstNestObj = data[firstNest];

      if (!firstNestObj)
          return res.status(400).json(errorResp(`field ${firstNest} is missing from data.`));

      if (!firstNestObj[secondNest])
          return res.status(400).json(errorResp(`field ${secondNest} is missing from ${firstNest} of data.`));

      const typeOfFieldValue = typeof firstNestObj[secondNest];
      const typeOfConditionValue = typeof rule.condition_value;

      if(
          ( typeof firstNestObj[secondNest] !== 'number' && typeof firstNestObj[secondNest] !== 'string') || 
          ((typeof rule.condition_value !== 'number' && typeof rule.condition_value !== 'string') && typeof rule.condition_value !== null)
        )
          return res.status(400).json(errorResp('The field value and condition value should both be either strings or number.'));

      if (typeOfFieldValue !== typeOfConditionValue)
          return res.status(400).json(
            errorResp(`${secondNest} value from ${firstNest} field of data is of a different data type from value of condition_value of rule object.`)
          );

      const validatePayload = resFunc.validationStatus(rule, firstNestObj[secondNest]);

      return res.status(validatePayload.status).json(validatePayload.resPayload);
 
    }
  
    // THIS HANDLES FOR NON-NESTED OBJECTS

    if (!data[rule.field])
      return res.status(400).json(errorResp(`field ${rule.field} is missing from data.`));

    if (typeof rule.condition_value !== typeof data[rule.field])
      return res.status(400).json(
        errorResp(`field ${rule.field} value from data is of a different type from value of condition_value of rule.`)
      ); 

    const validatePayload = resFunc.validationStatus(rule, data[rule.field]);

    return res.status(validatePayload.status).json(validatePayload.resPayload);
});
  

module.exports = router;
