const config = require('../../config'),
  fetch = require('../../node_modules/node-fetch');

exports.getAllAlbums = () => {
  return fetch(config.common.albumsApi.uri).then(response => response.json());
};
