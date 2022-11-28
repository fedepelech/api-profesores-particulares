'use strict';
const express = require('express');
const router = express.Router();
const logger = require('@lib/logger');
const {Comment, Email} = require('@lib/models');
const { validateClass, checkIfExistsBody } = require('@utils/middlewares/general');

function validateBody(req, res, next) {
    if(!req.body.commentId || !req.body.status) {
        return res.status(400).json({
            code: 'missing_parameters',
            message: 'Missing parameters'
        });
    }
    if(!['Aceptado', 'Bloqueado'].includes(req.body.status)) {
        return res.status(400).json({
            code: 'invalid_status',
            message: 'Invalid status'
        });
    }
    if(req.body.status === 'Bloqueado' && !req.body.reasonBlocked) {
        return res.status(400).json({
            code: 'missing_parameters',
            message: 'Missing_parameters'
        });
    }
    req.id = req.params.id;
    return next();
}

function updateComment(req, res) {
    let commentToSave;
    return Comment.findById(req.body.commentId).populate('student')
        .then((comment) => {
            if(!comment) {
                return res.status(404).json({
                    code: 'invalid_id',
                    message: 'Not found any comment'
                });
            }
            commentToSave = comment;
            comment.status = req.body.status;
            comment.reasonBlocked = req.body.reasonBlocked;
            return comment.save();
        })
        .then((commentSaved) => {
            if(commentSaved.status === 'Bloqueado') {
                const newEmailNotification = new Email({
                    referenceClass: req.class._id,
                    user: commentToSave.student._id,
                    type: 'blocked-comment',
                    reasonBlocked: req.body.reasonBlocked
                })
                return newEmailNotification.save()
            } else {
                return Promise.resolve();
            }
        })
        .then(() => {
            return res.status(200).json({});
        })
        .catch((err) => {
            logger.error(`error in /class/${req.id}/status-comment updateComment - ${err.message}`);
            return res.status(500).json({
                error: 'internal_error',
                message: 'Internal error'
            });
        });
}

router.post('/class/:id/status-comment',
    checkIfExistsBody,
    validateBody,
    validateClass,
    updateComment
);

module.exports = router;