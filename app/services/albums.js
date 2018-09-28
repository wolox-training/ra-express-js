const config = require('../../config'),
  fetch = require('../../node_modules/node-fetch'),
  errors = require('../errors');

exports.getAllAlbums = () => {
  return fetch(config.common.albumsApi.uri)
    .then(response => response.json())
    .catch(error => {
      throw errors.albumsApiError(error.message);
    });
};
