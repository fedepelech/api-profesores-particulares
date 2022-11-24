'use strict';
const express = require('express');
const router = express.Router();
const logger = require('@lib/logger');
const {Comment} = require('@lib/models');
const { validateTeacherRole, checkIfExistsBody } = require('@utils/middlewares/general');
const { validateClass, getUserFromToken } = require('../utils/middlewares/general');

function validateUser(req, res, next) {
    if(!req.user) {
        return res.status(404).json({
            code: 'missing_parameters',
            message: 'Missing parameters'
        });
    }
    return next();
}

function validateId(req, res, next) {
    if(!req.body || !req.body.id || !req.body.content ) {
        return res.status(400).json({
            code: 'missing_parameters',
            message: 'Missing parameters'
        });
    }
    req.id = req.body.id;
    req.content = req.body.content;
    return next();
}

function createNewComment(req, res) {
    console.log('req.user: ', req.user);
    const newComment = new Comment({
        student: req.user.id,
        content: req.content,
        class: req.class._id.toString()
    });
    return newComment.save()
        .then((commentCreated) => {
            return res.status(200).json(commentCreated);
        })
        .catch((err) => {
            logger.error(`error in /comment/create createNewComment - ${err.message}`);
            return res.status(500).json({
                error: 'internal_error',
                message: 'Internal error'
            });
        });
}

router.post('/comment/create',
    getUserFromToken,
    validateUser,
    validateId,
    validateClass,
    createNewComment
);

module.exports = router;