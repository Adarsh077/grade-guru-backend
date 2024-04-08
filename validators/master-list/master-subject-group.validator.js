const { celebrate, Joi, Segments } = require('../../utils/celebrate');

exports.create = celebrate({
  [Segments.PARAMS]: Joi.object().keys({
    semesterId: Joi.string().required(),
  }),
  [Segments.BODY]: Joi.object().keys({
    name: Joi.string().required(),
    isATKTSubjectGroup: Joi.bool().default(false),
  }),
});

exports.findAll = celebrate({
  [Segments.PARAMS]: Joi.object().keys({
    semesterId: Joi.string().required(),
  }),
});

exports.deleteById = celebrate({
  [Segments.PARAMS]: Joi.object().keys({
    subjectGroupId: Joi.string().required(),
  }),
});

exports.findById = celebrate({
  [Segments.PARAMS]: Joi.object().keys({
    subjectGroupId: Joi.string().required(),
  }),
});

exports.updateById = celebrate({
  [Segments.PARAMS]: Joi.object().keys({
    subjectGroupId: Joi.string().required(),
  }),
  [Segments.BODY]: Joi.object().keys({
    name: Joi.string(),
  }),
});
