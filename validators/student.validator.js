const { StudentTypeEnum } = require('../enums');
const { celebrate, Joi, Segments } = require('../utils/celebrate');

exports.create = celebrate({
  [Segments.BODY]: Joi.object().keys({
    name: Joi.string().required(),
    email: Joi.string().email().required(),
    studentType: Joi.string()
      .valid(...Object.values(StudentTypeEnum))
      .required(),
    admissionYear: Joi.number().required(),
    departmentId: Joi.string().required(),
  }),
});

exports.delete = celebrate({
  [Segments.PARAMS]: Joi.object().keys({
    studentId: Joi.string().required(),
  }),
});

exports.find = celebrate({
  [Segments.QUERY]: Joi.object().keys({
    admissionYear: Joi.number(),
    departmentId: Joi.string(),
  }),
});

exports.update = celebrate({
  [Segments.BODY]: Joi.object().keys({
    name: Joi.string(),
    email: Joi.string().email(),
  }),
  [Segments.PARAMS]: Joi.object().keys({
    studentId: Joi.string().required(),
  }),
});
