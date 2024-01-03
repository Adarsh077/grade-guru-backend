const { celebrate, Joi, Segments } = require('../utils/celebrate');

exports.findOneBySemesterId = celebrate({
  [Segments.PARAMS]: Joi.object().keys({
    semesterId: Joi.string().required(),
  }),
});

exports.updateBySemesterId = celebrate({
  [Segments.PARAMS]: Joi.object().keys({
    semesterId: Joi.string().required(),
  }),
  [Segments.BODY]: Joi.object().keys({
    students: Joi.array(),
  }),
});
