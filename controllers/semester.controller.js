const { semesterService } = require('../services');
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

  const { students } = await semesterService.findRegisteredStudents(semesterId);

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
