const { studentService } = require('../services');
const { catchAsync } = require('../utils');

exports.create = catchAsync(async (req, res) => {
  const { name, email, studentType, admissionYear, departmentId, gender } =
    req.body;

  const { student } = await studentService.create({
    name,
    email,
    studentType,
    admissionYear,
    departmentId,
    gender,
  });

  res.send({
    status: 'success',
    body: { student },
  });
});

exports.delete = catchAsync(async (req, res) => {
  const { studentId } = req.params;

  const { student } = await studentService.delete(studentId);

  res.send({
    status: 'success',
    body: { student },
  });
});

exports.find = catchAsync(async (req, res) => {
  const { admissionYear } = req.query;

  const { students } = await studentService.find({
    admissionYear,
  });

  res.send({
    status: 'success',
    body: { students },
  });
});

exports.update = catchAsync(async (req, res) => {
  const { name, email } = req.body;
  const { studentId } = req.params;

  const { student } = await studentService.update(studentId, {
    name,
    email,
  });

  res.send({
    status: 'success',
    body: { student },
  });
});
