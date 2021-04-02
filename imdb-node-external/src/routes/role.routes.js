const express = require('express');

const router = express.Router();
const authorizeRoles = require('../security/roleAuth');
const { ADMIN } = require('../security/securityConstants');

const { show, index, store, update, destroy } = require('./../services/role.service');

router.get('/roles', authorizeRoles(ADMIN), async (req, res, next) => {
  try {
    const response = await index();
    return res.send(response);
  } catch (err) {
    next(err);
  }
});

router.get('/roles/:id', authorizeRoles(ADMIN), async (req, res, next) => {
  try {
    const response = await show(req.params.id);
    return res.send(response);
  } catch (err) {
    next(err);
  }
});

router.post('/roles', authorizeRoles(ADMIN), async (req, res, next) => {
  try {
    const response = await store(req.body);
    return res.send(response);
  } catch (err) {
    next(err);
  }
});

router.put('/roles/:id', authorizeRoles(ADMIN), async (req, res, next) => {
  try {
    const response = await update(req.params.id, req.body);
    return res.send(response);
  } catch (err) {
    next(err);
  }
});

router.delete('/roles/:id', authorizeRoles(ADMIN), async (req, res, next) => {
  try {
    const response = await destroy(req.params.id);
    return res.send(response);
  } catch (err) {
    next(err);
  }
});

module.exports = router;
