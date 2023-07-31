const Joi = require('joi');
const {Schema, model} = require('mongoose')
const {handleMongooseError} = require('../utility')

const userSchema = new Schema({
    name: {
        type: String,
        required: true,
    },
    email: {
        type: String,
    },
    password: {
        type: String,
        minlength: 6,
        required: true,
    },
    token: {
        type: String,
        default: ''
    }
}, {versionKey: false, timestamps: true});

userSchema.post('save', handleMongooseError);

const User = model('user', userSchema)

const registerSchema = Joi.object({
    name: Joi.string()
    .min(3)
    .max(30)
    .required(),
    email: Joi.string()
    .email({ minDomainSegments: 2, tlds: { allow: ['com', 'net'] } }),
    password: Joi.number().min(6).required(),
})

const loginSchema = Joi.object({
    email: Joi.string()
    .email({ minDomainSegments: 2, tlds: { allow: ['com', 'net'] } }),
    password: Joi.number().min(6).required(),
})

const schemas = {
    registerSchema,
    loginSchema,
}

module.exports = {
    schemas,
    User,
}