const { userService } = require('../services');
const { catchAsync } = require('../utils');

exports.register = catchAsync(async (req, res) => {
  const { name, email, password, role } = req.body;

  const { token } = await userService.register({ name, email, password, role });

  res.send({
    status: 'success',
    body: {
      token,
    },
  });
});

exports.login = catchAsync(async (req, res) => {
  const { email, password } = req.body;

  const { token } = await userService.login({
    email,
    password,
  });

  res.send({
    status: 'success',
    body: {
      token,
    },
  });
});
