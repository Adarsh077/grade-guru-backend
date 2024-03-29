const { resultService } = require('../services');
const { catchAsync } = require('../utils');

exports.getResultsBy = catchAsync(async (req, res) => {
  const { subjectGroupId } = req.params;

  const { result } = await resultService.getResultsBy({
    subjectGroupId,
  });

  res.send({
    status: 'success',
    body: { result },
  });
});
