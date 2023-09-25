const Joi = require("joi");

createContactValidator = Joi.object({
  name: Joi.string().required(),
  email: Joi.string().email().required(),
  phone: Joi.string().required(),
  favorite: Joi.boolean(),
}).options({ abortEarly: false, convert: false });

updateContactStatusValidator = Joi.object({
  favorite: Joi.boolean().required(),
}).options({ abortEarly: false, convert: false });

module.exports = { createContactValidator, updateContactStatusValidator };
