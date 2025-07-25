const { SubjectTypeEnum } = require('../enums');
const { celebrate, Joi, Segments } = require('../utils/celebrate');

exports.create = celebrate({
  [Segments.PARAMS]: Joi.object().keys({
    subjectGroupId: Joi.string().required(),
  }),
  [Segments.BODY]: Joi.object().keys({
    name: Joi.string().required(),
    staffId: Joi.string().required(),
    code: Joi.string().required(),
    isATKTSubject: Joi.bool().default(false),
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

exports.findMySubjects = celebrate({
  [Segments.QUERY]: Joi.object().keys({
    batch: Joi.string().required(),
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

exports.enrollStudent = celebrate({
  [Segments.PARAMS]: Joi.object().keys({
    subjectId: Joi.string().required(),
  }),
  [Segments.BODY]: Joi.object().keys({
    studentId: Joi.string().required(),
  }),
});

exports.unEnrollStudent = celebrate({
  [Segments.PARAMS]: Joi.object().keys({
    subjectId: Joi.string().required(),
    studentId: Joi.string().required(),
  }),
});
