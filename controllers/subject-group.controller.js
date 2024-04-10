const { subjectGroupService, semesterService } = require('../services');
const { catchAsync } = require('../utils');

exports.create = catchAsync(async (req, res) => {
  const { semesterId } = req.params;
  const { name, isATKTSubjectGroup } = req.body;
  const { subjectGroup } = await subjectGroupService.create({
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

exports.enrollStudents = catchAsync(async (req, res) => {
  const { subjectGroupId } = req.params;
  const { enrolledStudents } = req.body;

  const { subjectGroup } = await subjectGroupService.enrollStudents(
    subjectGroupId,
    { enrolledStudents },
  );

  await semesterService.generateSeatNoForStudents(subjectGroup.semester);

  res.send({
    status: 'success',
    body: { subjectGroup },
  });
});

exports.enrolledStudentList = catchAsync(async (req, res) => {
  const { subjectGroupId } = req.params;
  console.log(subjectGroupId);
  const { students } =
    await subjectGroupService.enrolledStudentList(subjectGroupId);

  res.send({
    status: 'success',
    body: { students },
  });
});

exports.generateResultBy = catchAsync(async (req, res) => {
  const { subjectGroupId } = req.params;

  const { subjectGroup } = await subjectGroupService.findById(subjectGroupId);

  let marks = null;
  if (subjectGroup.isATKTSubjectGroup) {
    const { marksByStudents } =
      await subjectGroupService.generateATKTResultBy(subjectGroupId);
    marks = marksByStudents;
  } else {
    const { marksByStudents } =
      await subjectGroupService.generateResultBy(subjectGroupId);
    marks = marksByStudents;
  }

  res.send({
    status: 'success',
    body: { marks },
  });
});
