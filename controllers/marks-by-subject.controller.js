const { marksBySubjectService } = require('../services');
const { catchAsync } = require('../utils');

exports.enterMarksFor = catchAsync(async (req, res) => {
  const { subjectId, studentId } = req.params;
  const { examName, marksScored } = req.body;

  const { marksBySubject } = await marksBySubjectService.enterMarksFor({
    subjectId,
    studentId,
    examName,
    marksScored,
  });

  res.send({
    status: 'success',
    body: { marksBySubject },
  });
});

exports.getMarksBySubjectId = catchAsync(async (req, res) => {
  const { subjectId } = req.params;

  const { marksBySubject } = await marksBySubjectService.getMarksBySubjectId({
    subjectId,
  });

  res.send({
    status: 'success',
    body: { marksBySubject },
  });
});
