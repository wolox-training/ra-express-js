const internalError = (message, internalCode) => ({
  message,
  internalCode
});

exports.DEFAULT_ERROR = 'default_error';
exports.defaultError = message => internalError(message, exports.DEFAULT_ERROR);

exports.DATABASE_ERROR = 'database_error';
exports.databaseError = message => internalError(message, exports.DATABASE_ERROR);

exports.MISSING_PARAMETERS = 'missing_parameters';
exports.missingParameters = internalError('Missing obligatory parameters', exports.MISSING_PARAMETERS);

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

exports.NO_ADMINISTRATOR_PERMISSION = 'no_administrator_permission';
exports.noAdministratorPermission = internalError(
  'Do not have administrator permission',
  exports.NO_ADMINISTRATOR_PERMISSION
);

exports.ALBUMS_API_ERROR = 'albums_api_error';
exports.albumsApiError = message => internalError(message, exports.ALBUMS_API_ERROR);

exports.ALBUM_ALREADY_HAS_OWNER_USER = 'album_already_has_owner_user';
exports.albumAlreadyHasOwnerUser = internalError(
  'The album already has an owner user',
  exports.ALBUM_ALREADY_HAS_OWNER_USER
);

exports.USER_ALREADY_HAS_THE_ALBUM = 'user_already_has_the_album';
exports.userAlreadyHasTheAlbum = internalError(
  'User already has the album',
  exports.USER_ALREADY_HAS_THE_ALBUM
);

exports.ALBUM_NOT_EXISTS = 'album_not_exists';
exports.albumNotExists = internalError('The album does not exist', exports.ALBUM_NOT_EXISTS);
