const Joi = require('joi');

function validateRule(rule) {
  const schema = Joi.object({
    field: Joi.required(),
    condition: Joi.required(),
    condition_value: Joi.required()
  });

  return schema.validate(rule, { abortEarly: false });
}

function validateConditionField(condition) {

  const schema = Joi.string().valid('eq', 'neq', 'gt', 'gte', 'contains').required();
  return schema.validate(condition, { abortEarly: false });
}

function validateField(condition) {

  const schema = Joi.string().required();
  return schema.validate(condition, { abortEarly: false });
}

exports.validate = validateRule;
exports.validateConditionField = validateConditionField;
