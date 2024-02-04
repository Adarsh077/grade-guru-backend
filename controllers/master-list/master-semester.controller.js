const { masterSemesterService } = require('../../services/master-list');
const { catchAsync } = require('../../utils');

exports.create = catchAsync(async (req, res) => {
  const { departmentId } = req.params;
  const { name, number } = req.body;

  const { semester } = await masterSemesterService.create({
    name,
    number,
    departmentId,
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

  const { semester } = await masterSemesterService.deleteById(semesterId);

  res.send({
    status: 'success',
    body: {
      semester,
    },
  });
});

exports.findAll = catchAsync(async (req, res) => {
  const { departmentId } = req.params;

  const { semesters } = await masterSemesterService.findAll({
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

  const { semester } = await masterSemesterService.findById(semesterId);

  res.send({
    status: 'success',
    body: {
      semester,
    },
  });
});

exports.updateById = catchAsync(async (req, res) => {
  const { semesterId } = req.params;
  const { name, number, departmentId } = req.body;

  const { semester } = await masterSemesterService.updateById(semesterId, {
    name,
    number,
    departmentId,
  });

  res.send({
    status: 'success',
    body: {
      semester,
    },
  });
});
