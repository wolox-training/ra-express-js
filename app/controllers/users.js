const User = require('../models/').User;
const userService = require('../services/users');

const validEmailPattern = /^[a-zA-Z0-9_.+-]+@wolox\.com\.ar$/g;
const validPasswordPattern = /^(?=.*[A-Za-z])(?=.*\d)[A-Za-z\d]{8,}$/g;

const obligatoryParametersWereReceived = parameters => {
  return (
    parameters.includes('firstName') &&
    parameters.includes('lastName') &&
    parameters.includes('email') &&
    parameters.includes('password')
  );
};

const emailIsValid = email => {
  return email.match(validEmailPattern);
};

const passwordIsValid = password => {
  return password.match(validPasswordPattern);
};

exports.checkIfObligatoryParametersWereReceived = (req, res, next) => {
  if (!obligatoryParametersWereReceived(Object.keys(req.body)))
    return res.status(400).send('Missing obligatory parameters');
  next();
};

exports.validateEmail = (req, res, next) => {
  if (!emailIsValid(req.body.email)) return res.status(400).send('Invalid email');
  next();
};

exports.validatePassword = (req, res, next) => {
  if (!passwordIsValid(req.body.password)) return res.status(400).send('Invalid password');
  next();
};

exports.checkIfEmailIsAvailable = (req, res, next) => {
  userService
    .emailIsAvailable(req.body.email)
    .then(isAvailable => {
      if (isAvailable) return next();
      return res.status(400).send('Email is already in use');
    })
    .catch(error => {
      console.log(error.message);
      return res.status(503).send(error.message);
    });
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
    .catch(error => {
      console.log(error.message);
      return res.status(503).send(error.message);
    });
};
