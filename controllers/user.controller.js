const { userService } = require('../services');
const { catchAsync } = require('../utils');

exports.getUserDetails = catchAsync(async (req, res) => {
  const { user } = await userService.getUserDetails(req.user._id);

  res.send({
    status: 'success',
    body: { user },
  });
});

exports.updateUserAbilties = catchAsync(async (req, res) => {
  const { role } = req.body;

  await userService.updateUserAbilities({
    role,
    userId: req.user._id,
  });

  res.send({
    status: 'success',
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
