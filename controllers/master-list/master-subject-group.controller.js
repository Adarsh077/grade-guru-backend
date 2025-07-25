const { masterSubjectGroupService } = require('../../services/master-list');
const { catchAsync } = require('../../utils');

exports.create = catchAsync(async (req, res) => {
  const { semesterId } = req.params;
  const { name, isATKTSubjectGroup } = req.body;

  const { subjectGroup } = await masterSubjectGroupService.create({
    name,
    semesterId,
    isATKTSubjectGroup,
  });

  res.send({
    status: 'success',
    body: { subjectGroup },
  });
});

exports.findAll = catchAsync(async (req, res) => {
  const { semesterId } = req.params;

  const { subjectGroups } = await masterSubjectGroupService.findAll({
    semesterId,
  });

  res.send({
    status: 'success',
    body: { subjectGroups },
  });
});

exports.deleteById = catchAsync(async (req, res) => {
  const { subjectGroupId } = req.params;

  const { subjectGroup } =
    await masterSubjectGroupService.deleteById(subjectGroupId);

  res.send({
    status: 'success',
    body: { subjectGroup },
  });
});

exports.findById = catchAsync(async (req, res) => {
  const { subjectGroupId } = req.params;

  const { subjectGroup } =
    await masterSubjectGroupService.findById(subjectGroupId);

  res.send({
    status: 'success',
    body: { subjectGroup },
  });
});

exports.updateById = catchAsync(async (req, res) => {
  const { subjectGroupId } = req.params;
  const { name } = req.body;

  const { subjectGroup } = await masterSubjectGroupService.updateById(
    subjectGroupId,
    { name },
  );

  res.send({
    status: 'success',
    body: { subjectGroup },
  });
});
