'use strict';
const express = require('express');
const router = express.Router();
const logger = require('@lib/logger');
const {Comment, Class} = require('@lib/models');
const { validateClass } = require('@utils/middlewares/general');

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
    let newCommentCreated;
    const newComment = new Comment({
        student: req.user.id,
        content: req.content,
        class: req.class._id.toString()
    });
    return newComment.save()
        .then((commentCreated) => {
            newCommentCreated = commentCreated;
            req.class.comments.push(commentCreated);
            return req.class.save()
        })
        .then(() => {
            return res.status(200).json(newCommentCreated);
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
    validateId,
    validateClass,
    createNewComment
);

module.exports = router;