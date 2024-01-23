const { resultService } = require('../services');
const { catchAsync } = require('../utils');

exports.findOne = catchAsync(async (req, res) => {
  const { semesterId } = req.params;

  const { result } = await resultService.findOne({
    semesterId,
  });

  res.send({
    status: 'success',
    body: {
      result,
    },
  });
});
