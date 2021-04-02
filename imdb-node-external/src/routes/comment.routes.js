const express = require('express');

const router = express.Router();

const {
  index,
  show,
  destroy,
  store,
  update,
  getSubComments,
  createSubComment,
} = require('./../services/comment.service');

router.get('/movies/:movieId/comments', async (req, res, next) => {
  try {
    const response = await index({
      movieId: req.params.movieId,
      limit: req.query.limit,
      offset: req.query.offset,
    });
    return res.send(response);
  } catch (err) {
    next(err);
  }
});

router.get('/movies/:movieId/comments/:commentId', async (req, res, next) => {
  try {
    const response = await show(req.params);
    return res.send(response);
  } catch (err) {
    next(err);
  }
});

router.get('/movies/:movieId/comments/:commentId/sub-comments', async (req, res, next) => {
  try {
    const response = await getSubComments(req.params);
    return res.send(response);
  } catch (err) {
    next(err);
  }
});

router.post('/movies/:movieId/comments', async (req, res, next) => {
  try {
    const response = await store({ movieId: req.params.movieId, comment: req.body });
    return res.send(response);
  } catch (err) {
    next(err);
  }
});

router.put('/movies/:movieId/comments/:commentId', async (req, res, next) => {
  try {
    const response = await update({
      movieId: req.params.movieId,
      commentId: req.params.commentId,
      comment: req.body,
    });
    return res.send(response);
  } catch (err) {
    next(err);
  }
});

router.post('/movies/:movieId/comments/:commentId', async (req, res, next) => {
  try {
    const response = await createSubComment({
      movieId: req.params.movieId,
      commentId: req.params.commentId,
      comment: req.body,
    });
    return res.send(response);
  } catch (err) {
    next(err);
  }
});

router.delete('/movies/:movieId/comments/:commentId', async (req, res, next) => {
  try {
    const response = await destroy(req.params);
    return res.send(response);
  } catch (err) {
    next(err);
  }
});

module.exports = router;
