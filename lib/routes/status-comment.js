'use strict';
const express = require('express');
const router = express.Router();
const logger = require('@lib/logger');
const {Comment, Class} = require('@lib/models');
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
    return Comment.findById(req.body.commentId)
        .then((comment) => {
            if(!comment) {
                return res.status(404).json({
                    code: 'invalid_id',
                    message: 'Not found any comment'
                });
            }
            comment.status = req.body.status;
            comment.reasonBlocked = req.body.reasonBlocked;
            return comment.save();
        })
        .then((commentSaved) => {
            return res.status(200).json(commentSaved);
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