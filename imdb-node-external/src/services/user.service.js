const jwt = require('jsonwebtoken');
const axios = require('axios');
const HttpError = require('../exceptions/exceptions');
const { User } = require('./../models');
const { WatchLists } = require('./../models');
const { findByName } = require('./../services/role.service');

const EXTERNAL_ENDPOINTS = {
  GOOGLE_PLUS: process.env.GOOGLE_PLUS_API,
};

const me = token => token.user;

const register = async ({ email, password, name }) => {
  if (!email || !password || !name) {
    return { err: 'Malformed request data' };
  }

  const regularRole = await findByName('REGULAR');

  const user = new User({
    email,
    password,
    name,
    roles: [regularRole],
  });

  return user.save();
};

const login = ({ email, password }) =>
  new Promise(async (resolve, reject) => {
    if (!email || !password) {
      return reject(new Error('Provide email and password!'));
    }
    const user = await User.findOne({ email: email.toLowerCase() }).populate('roles');

    if (!user) return reject(new Error(`Could not find user with e-mail ${email}`));

    try {
      const passed = await user.comparePassword(password);

      if (!passed) {
        return reject(new Error('Wrong password!'));
      }

      const token = jwt.sign({ user }, process.env.JWT_SECRET, {
        expiresIn: parseInt(process.env.JWT_EXPIRE, 10),
      });

      return resolve({
        user,
        token,
      });
    } catch (err) {
      return reject(err);
    }
  });

const googleLogin = async ({ accessToken, googleId }) => {
  if (!accessToken || !googleId) {
    throw new HttpError(400, 'Provide access token and google id!');
  }
  try {
    const { data } = await axios.get(
      `${EXTERNAL_ENDPOINTS.GOOGLE_PLUS}/${googleId}?access_token=${accessToken}`
    );

    const email = data.emails[0].value;

    let user = await User.findOne({ email: email.toLowerCase() }).populate('roles');

    if (!user) {
      const name = data.displayName;
      const regularRole = await findByName('REGULAR');
      user = new User({
        email,
        name,
        roles: [regularRole],
      });
      await user.save();
    }
    const token = jwt.sign({ user }, process.env.JWT_SECRET, {
      expiresIn: parseInt(process.env.JWT_EXPIRE, 10),
    });

    return {
      user,
      token,
    };
  } catch (err) {
    throw err;
  }
};

const getWatchList = async token => {
  try {
    const watchedMovies = await WatchLists.find({ user: me(token)._id }, { movie: 1 });
    if (!watchedMovies) {
      throw new HttpError(400, 'No movie with that id');
    }
    return watchedMovies;
  } catch (err) {
    throw err;
  }
};

const logout = () => {
  // Todo
};

const refresh = () => {
  // Todo
};

module.exports = {
  me,
  register,
  login,
  googleLogin,
  logout,
  refresh,
  getWatchList,
};
