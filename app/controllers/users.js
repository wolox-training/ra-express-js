const User = require('../models/').User;
const userService = require('../services/users');

const errors = require('../errors');

const validEmailPattern = /^[a-zA-Z0-9_.+-]+@wolox\.com\.ar$/g;
const validPasswordPattern = /^(?=.*[A-Za-z])(?=.*\d)[A-Za-z\d]{8,}$/g;

const obligatoryParametersWereReceived = parameters =>
  parameters.includes('firstName') &&
  parameters.includes('lastName') &&
  parameters.includes('email') &&
  parameters.includes('password');

const emailIsValid = email => email.match(validEmailPattern);

const passwordIsValid = password => password.match(validPasswordPattern);

exports.checkIfObligatoryParametersWereReceived = (req, res, next) => {
  if (!obligatoryParametersWereReceived(Object.keys(req.body))) return next(errors.invalidUserParameters);
  next();
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
    .catch(error => next(errors.databaseError(error.message)));
};

exports.createUser = (req, res, next) => {
  User.create({
    firstName: req.body.firstName,
    lastName: req.body.lastName,
    email: req.body.email,
    password: req.body.password
  })
    .then(user => {
      user.printAfterCreationMessage();
      next();
    })
    .catch(error => next(errors.databaseError(error.message)));
};
