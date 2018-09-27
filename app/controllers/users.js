const { User } = require('../models/'),
  userService = require('../services/users'),
  errors = require('../errors'),
  logger = require('../logger'),
  jwt = require('../../node_modules/jsonwebtoken'),
  config = require('../../config');

const validEmailPattern = /^[a-zA-Z0-9_.+-]+@wolox\.com\.ar$/g,
  validPasswordPattern = /^(?=.*[A-Za-z])(?=.*\d)[A-Za-z\d]{8,}$/g,
  limitOfUsersPerPage = 2;

const obligatoryParametersWereReceived = body =>
  body.firstName && body.lastName && body.email && body.password;

const emailIsValid = email => email.match(validEmailPattern);

const passwordIsValid = password => password.match(validPasswordPattern);

exports.createUser = (req, res, next) => {
  if (!obligatoryParametersWereReceived(req.body)) return next(errors.missingParameters);

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

const generateToken = user => {
  return new Promise((resolve, reject) => {
    jwt.sign({ id: user.id, email: user.email }, config.common.session.secret, (err, token) => {
      if (err) return reject(errors.defaultError(err.message));

      resolve(token);
    });
  });
};

exports.logIn = async (req, res, next) => {
  if (!req.body.email || !req.body.password) return next(errors.missingParameters);

  if (!emailIsValid(req.body.email)) return next(errors.invalidUserEmail);

  try {
    const user = await userService.getUserByEmail(req.body.email);
    if (!user) throw errors.emailNotMatchAnyAccount;

    const match = await userService.userPasswordMatch(req.body.password, user.password);
    if (!match) throw errors.wrongPassword;

    const token = await generateToken(user);

    logger.info(User.getAfterLoggingInMessage(user));
    res.status(200).json({ token });
  } catch (err) {
    next(err);
  }
};

exports.listUsers = (req, res, next) => {
  if (!req.query.page || !Number.isInteger(Number(req.query.page))) return next(errors.missingParameters);

  const page = req.query.page;
  const offset = limitOfUsersPerPage * (page - 1);

  userService
    .getAllUsersWithPagination(limitOfUsersPerPage, offset)
    .then(users => {
      const pages = Math.ceil(users.count / limitOfUsersPerPage);
      res.status(200).json({ users: users.rows, count: users.count, pages });
    })
    .catch(next);
};
