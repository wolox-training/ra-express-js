const config = require('../../config'),
  fetch = require('../../node_modules/node-fetch'),
  errors = require('../errors'),
  { Album } = require('../models/');

exports.getAllAlbums = () => {
  return fetch(config.common.albumsApi.uri)
    .then(res => res.json())
    .catch(error => {
      throw errors.albumsApiError(error.message);
    });
};

exports.getAlbumById = id => {
  return fetch(`${config.common.albumsApi.uri}/${id}`)
    .then(res => res.json())
    .catch(error => {
      throw errors.albumsApiError(error.message);
    });
};

exports.getLocalAlbumsByFilter = filter => {
  return Album.findAll({
    where: filter
  }).catch(error => {
    throw errors.databaseError(error.message);
  });
};

exports.createAlbum = albumParameters => {
  return Album.create({
    id: albumParameters.id,
    userId: albumParameters.userId,
    title: albumParameters.title
  }).catch(error => {
    throw errors.databaseError(error.message);
  });
};
