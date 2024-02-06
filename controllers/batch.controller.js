const { batchService } = require('../services');
const { catchAsync } = require('../utils');

exports.create = catchAsync(async (req, res) => {
  const { name, year } = req.body;
  const { batch } = await batchService.create({
    name,
    year,
    ability: req.user.ability,
  });

  res.send({
    status: 'success',
    body: {
      batch,
    },
  });
});

exports.findAll = catchAsync(async (req, res) => {
  const { batches } = await batchService.findAll();

  res.send({
    status: 'success',
    body: {
      batches,
    },
  });
});
