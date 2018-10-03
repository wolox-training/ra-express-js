const { User } = require('../models/'),
  userService = require('../services/users'),
  errors = require('../errors'),
  logger = require('../logger'),
  enums = require('../enums'),
  jwtUtils = require('../jwt_utils');

const validEmailPattern = /^[a-zA-Z0-9_.+-]+@wolox\.com\.ar$/g,
  validPasswordPattern = /^(?=.*[A-Za-z])(?=.*\d)[A-Za-z\d]{8,}$/g,
  limitOfUsersPerPage = 2;

const obligatoryParametersWereReceived = body =>
  body.firstName && body.lastName && body.email && body.password;

const emailIsValid = email => email.match(validEmailPattern);

const passwordIsValid = password => password.match(validPasswordPattern);

const validateUserCreation = parameters => {
  if (!obligatoryParametersWereReceived(parameters)) return errors.missingParameters;

  if (!emailIsValid(parameters.email)) return errors.invalidUserEmail;

  if (!passwordIsValid(parameters.password)) return errors.invalidUserPassword;

  return null;
};

exports.createUser = (req, res, next) => {
  const error = validateUserCreation(req.body);
  if (error) return next(error);

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

exports.logIn = async (req, res, next) => {
  if (!req.body.email || !req.body.password) return next(errors.missingParameters);

  if (!emailIsValid(req.body.email)) return next(errors.invalidUserEmail);

  try {
    const user = await userService.getUserByEmail(req.body.email);
    if (!user) throw errors.emailNotMatchAnyAccount;

    const match = await userService.userPasswordMatch(req.body.password, user.password);
    if (!match) throw errors.wrongPassword;

    const token = await jwtUtils.generateToken(user);

    logger.info(User.getAfterLoggingInMessage(user));
    res.json({ token });
  } catch (err) {
    next(err);
  }
};

exports.listUsers = (req, res, next) => {
  if (!req.query.page) return next(errors.missingParameters);

  const page = req.query.page;
  const offset = limitOfUsersPerPage * (page - 1);

  userService
    .getAllUsersWithPagination(limitOfUsersPerPage, offset)
    .then(users => {
      const pages = Math.ceil(users.count / limitOfUsersPerPage);
      res.json({ users: users.rows, count: users.count, pages });
    })
    .catch(next);
};

exports.createAdminUser = (req, res, next) => {
  const err = validateUserCreation(req.body);
  if (err) return next(err);

  userService
    .getUserByEmail(req.body.email)
    .then(user => {
      if (user) {
        if (user.firstName === req.body.firstName && user.lastName === req.body.lastName) {
          user.permission = enums.PERMISSION.ADMINISTRATOR;
          return user
            .save()
            .then(() => res.sendStatus(200))
            .catch(error => {
              throw errors.databaseError(error.message);
            });
        }

        // Email is not available for the new user
        throw errors.emailAlreadyInUse;
      } else {
        // If the email is available, a new administrator user is created
        // with the body parameters
        req.body.permission = enums.PERMISSION.ADMINISTRATOR;
        return userService.createUser(req.body).then(newUser => {
          logger.info(User.getAfterCreationMessage(newUser));
          res.sendStatus(200);
        });
      }
    })
    .catch(next);
};
