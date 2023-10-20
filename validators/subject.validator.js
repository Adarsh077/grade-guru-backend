const { celebrate, Joi, Segments } = require('../utils/celebrate');

exports.create = celebrate({
  [Segments.PARAMS]: Joi.object().keys({
    semesterId: Joi.string().required(),
  }),
  [Segments.BODY]: Joi.object().keys({
    name: Joi.string().required(),
    staffId: Joi.string().required(),
  }),
});

exports.findAll = celebrate({
  [Segments.PARAMS]: Joi.object().keys({
    semesterId: Joi.string().required(),
  }),
});

exports.deleteById = celebrate({
  [Segments.PARAMS]: Joi.object().keys({
    subjectId: Joi.string().required(),
  }),
});

exports.findById = celebrate({
  [Segments.PARAMS]: Joi.object().keys({
    subjectId: Joi.string().required(),
  }),
});

exports.updateById = celebrate({
  [Segments.PARAMS]: Joi.object().keys({
    subjectId: Joi.string().required(),
  }),
  [Segments.BODY]: Joi.object().keys({
    name: Joi.string(),
    staffId: Joi.string(),
  }),
});
