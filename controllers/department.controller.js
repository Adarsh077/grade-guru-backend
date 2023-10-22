const { departmentService } = require('../services');
const { catchAsync } = require('../utils');

exports.create = catchAsync(async (req, res) => {
  const { name, hod, batch } = req.body;

  const { department } = await departmentService.create({
    name,
    hod,
    batch,
    ability: req.user.ability,
  });

  res.send({
    status: 'success',
    body: {
      department,
    },
  });
});

exports.deleteById = catchAsync(async (req, res) => {
  const { departmentId } = req.params;

  const { department } = await departmentService.deleteById(departmentId);

  res.send({
    status: 'success',
    body: {
      department,
    },
  });
});

exports.findAll = catchAsync(async (req, res) => {
  const { batch } = req.query;

  const { departments } = await departmentService.findAll({
    batch: batch,
    ability: req.user.ability,
  });

  res.send({
    status: 'success',
    body: {
      departments,
    },
  });
});

exports.findById = catchAsync(async (req, res) => {
  const { departmentId } = req.params;

  const { department } = await departmentService.findById(departmentId);

  res.send({
    status: 'success',
    body: {
      department,
    },
  });
});

exports.updateById = catchAsync(async (req, res) => {
  const { departmentId } = req.params;
  const { name, hod } = req.body;

  const { department } = await departmentService.updateById(departmentId, {
    hod,
    name,
  });

  res.send({
    status: 'success',
    body: {
      department,
    },
  });
});
