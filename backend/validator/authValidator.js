const Joi = require("joi");

const signupSchema = Joi.object({
    username: Joi.string().min(3).max(30).required(),
    email: Joi.string().email().required(),
    password: Joi.string().min(6).required(),
    role: Joi.string().valid("admin", "user", "institute"),
});

const loginSchema = Joi.object({
 username:Joi.string().required(),
  password: Joi.string().required(),
});

module.exports = { signupSchema, loginSchema };