const { subjectGroupService } = require('../services');
const { catchAsync } = require('../utils');

exports.create = catchAsync(async (req, res) => {
  const { semesterId } = req.params;
  const { name } = req.body;
  const { subjectGroup } = await subjectGroupService.create({
    name,
    semesterId,
  });

  res.send({
    status: 'success',
    body: { subjectGroup },
  });
});

exports.findAll = catchAsync(async (req, res) => {
  const { semesterId } = req.params;

  const { subjectGroups } = await subjectGroupService.findAll({
    semesterId,
  });

  res.send({
    status: 'success',
    body: { subjectGroups },
  });
});

exports.deleteById = catchAsync(async (req, res) => {
  const { subjectGroupId } = req.params;

  const { subjectGroup } = await subjectGroupService.deleteById(subjectGroupId);

  res.send({
    status: 'success',
    body: { subjectGroup },
  });
});

exports.findById = catchAsync(async (req, res) => {
  const { subjectGroupId } = req.params;

  const { subjectGroup } = await subjectGroupService.findById(subjectGroupId);

  res.send({
    status: 'success',
    body: { subjectGroup },
  });
});

exports.updateById = catchAsync(async (req, res) => {
  const { subjectGroupId } = req.params;
  const { name } = req.body;

  const { subjectGroup } = await subjectGroupService.updateById(
    subjectGroupId,
    { name },
  );

  res.send({
    status: 'success',
    body: { subjectGroup },
  });
});
