const Joi = require("joi");

exports.checkUserDataValidator = Joi.object({
  password: Joi.string().required(),
  email: Joi.string().email().required(),
  subscription: Joi.string(),
}).options({ abortEarly: false, convert: false });

exports.updateSubscriptionValidator = Joi.object({
  subscription: Joi.string().required(),
}).options({ abortEarly: false, convert: false });
