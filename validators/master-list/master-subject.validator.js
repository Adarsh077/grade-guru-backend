const { SubjectTypeEnum } = require('../../enums');
const { celebrate, Joi, Segments } = require('../../utils/celebrate');

exports.create = celebrate({
  [Segments.PARAMS]: Joi.object().keys({
    subjectGroupId: Joi.string().required(),
  }),
  [Segments.BODY]: Joi.object().keys({
    name: Joi.string().required(),
    staffId: Joi.string().required(),
    code: Joi.string().required(),
    isATKTSubject: Joi.boolean(),
    subjectType: Joi.string()
      .valid(...Object.values(SubjectTypeEnum))
      .required(),
  }),
});

exports.findAll = celebrate({
  [Segments.PARAMS]: Joi.object().keys({
    subjectGroupId: Joi.string().required(),
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
    subjectType: Joi.string().valid(...Object.values(SubjectTypeEnum)),
  }),
});
