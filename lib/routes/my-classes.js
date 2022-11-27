'use strict';
const express = require('express');
const router = express.Router();
const logger = require('@lib/logger');
const { Class, User, Calification } = require('@lib/models');
const { getUserFromToken } = require('../utils/middlewares/general');

function validateToken(req, res, next) {
  if (!req.user) {
    return res.status(404).json({
      code: 'missing_parameters',
      message: 'Missing parameters'
    });
  }
  return next();
}

function validateRole(req, res) {
  let promise;
  if (req.user.role === 'teacher') {
    promise = getClassesByTeacher(req.user.id);
  }
  if (req.user.role === 'student') {
    promise = getClassesByStudent(req.user.id);
  }
  return promise
    .then((data) => {
      return res.status(200).json(data);
    })
}

function getClassesByTeacher(teacherId) {
  return Class.find({ teacher: teacherId }).populate([
    {
    path: 'teacher',
    model: 'User'
  }, {
    path: 'file',
    model: 'File'
  }, {
    path: 'comments',
    model: 'Comment',
    populate: {
      path: 'student',
      model: 'User'
    }
  }])
}

function getClassesByStudent(studentId) {
  let classes;
  return User.findById(studentId)
    .populate({
      path: 'classes',
      populate: [{
        path: 'teacher',
        model: 'User'
      }, {
        path: 'comments',
        model: 'Comment',
        populate: {
          path: 'student',
          model: 'User'
        }
      }
    ]
    })
    .then((data) => {
      classes = data.classes;
      return Calification.find({
        student: studentId
      }).populate('class')
    })
    .then((califications) => {
      let classesWithValorations = [];
      classes.forEach((cls) => {
        let calification = califications.find((calif) => calif.class._id.toString() === cls._id.toString()) || null;
        classesWithValorations.push({classTotal: cls, valoration: calification?.score});
      })
      return classesWithValorations;
    })
}

router.get('/my-classes',
  getUserFromToken,
  validateToken,
  validateRole
)

module.exports = router;
