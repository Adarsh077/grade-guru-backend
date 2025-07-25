const userRoles = require('../constants/user-roles');
const { celebrate, Joi, Segments } = require('../utils/celebrate');

exports.register = celebrate({
  [Segments.BODY]: Joi.object().keys({
    name: Joi.string().required(),
    email: Joi.string().email().required(),
    password: Joi.string().required(),
    role: Joi.string()
      .valid(...Object.values(userRoles))
      .required(),
  }),
});

exports.login = celebrate({
  [Segments.BODY]: Joi.object().keys({
    email: Joi.string().email().required(),
    password: Joi.string().required(),
  }),
});
