const { masterSubjectService } = require('../../services/master-list');
const { catchAsync } = require('../../utils');

exports.create = catchAsync(async (req, res) => {
  const { semesterId } = req.params;
  const { name, staffId, code, subjectType } = req.body;

  const { subject } = await masterSubjectService.create({
    name,
    semesterId,
    staffId,
    code,
    subjectType,
  });

  res.send({
    status: 'success',
    body: {
      subject,
    },
  });
});

exports.findAll = catchAsync(async (req, res) => {
  const { semesterId } = req.params;

  const { subjects } = await masterSubjectService.findAll({
    semesterId,
  });

  res.send({
    status: 'success',
    body: {
      subjects,
    },
  });
});

exports.deleteById = catchAsync(async (req, res) => {
  const { subjectId } = req.params;

  const { subject } = await masterSubjectService.deleteById(subjectId);

  res.send({
    status: 'success',
    body: {
      subject,
    },
  });
});

exports.findById = catchAsync(async (req, res) => {
  const { subjectId } = req.params;

  const { subject } = await masterSubjectService.findById(subjectId);

  res.send({
    status: 'success',
    body: {
      subject,
    },
  });
});

exports.updateById = catchAsync(async (req, res) => {
  const { subjectId } = req.params;
  const { name, staffId, code, subjectType } = req.body;
  const { subject } = await masterSubjectService.updateById(subjectId, {
    name,
    staffId,
    code,
    subjectType,
  });

  res.send({
    status: 'success',
    body: {
      subject,
    },
  });
});
