const { ExamNamesEnum } = require('../enums');
const { celebrate, Joi, Segments } = require('../utils/celebrate');

exports.enterMarksFor = celebrate({
  [Segments.PARAMS]: Joi.object().keys({
    subjectId: Joi.string().required(),
    studentId: Joi.string().required(),
  }),
  [Segments.BODY]: Joi.object().keys({
    examName: Joi.string()
      .valid(...Object.values(ExamNamesEnum))
      .required(),
    marksScored: Joi.number().min(0).required(),
  }),
});

exports.getMarksBySubjectId = celebrate({
  [Segments.PARAMS]: Joi.object().keys({
    subjectId: Joi.string().required(),
  }),
});
