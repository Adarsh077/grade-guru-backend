const { semesterService, batchService } = require('../services');
const marksBySubjectService = require('../services/marks-by-subject.service');
const subjectGroupService = require('../services/subject-group.service');
const subjectService = require('../services/subject.service');
const { catchAsync } = require('../utils');

exports.create = catchAsync(async (req, res) => {
  const { departmentId } = req.params;
  const { name, number } = req.body;

  const { semester } = await semesterService.create({
    name,
    departmentId,
    number,
  });

  res.send({
    status: 'success',
    body: {
      semester,
    },
  });
});

exports.deleteById = catchAsync(async (req, res) => {
  const { semesterId } = req.params;

  const { semester } = await semesterService.deleteById(semesterId);

  res.send({
    status: 'success',
    body: {
      semester,
    },
  });
});

exports.findAll = catchAsync(async (req, res) => {
  const { departmentId } = req.params;

  const { semesters } = await semesterService.findAll({
    departmentId,
  });

  res.send({
    status: 'success',
    body: {
      semesters,
    },
  });
});

exports.findById = catchAsync(async (req, res) => {
  const { semesterId } = req.params;

  const { semester } = await semesterService.findById(semesterId);

  res.send({
    status: 'success',
    body: {
      semester,
    },
  });
});

exports.updateById = catchAsync(async (req, res) => {
  const { semesterId } = req.params;
  const { name, departmentId, number } = req.body;

  const { semester } = await semesterService.updateById(semesterId, {
    name,
    departmentId,
    number,
  });

  res.send({
    status: 'success',
    body: {
      semester,
    },
  });
});

exports.findRegisteredStudents = catchAsync(async (req, res) => {
  const { semesterId } = req.params;
  const { batch: batchName } = req.query;

  const { batch } = await batchService.findOne({ name: batchName });

  const { students } = await semesterService.findRegisteredStudents(
    semesterId,
    { batch },
  );

  res.send({
    status: 'success',
    body: { students },
  });
});

exports.enrolledStudentList = catchAsync(async (req, res) => {
  const { semesterId } = req.params;

  const { students } = await semesterService.enrolledStudentList(semesterId);

  res.send({
    status: 'success',
    body: { students },
  });
});

exports.enrollStudentsInNss = catchAsync(async (req, res) => {
  const { semesterId } = req.params;
  const { students } = req.body;

  const { subjectGroups } = await subjectGroupService.findAll({
    semesterId,
  });

  const { subjects } = await subjectService.findAll({
    subjectGroupIds: subjectGroups.map((subjectGroup) => `${subjectGroup._id}`),
  });

  for (const subject of subjects) {
    for (const student of students) {
      await marksBySubjectService.enterMarksFor({
        subjectId: subject._id,
        studentId: student.studentId,
        hasParticipatedInNss: student.hasParticipatedInNss,
      });
    }
  }

  res.send({
    status: 'success',
  });
});

exports.generateResult = catchAsync(async (req, res) => {
  const { semesterId } = req.params;

  await semesterService.generateResult(semesterId);

  res.send({
    status: 'success',
  });
});
