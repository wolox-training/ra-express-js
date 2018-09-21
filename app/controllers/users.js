const { User } = require('../models/'),
  userService = require('../services/users'),
  errors = require('../errors'),
  logger = require('../logger'),
  jwt = require('../../node_modules/jsonwebtoken'),
  enums = require('../enums');

const validEmailPattern = /^[a-zA-Z0-9_.+-]+@wolox\.com\.ar$/g,
  validPasswordPattern = /^(?=.*[A-Za-z])(?=.*\d)[A-Za-z\d]{8,}$/g,
  limitOfUsersPerPage = 2;

const obligatoryParametersWereReceived = body =>
  body.firstName && body.lastName && body.email && body.password;

const emailIsValid = email => email.match(validEmailPattern);

const passwordIsValid = password => password.match(validPasswordPattern);

const validateUserCreation = parameters => {
  if (!obligatoryParametersWereReceived(parameters)) throw errors.invalidParameters;

  if (!emailIsValid(parameters.email)) throw errors.invalidUserEmail;

  if (!passwordIsValid(parameters.password)) throw errors.invalidUserPassword;
};

exports.createUser = (req, res, next) => {
  try {
    validateUserCreation(req.body);
  } catch (err) {
    return next(err);
  }

  const filter = {
    email: req.body.email
  };

  userService
    .getUsersByFilter(filter)
    .then(users => {
      if (users[0]) throw errors.emailAlreadyInUse;
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
    jwt.sign({ id: user.id, email: user.email }, process.env.JWT_KEY, (err, token) => {
      if (err) return reject(errors.defaultError(err.message));

      resolve(token);
    });
  });
};

exports.logIn = async (req, res, next) => {
  if (!req.body.email || !req.body.password) return next(errors.invalidParameters);

  if (!emailIsValid(req.body.email)) return next(errors.invalidUserEmail);

  try {
    const user = await userService.getUserByEmail(req.body.email);
    if (!user) throw errors.emailNotMatchAnyAccount;

<<<<<<< 8925755d711e8d0b74ac4bfd2bbc98fb4acfaf48
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
  const page = req.query.page;
  const offset = limitOfUsersPerPage * (page - 1);

  userService
    .getAllUsersWithPagination(limitOfUsersPerPage, offset)
    .then(users => {
      const pages = Math.ceil(users.count / limitOfUsersPerPage);
      res.status(200).json({ users: users.rows, count: users.count, pages });
=======
  const filter = {
    email: req.body.email
  };

  userService
    .getUsersByFilter(filter)
    .then(users => {
      if (!users[0]) throw errors.emailNotMatchAnyAccount;
      usr = users[0];
      return User.passwordMatch(req.body.password, users[0].password);
    })
    .then(match => {
      if (!match) throw errors.wrongPassword;

      jwt.sign({ id: usr.id, email: usr.email }, process.env.JWT_KEY, (err, token) => {
        if (err) throw errors.defaultError(err.message);
        logger.info(User.getAfterLoggingInMessage(usr));
        res.status(200).json({ token });
      });
>>>>>>> Creation of administrator user. Update of regular user to administrator user.
    })
    .catch(next);
};

exports.listUsers = (req, res, next) => {
  const page = req.params.page;
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

  let userExisted = false;

  const filter = {
    firstName: req.body.firstName,
    lastName: req.body.lastName,
    email: req.body.email
  };

  userService
    .getUsersByFilter(filter)
    .then(users => {
      if (users[0]) {
        users[0].permission = enums.PERMISSION.ADMINISTRATOR;
        userExisted = true;
        return users[0].save();
      }

      const emailFilter = {
        email: req.body.email
      };

      return userService.getUsersByFilter(emailFilter);
    })
    .then(users => {
      // If there is no user matching with the body parameters, it is
      // checked that the email is not in use in order to create properly
      // the new user
      if (!userExisted) {
        if (users[0]) throw errors.emailAlreadyInUse;

        // If the email is available, a new administrator user is created
        // with the body parameters
        req.body.permission = enums.PERMISSION.ADMINISTRATOR;
        userExisted = false;
        return userService.createUser(req.body);
      }
    })
    .then(user => {
      if (!userExisted) logger.info(User.getAfterCreationMessage(user));
      res.sendStatus(200);
    })
    .catch(next);
};
