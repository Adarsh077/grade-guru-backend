const { studentsBySemesterService } = require('../services');
const { catchAsync } = require('../utils');

exports.findOneBySemesterId = catchAsync(async (req, res) => {
  const { semesterId } = req.params;

  const { studentsBySemester } = await studentsBySemesterService.findOneBy({
    semesterId,
  });

  res.send({
    status: 'success',
    body: { studentsBySemester },
  });
});

exports.addStudents = catchAsync(async (req, res) => {
  const { semesterId } = req.params;
  const { students } = req.body;

  const { studentsBySemester } = await studentsBySemesterService.addStudents(
    { semesterId },
    { students },
  );

  res.send({
    status: 'success',
    body: { studentsBySemester },
  });
});

exports.updateBySemesterId = catchAsync(async (req, res) => {
  const { semesterId } = req.params;
  const { students } = req.body;

  await studentsBySemesterService.findOneAndUpdate(
    { semesterId },
    { students },
  );

  res.send({
    status: 'success',
  });
});
