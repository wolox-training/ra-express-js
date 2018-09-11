const User = require('../models/').User,
  errors = require('../errors');

exports.emailIsAvailable = email => {
  return User.findOne({
    where: {
      email
    }
  })
    .then(user => {
      if (user) return Promise.resolve(false);
      return Promise.resolve(true);
    })
    .catch(error => {
      throw errors.databaseError(error.message);
    });
};
