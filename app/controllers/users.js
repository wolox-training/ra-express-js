const User = require('../models/').User,
  userService = require('../services/users'),
  errors = require('../errors');

const validEmailPattern = /^[a-zA-Z0-9_.+-]+@wolox\.com\.ar$/g,
  validPasswordPattern = /^(?=.*[A-Za-z])(?=.*\d)[A-Za-z\d]{8,}$/g;

const obligatoryParametersWereReceived = parameters =>
  parameters.includes('firstName') &&
  parameters.includes('lastName') &&
  parameters.includes('email') &&
  parameters.includes('password');

const obligatoryParametersNotNull = body => body.firstName && body.lastName && body.email && body.password;

const emailIsValid = email => email.match(validEmailPattern);

const passwordIsValid = password => password.match(validPasswordPattern);

exports.checkIfObligatoryParametersWereReceived = (req, res, next) => {
  if (obligatoryParametersWereReceived(Object.keys(req.body)) && obligatoryParametersNotNull(req.body))
    return next();

  next(errors.invalidUserParameters);
};

exports.validateEmail = (req, res, next) => {
  if (!emailIsValid(req.body.email)) return next(errors.invalidUserEmail);
  next();
};

exports.validatePassword = (req, res, next) => {
  if (!passwordIsValid(req.body.password)) return next(errors.invalidUserPassword);
  next();
};

exports.checkIfEmailIsAvailable = (req, res, next) => {
  userService
    .emailIsAvailable(req.body.email)
    .then(isAvailable => {
      if (isAvailable) return next();
      next(errors.emailAlreadyInUse);
    })
    .catch(next);
};

exports.createUser = (req, res, next) => {
  User.createUser(req.body.firstName, req.body.lastName, req.body.email, req.body.password)
    .then(user => {
      user.printAfterCreationMessage();
      res.sendStatus(200);
    })
    .catch(next);
};
