const express = require('express');

const router = express.Router();
const authorizeRoles = require('../security/roleAuth');
const { ADMIN } = require('../security/securityConstants');

const { index, show, destroy, store, update } = require('./../services/genre.service');

router.get('/genres', async (req, res, next) => {
  try {
    const response = await index();
    return res.send(response);
  } catch (err) {
    next(err);
  }
});

router.get('/genres/:id', async (req, res, next) => {
  try {
    const response = await show(req.params.id);
    return res.send(response);
  } catch (err) {
    next(err);
  }
});

router.post('/genres', authorizeRoles(ADMIN), async (req, res, next) => {
  try {
    const response = await store(req.body);
    return res.send(response);
  } catch (err) {
    next(err);
  }
});

router.put('/genres/:id', authorizeRoles(ADMIN), async (req, res, next) => {
  try {
    const response = await update(req.params.id, req.body);
    return res.send(response);
  } catch (err) {
    next(err);
  }
});

router.delete('/genres/:id', authorizeRoles(ADMIN), async (req, res, next) => {
  try {
    const response = await destroy(req.params.id);
    return res.send(response);
  } catch (err) {
    next(err);
  }
});

module.exports = router;
