const { masterDepartmentService } = require('../../services/master-list');
const { catchAsync } = require('../../utils');

exports.create = catchAsync(async (req, res) => {
  const { name, hod } = req.body;

  const { department } = await masterDepartmentService.create({
    name,
    hod,
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

  const { department } = await masterDepartmentService.deleteById(departmentId);

  res.send({
    status: 'success',
    body: {
      department,
    },
  });
});

exports.findAll = catchAsync(async (req, res) => {
  const { departments } = await masterDepartmentService.findAll({
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

  const { department } = await masterDepartmentService.findById(departmentId);

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

  const { department } = await masterDepartmentService.updateById(
    departmentId,
    {
      hod,
      name,
    },
  );

  res.send({
    status: 'success',
    body: {
      department,
    },
  });
});
