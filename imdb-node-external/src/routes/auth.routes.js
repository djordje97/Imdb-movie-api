const express = require('express');

const router = express.Router();

const {
  me,
  register,
  login,
  googleLogin,
  logout,
  refresh,
  getWatchList,
} = require('./../services/user.service');

router.get('/auth/me', (req, res) => res.json(me(req.user)));
router.post('/auth/register', (req, res) =>
  register(req.body)
    .then(data => res.json(data))
    .catch(err => res.json(err, 500)),);
router.post('/auth/login', (req, res) =>
  login(req.body)
    .then(data => res.json(data))
    .catch(err => res.json(err.message, 500)),);
router.post('/auth/google-login', (req, res) =>
  googleLogin(req.body)
    .then(data => res.json(data))
    .catch(err => res.json(err.message, 500)),);
router.post('/auth/logout', (req, res) => res.json(logout()));
router.post('/auth/refresh', (req, res) => res.json(refresh()));
router.get('/user/watch-list', async (req, res) => res.send(await getWatchList(req.user)));

module.exports = router;
