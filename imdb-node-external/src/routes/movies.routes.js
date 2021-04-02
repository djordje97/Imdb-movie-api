const express = require('express');

const router = express.Router();
const authorizeRoles = require('../security/roleAuth');
const { ADMIN } = require('../security/securityConstants');

const {
  index,
  show,
  destroy,
  store,
  update,
  addToWatchList,
  removeFromWatchList,
  getTopRated,
  getRelatedMovies,
  reactOnMovie
} = require('./../services/movies.service');
const { route } = require('./auth.routes');

router.get('/movies', async (req, res, next) => {
  try {
    const response = await index(req.query);
    return res.send(response);
  } catch (err) {
    next(err);
  }
});

router.get('/movies/top-rated', async (req, res, next) => {
  try {
    const response = await getTopRated(req.query);
    return res.send(response);
  } catch (err) {
    next(err);
  }
});

router.get('/movies/:id', async (req, res, next) => {
  try {
    const response = await show(req.params.id);
    return res.send(response);
  } catch (err) {
    next(err);
  }
});

router.post('/movies/:id/related', async (req, res, next) => {
  try {
      const response = await getRelatedMovies(req.body);
      return res.send(response);
  } catch (err) {
    next(err)
  }
});

router.post('/movies', authorizeRoles(ADMIN), async (req, res, next) => {
  try {
    const response = await store(req.body);
    return res.send(response);
  } catch (err) {
    next(err);
  }
});

router.post('/movies/:id/watch', async (req, res, next) => {
  try {
    const response = await addToWatchList(req.params.id, req.user);
    return res.send(response);
  } catch (err) {
    next(err);
  }
});

router.put('/movies/:id/react', async(req, res, next) =>{
  try{
    const response = await reactOnMovie(req.params.id, req.body, req.user);

    res.send(response);
  } catch(err) {
    next(err);
  }
});

router.put('/movies/:id', authorizeRoles(ADMIN), async (req, res, next) => {
  try {
    const response = await update(req.params.id, req.body);
    return res.send(response);
  } catch (err) {
    next(err);
  }
});

router.delete('/movies/:id/watch', async (req, res, next) => {
  try {
    const response = await removeFromWatchList(req.params.id, req.user);
    return res.send(response);
  } catch (err) {
    next(err);
  }
});

router.delete('/movies/:id', async (req, res, next) => {
  try {
    const response = await destroy(req.params.id);
    return res.send(response);
  } catch (err) {
    next(err);
  }
});

module.exports = router;
