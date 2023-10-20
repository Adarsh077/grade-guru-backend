const { celebrate, Joi, Segments } = require('../utils/celebrate');

exports.create = celebrate({
  [Segments.BODY]: Joi.object().keys({
    name: Joi.string().required(),
    hod: Joi.string().required(),
    batch: Joi.string().required(),
  }),
});

exports.deleteById = celebrate({
  [Segments.PARAMS]: Joi.object().keys({
    departmentId: Joi.string().required(),
  }),
});

exports.findAll = celebrate({
  [Segments.QUERY]: Joi.object().keys({
    batch: Joi.string().required(),
  }),
});

exports.findById = celebrate({
  [Segments.PARAMS]: Joi.object().keys({
    departmentId: Joi.string().required(),
  }),
});

exports.updateById = celebrate({
  [Segments.PARAMS]: Joi.object().keys({
    departmentId: Joi.string().required(),
  }),
  [Segments.BODY]: Joi.object().keys({
    name: Joi.string(),
    hod: Joi.string(),
  }),
});
