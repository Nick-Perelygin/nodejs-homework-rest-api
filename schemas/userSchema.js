const Joi = require('joi');
const {Schema, model} = require('mongoose')
const {handleMongooseError} = require('../utility')

const userSchema = new Schema({
    name: String,
    password: {
      type: String,
      required: [true, 'Set password for user'],
    },
    email: {
      type: String,
      required: [true, 'Email is required'],
      unique: true,
    },
    subscription: {
      type: String,
      enum: ["starter", "pro", "business"],
      default: "starter"
    },
    token: String,
    avatarUrl: String,
    verify: {
      type: Boolean,
      default: false
    },
    verificationCode: {
      type: String,
      default: ""
    }
}, {versionKey: false, timestamps: true});

userSchema.post('save', handleMongooseError);

const User = model('user', userSchema)

const registerSchema = Joi.object({
    avatarUrl: Joi.string(),
    name: Joi.string()
    .min(3)
    .max(30)
    .required(),
    email: Joi.string()
    .email({ minDomainSegments: 2, tlds: { allow: ['com', 'net'] } }),
    password: Joi.number().min(6).required(),
})

const emailShema = Joi.object({
  email: Joi.string()
    .email({ minDomainSegments: 2, tlds: { allow: ['com', 'net'] } }),
})

const loginSchema = Joi.object({
    avatarUrl: Joi.string(),
    name: Joi.string(),
    email: Joi.string()
    .email({ minDomainSegments: 2, tlds: { allow: ['com', 'net'] } }),
    password: Joi.number().min(6).required(),
})

const schemas = {
    registerSchema,
    loginSchema,
    emailShema
}

module.exports = {
    schemas,
    User,
}