const { userService } = require('../services');
const { catchAsync } = require('../utils');

exports.getUserDetails = catchAsync(async (req, res) => {
  const { user } = await userService.getUserDetails(req.user._id);

  res.send({
    status: 'success',
    body: { user },
  });
});

exports.search = catchAsync(async (req, res) => {
  const { query } = req.query;

  const { users } = await userService.search({ query });

  res.send({
    status: 'success',
    body: { users },
  });
});
