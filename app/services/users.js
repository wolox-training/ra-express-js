const User = require('../models/').User;

exports.emailIsAvailable = email => {
  return User.findOne({
    where: {
      email
    }
  }).then(user => {
    if (user) return Promise.resolve(false);
    return Promise.resolve(true);
  });
};
