const authRoutes = require('./auth.routes');
const movieRoutes = require('./movies.routes');
const roleRoutes = require('./role.routes');
const genreRoutes = require('./genre.routes');
const commentRoutes = require('./comment.routes');

module.exports = {
  authRoutes,
  movieRoutes,
  genreRoutes,
  commentRoutes,
  roleRoutes,
};
