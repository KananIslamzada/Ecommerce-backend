const Joi = require("joi");

const Str = Joi.string();
const Num = Joi.number();
const Uri = Joi.string().uri();
const Email = Joi.string().email();

const categorySchema = Joi.object({
  name: Str.required(),
  bgColor: Str.max(7).required(),
  image: Uri.required(),
});

const loginSchema = Joi.object({
  email: Email.required(),
  password: Str.required(),
});

const userSchema = Joi.object({
  username: Str.min(6).required(),
  password: Str.min(6).required(),
  email: Email.required(),
});

const validateAsync = async (schema, value) =>
  await schema.validateAsync(value);

const validate = (schema, value) => {
  return schema.validate(value);
};

module.exports = {
  Str,
  Num,
  Uri,
  Email,
  categorySchema,
  loginSchema,
  userSchema,
  validateAsync,
  validate,
};
