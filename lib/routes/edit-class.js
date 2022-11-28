'use strict';
const express = require('express');
const router = express.Router();
const logger = require('@lib/logger');
const {Class} = require('@lib/models');
const { checkIfExistsBody, validateTeacherRole, validateClass } = require('@utils/middlewares/general');

function validateBodyEditClass(req, res, next) {
  const { name, subject, cost, quantityClasses, frequency, type, description, status } = req.body;
  if (!name || !subject || !cost || !quantityClasses || !frequency || !type || !description || !status) {
    return res.status(400).json({
      code: 'missing_parameters',
      message: 'Missing parameters'
    });
  }
  req.id = req.params.id;
  return next();
}

function validateOwner(req, res, next) {
  const classToEdit = req.class;
  if(req.user.id !== classToEdit.teacher._id.toString()) {
    return res.status(401).json({
      code: 'unauthorized (not owner)',
      message: 'Unauthorized (not owner)'
    })
  }
  return next();
}

function updateClass(req, res) {
  return Class.updateOne(
    {_id: req.class._id},
    { $set: {
        name: req.body.name,
        subject: req.body.subject,
        cost: req.body.cost,
        duration: req.body.quantityClasses,
        frequency: req.body.frequency,
        grupal: req.body.type === 'Grupal',
        description: req.body.description,
        status: req.body.status
      }
    })
      .then((classUpdated) => {
        return res.status(200).json(classUpdated);
      })
      .catch((err) => {
        logger.error(`error in /class/${req.params.id}/edit updateClass - ${err.message}`);
        return res.status(500).json({
            error: 'internal_error',
            message: 'Internal error'
        });
      });
}

router.post('/class/:id/edit',
  validateTeacherRole,
  checkIfExistsBody,
  validateBodyEditClass,
  validateClass,
  validateOwner,
  updateClass
);

module.exports = router;