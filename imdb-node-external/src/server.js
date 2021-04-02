const express = require('express');
const morgan = require('morgan');
const bodyParser = require('body-parser');
const path = require('path');
const expressJwt = require('express-jwt');
const cors = require('cors');
const errorHandler = require('./exceptions/error.handler');

const envPath = path.resolve(process.cwd(), 'src', '.env');
require('dotenv').config({
  path: envPath,
});

const { authRoutes, movieRoutes, genreRoutes, commentRoutes, roleRoutes } = require('./routes');
const db = require('./database');

const app = express();
const port = 3000 || process.env.APP_PORT;

app.use(morgan('combined'));
app.use(bodyParser.json());

const jwtAuth = expressJwt({
  secret: process.env.JWT_SECRET,
}).unless({ path: ['/auth/register', '/auth/login', '/auth/google-login'] });

app.use(jwtAuth);
app.use(
  cors({
    origin: 'http://localhost:3001',
  }),
);

app.use(authRoutes);
app.use(roleRoutes);
app.use(movieRoutes);
app.use(genreRoutes);
app.use(commentRoutes);
app.use(errorHandler);

db.connect()
  .then(() => console.log('Connected to MongoDB!'))
  .then(seedData)
  .catch(err => console.error('Error while connecting to MongoDB.', err));

app.listen(port, () => console.log(`App started successfully! Try it at http://localhost:${port}`));

async function seedData() {
  const { User, Roles, Genre } = require('./models');

  let roles = await Roles.find().exec();
  if (!roles.length) {
    for (let roleData of [{name: 'ADMIN'}, {name: 'REGULAR'}]) {
      await Roles.create(roleData);
    }
  }

  const genres = await Genre.find().exec();
  if (!genres.length) {
    for (let genreName of ['Comedy', 'Sci-Fi', 'Horror', 'Romance', 'Action', 'Thriller', 'Drama', 'Mystery', 'Crime', 'Animation', 'Adventure', 'Fantasy']) {
      await Genre.create({ name: genreName });
    }
  }

  const users = await User.find().exec();
  if (!users.length) {
    if (!roles.length) {
      roles = await Roles.find().exec();
    }
    for (let userData of [
      { email: 'admin@imdb.com', password: 'adminpass', name: 'Admin user', roles: [roles[0]] },
      { email: 'regular@imdb.com', password: 'regularpass', name: 'Regular user', roles: [roles[1]] },
    ]) {
      await User.create(userData);
    }
  }

}
