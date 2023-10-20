const { subjectService } = require('../services');
const { catchAsync } = require('../utils');

exports.create = catchAsync(async (req, res) => {
  const { semesterId } = req.params;
  const { name, staffId } = req.body;

  const { subject } = await subjectService.create({
    name,
    semesterId,
    staffId,
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

  const { subjects } = await subjectService.findAll({
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

  const { subject } = await subjectService.deleteById(subjectId);

  res.send({
    status: 'success',
    body: {
      subject,
    },
  });
});

exports.findById = catchAsync(async (req, res) => {
  const { subjectId } = req.params;

  const { subject } = await subjectService.findById(subjectId);

  res.send({
    status: 'success',
    body: {
      subject,
    },
  });
});

exports.updateById = catchAsync(async (req, res) => {
  const { subjectId } = req.params;
  const { name, staffId } = req.body;

  const { subject } = await subjectService.updateById(subjectId, {
    name,
    staffId,
  });

  res.send({
    status: 'success',
    body: {
      subject,
    },
  });
});
