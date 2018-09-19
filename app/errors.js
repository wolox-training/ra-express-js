const internalError = (message, internalCode) => ({
  message,
  internalCode
});

exports.DEFAULT_ERROR = 'default_error';
exports.defaultError = message => internalError(message, exports.DEFAULT_ERROR);

exports.DATABASE_ERROR = 'database_error';
exports.databaseError = message => internalError(message, exports.DATABASE_ERROR);

exports.INVALID_PARAMETERS = 'invalid_parameters';
exports.invalidParameters = internalError('Missing obligatory parameters', exports.INVALID_PARAMETERS);

exports.INVALID_USER_EMAIL = 'invalid_user_email';
exports.invalidUserEmail = internalError('Invalid email', exports.INVALID_USER_EMAIL);

exports.INVALID_USER_PASSWORD = 'invalid_user_password';
exports.invalidUserPassword = internalError('Invalid password', exports.INVALID_USER_PASSWORD);

exports.EMAIL_ALREADY_IN_USE = 'email_already_in_use';
exports.emailAlreadyInUse = internalError('Email is already in use', exports.EMAIL_ALREADY_IN_USE);

exports.EMAIL_NOT_MATCH_ANY_ACCOUNT = 'email_not_match_any_account';
exports.emailNotMatchAnyAccount = internalError(
  'Email does not match any account',
  exports.EMAIL_NOT_MATCH_ANY_ACCOUNT
);

exports.WRONG_PASSWORD = 'wrong_password';
exports.wrongPassword = internalError('Wrong password', exports.WRONG_PASSWORD);

exports.NO_TOKEN_PROVIDED = 'no_token_provided';
exports.noTokenProvided = internalError('No token provided for authentication', exports.NO_TOKEN_PROVIDED);
