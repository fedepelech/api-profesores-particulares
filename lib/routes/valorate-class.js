'use strict';
const express = require('express');
const router = express.Router();
const logger = require('@lib/logger');
const { Suscription, Calification, Class } = require('@lib/models');
const { checkIfExistsBody, validateClass } = require('@utils/middlewares/general');

function validateBody(req, res, next) {
  if (!req.body.valoration) {
    return res.status(400).json({
      code: 'missing_parameters',
      message: 'Missing parameters'
    });
  }
  req.id = req.params.id;
  return next();
}

function validateIfExist(req, res, next) {
  return Calification.findOne({
    class: req.class._id,
    student: req.user.id
  })
    .then((calif) => {
      let flag;
      if (calif) {
        flag = true;
      } else {
        flag = false
      }
      req.exist = flag;
      return next();
    })
    .catch((err) => {
      logger.error(`error in /class/${req.params.id}/valoration validateIfExist - ${err.message}`);
      return res.status(500).json({
        error: 'internal_error',
        message: 'Internal error'
      });
    });
}

function updateValoration(req) {
  return Calification.updateOne(
    { class: req.class._id, student: req.user.id },
    { $set: {
      score: req.body.valoration,
    }
  })
    .then((califUpdated) => {
      return califUpdated;
    })
    .catch((err) => {
      logger.error(`error in /class/${req.params.id}/valoration updateValoration - ${err.message}`);
      return res.status(500).json({
        error: 'internal_error',
        message: 'Internal error'
      });
    });
}

function createValoration(req) {
  let calif;
  return Calification.create({
    score: req.body.valoration,
    class: req.class._id,
    student: req.user.id
  })
    .then((califCreated) => {
      calif = califCreated;
      req.class.quantityValorations += 1;
      return req.class.save()
    })
    .then(() => {
      return calif;
    })
    .catch((err) => {
      logger.error(`error in /class/${req.params.id}/valoration createValoration - ${err.message}`);
      return res.status(500).json({
        error: 'internal_error',
        message: 'Internal error'
      });
    });
}

function createOrUpdateValoration(req, res) {
  let promise;
  if(req.exist) {
    promise = updateValoration(req);
  } else {
    promise = createValoration(req);
  }
  return promise
    .then((calif) => {
      return res.status(200).json(calif);
    })
    .catch((err) => {
      logger.error(`error in /class/${req.params.id}/valoration createOrUpdateValoration - ${err.message}`);
      return res.status(500).json({
        error: 'internal_error',
        message: 'Internal error'
      });
    });
}


router.post('/class/:id/valoration',
  checkIfExistsBody,
  validateBody,
  validateClass,
  validateIfExist,
  createOrUpdateValoration
);

module.exports = router;
