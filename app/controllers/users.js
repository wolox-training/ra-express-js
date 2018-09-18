const { User } = require('../models/'),
  userService = require('../services/users'),
  logger = require('../logger'),
  errors = require('../errors');

const validEmailPattern = /^[a-zA-Z0-9_.+-]+@wolox\.com\.ar$/g,
  validPasswordPattern = /^(?=.*[A-Za-z])(?=.*\d)[A-Za-z\d]{8,}$/g;

const obligatoryParametersWereReceived = body =>
  body.firstName && body.lastName && body.email && body.password;

const emailIsValid = email => email.match(validEmailPattern);

const passwordIsValid = password => password.match(validPasswordPattern);

exports.createUser = (req, res, next) => {
  if (!obligatoryParametersWereReceived(req.body)) return next(errors.invalidUserParameters);

  if (!emailIsValid(req.body.email)) return next(errors.invalidUserEmail);

  if (!passwordIsValid(req.body.password)) return next(errors.invalidUserPassword);

  userService
    .getUserByEmail(req.body.email)
    .then(user => {
      if (user) throw errors.emailAlreadyInUse;
      return userService.createUser(req.body);
    })
    .then(user => {
      logger.info(User.getAfterCreationMessage(user));
      res.sendStatus(200);
    })
    .catch(next);
};
