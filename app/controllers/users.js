const { User } = require('../models/'),
  userService = require('../services/users'),
  errors = require('../errors'),
  logger = require('../logger'),
  jwt = require('../../node_modules/jsonwebtoken'),
  enums = require('../enums'),
  config = require('../../config');

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

  const filter = {
    email: req.body.email
  };

  userService
    .getUsersByFilter(filter)
    .then(users => {
      const [user] = users;
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
    jwt.sign(
      { id: user.id, email: user.email, permission: user.permission },
      config.common.session.secret,
      (err, token) => {
        if (err) return reject(errors.defaultError(err.message));

        resolve(token);
      }
    );
  });
};

exports.logIn = async (req, res, next) => {
  if (!req.body.email || !req.body.password) return next(errors.missingParameters);

  if (!emailIsValid(req.body.email)) return next(errors.invalidUserEmail);

  const filter = {
    email: req.body.email
  };

  try {
    const users = await userService.getUsersByFilter(filter);
    const [user] = users;
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

exports.createAdminUser = (req, res, next) => {
  try {
    validateUserCreation(req.body);
  } catch (err) {
    return next(err);
  }

  const filter = {
    firstName: req.body.firstName,
    lastName: req.body.lastName,
    email: req.body.email
  };

  userService
    .getUsersByFilter(filter)
    .then(users => {
      const [user] = users;
      if (user) {
        user.permission = enums.PERMISSION.ADMINISTRATOR;
        return user
          .save()
          .then(() => res.sendStatus(200))
          .catch(error => {
            throw errors.databaseError(error.message);
          });
      }

      const emailFilter = {
        email: req.body.email
      };

      return userService
        .getUsersByFilter(emailFilter)
        .then(usersWithEmail => {
          const [userWithEmail] = usersWithEmail;
          // If there is no user matching with the body parameters, it is
          // checked that the email is not in use in order to create properly
          // the new user
          if (userWithEmail) throw errors.emailAlreadyInUse;

          // If the email is available, a new administrator user is created
          // with the body parameters
          req.body.permission = enums.PERMISSION.ADMINISTRATOR;
          return userService.createUser(req.body);
        })
        .then(newUser => {
          logger.info(User.getAfterCreationMessage(newUser));
          res.sendStatus(200);
        });
    })
    .catch(next);
};
