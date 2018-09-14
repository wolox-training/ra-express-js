const { User } = require('../models/'),  
  userService = require('../services/users'),
  errors = require('../errors'),
  logger = require('../logger'),
  jwt = require('../../node_modules/jsonwebtoken');

const validEmailPattern = /^[a-zA-Z0-9_.+-]+@wolox\.com\.ar$/g,
  validPasswordPattern = /^(?=.*[A-Za-z])(?=.*\d)[A-Za-z\d]{8,}$/g;

const obligatoryParametersWereReceived = body =>
  body.firstName && body.lastName && body.email && body.password;

const emailIsValid = email => email.match(validEmailPattern);

const passwordIsValid = password => password.match(validPasswordPattern);

exports.createUser = (req, res, next) => {
  if (!obligatoryParametersWereReceived(req.body)) return next(errors.invalidParameters);

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

exports.logIn = (req, res, next) => {
  if (!req.body.email || !req.body.password) return next(errors.invalidParameters);

  if (!emailIsValid(req.body.email)) return next(errors.invalidUserEmail);

  let usr;

  userService
    .getUserByEmail(req.body.email)
    .then(user => {
      if (!user) throw errors.emailNotMatchAnyAccount;
      usr = user;
      return user.passwordMatch(req.body.password);
    })
    .then(match => {
      if (!match) throw errors.wrongPassword;

      jwt.sign({ id: usr.id, email: usr.email }, process.env.JWT_KEY, (err, token) => {
        if (err) throw errors.defaultError(err.message);

        logger.info(usr.getAfterLoggingInMessage());
        res.status(200).json({ token });
      });
    })
    .catch(next);
};
