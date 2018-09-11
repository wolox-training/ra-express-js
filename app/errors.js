const internalError = (message, internalCode) => ({
  message,
  internalCode
});

exports.DEFAULT_ERROR = 'default_error';
exports.defaultError = message => internalError(message, exports.DEFAULT_ERROR);

exports.DATABASE_ERROR = 'database_error';
exports.databaseError = message => internalError(message, exports.DATABASE_ERROR);

exports.INVALID_USER_PARAMETERS = 'invalid_user_parameters';
exports.invalidUserParameters = internalError(
  'Missing obligatory parameters',
  exports.INVALID_USER_PARAMETERS
);

exports.INVALID_USER_EMAIL = 'invalid_user_email';
exports.invalidUserEmail = internalError('Invalid email', exports.INVALID_USER_EMAIL);

exports.INVALID_USER_PASSWORD = 'invalid_user_password';
exports.invalidUserPassword = internalError('Invalid password', exports.INVALID_USER_PASSWORD);

exports.EMAIL_ALREADY_IN_USE = 'email_already_in_use';
exports.emailAlreadyInUse = internalError('Email is already in use', exports.EMAIL_ALREADY_IN_USE);
