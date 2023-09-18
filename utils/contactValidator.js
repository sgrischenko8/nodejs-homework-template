const Joi = require("joi");

const createContactValidator = Joi.object({
  name: Joi.string().required(),
  email: Joi.string().email().required(),
  phone: Joi.string().required(),
}).options({ abortEarly: false, convert: false });

module.exports = { createContactValidator };
