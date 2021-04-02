const Movie = require('./movie.model');
const User = require('./user.model');
const Roles = require('./role.model');
const Genre = require('./genre.model');
const WatchLists = require('./watch-list.model');
const Comment = require('./comment.model');
const MovieReaction = require('./movie-reaction.model');

module.exports = {
  Movie,
  User,
  Genre,
  WatchLists,
  Comment,
  Roles,
  MovieReaction
};
