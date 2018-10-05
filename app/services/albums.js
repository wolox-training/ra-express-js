const config = require('../../config'),
  fetch = require('node-fetch'),
  errors = require('../errors');

exports.getAllAlbums = () => {
  return fetch(config.common.albumsApi.uri)
    .then(res => res.json())
    .catch(error => {
      throw errors.albumsApiError(error.message);
    });
};
