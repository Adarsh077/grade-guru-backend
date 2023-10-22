const { userService } = require('../services');
const { catchAsync } = require('../utils');
const CaslFunctions = require('../casl/casl.functions');

exports.getUserDetails = catchAsync(async (req, res) => {
  const { user } = await userService.getUserDetails(req.user._id);

  res.send({
    status: 'success',
    body: { user },
  });
});

exports.getUserAbilityStatements = catchAsync(async (req, res) => {
  const statements = await CaslFunctions.getStatementsByUser(req.user);

  res.send({
    status: 'success',
    body: { statements },
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
