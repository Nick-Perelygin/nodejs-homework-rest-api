const Joi = require('joi');

const contacts = require('../models/contacts');

const {HttpError} = require('../utility/HttpError');

const addSchema = Joi.object({
    name: Joi.string()
    .alphanum()
    .min(3)
    .max(30)
    .required(),
    email: Joi.string()
    .email({ minDomainSegments: 2, tlds: { allow: ['com', 'net'] } }),
    phone: Joi.number().required()
})