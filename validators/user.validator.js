const { celebrate, Joi, Segments } = require('../utils/celebrate');

exports.search = celebrate({
  [Segments.QUERY]: Joi.object().keys({
    query: Joi.string().required(),
  }),
});

exports.updateUserAbilties = celebrate({
  [Segments.BODY]: Joi.object().keys({
    role: Joi.string().required(),
  }),
});
