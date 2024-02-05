const { celebrate, Joi, Segments } = require('../utils/celebrate');

exports.create = celebrate({
  [Segments.BODY]: Joi.object().keys({
    name: Joi.string().required(),
    year: Joi.number().min(2000).required(),
  }),
});
