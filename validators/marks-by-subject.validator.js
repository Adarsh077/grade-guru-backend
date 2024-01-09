const { celebrate, Joi, Segments } = require('../utils/celebrate');

exports.findOneBySubjectId = celebrate({
  [Segments.PARAMS]: Joi.object().keys({
    subjectId: Joi.string().required(),
  }),
});

exports.updateMarksOfStudent = celebrate({
  [Segments.PARAMS]: Joi.object().keys({
    subjectId: Joi.string().required(),
  }),
  [Segments.BODY]: Joi.object().keys({
    marksOfStudent: Joi.object(),
  }),
});
