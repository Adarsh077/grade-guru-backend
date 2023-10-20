const { batchService } = require('../services');
const { catchAsync } = require('../utils');

exports.create = catchAsync(async (req, res) => {
  const { name } = req.body;

  const { batch } = await batchService.create({
    name,
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
