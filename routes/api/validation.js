const Joi = require('joi')

const schemaAddContact = Joi.object({
  name: Joi.string()
    .regex(/^[-a-zA-Z ]*$/)
    .min(2)
    .max(30)
    .required(),

  email: Joi.string()
    .email({ minDomainSegments: 2, tlds: { allow: ['com', 'net'] } }).required(),

  phone: Joi.string()
    .pattern(/^\([0-9]{3}\) [0-9]{3}-[0-9]{4}$/)
    .required(),
})

const schemaUpdateContact = Joi.object({
  name: Joi.string()
    .regex(/^[-a-zA-Z ]*$/)
    .min(2)
    .max(30)
    .optional(),

  email: Joi.string()
    .email({ minDomainSegments: 2, tlds: { allow: ['com', 'net'] } })
    .optional(),

  phone: Joi.string()
    .pattern(/^\([0-9]{3}\) [0-9]{3}-[0-9]{4}$/)
    .optional()

})

const validate = async (schema, body, next) => {
  try {
    await schema.validateAsync(body)
    next()
  } catch (err) {
    next({ status: 'error', code: 400, message: 'Bad request' })
  }
}

const validateAddContact = (req, _res, next) => {
  return validate(schemaAddContact, req.body, next)
}

const validateUpdateContact = (req, _res, next) => {
  return validate(schemaUpdateContact, req.body, next)
}

module.exports = {
  validateAddContact, validateUpdateContact
}
