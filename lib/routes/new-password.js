'use strict';
const express = require('express');
const router = express.Router();
const logger = require('@lib/logger');
const {User, Email} = require('@lib/models');
const { checkIfExistsBody, getUserFromToken } = require('../utils/middlewares/general');

function validateBody(req, res, next) {
    if(!req.body.newPassword) {
        return res.status(403).json({
            code: 'newPassword_required',
            message: 'New password is required'
        });
    }
    req.password = req.body.newPassword;
    return next();
}

function getUser(req, res) {
    return User.findById(req.user.id)
        .then((user) => {
            if(!user) {
                return res.status(403).json({
                    code: 'user_doesnt_exist',
                    message: 'User doesnt exist'
                });
            }
            user.password = req.password;
            return user.save();
        })
        .then((userSaved) => {
            return res.status(200).json(userSaved);
        })
        .catch((err) => {
            logger.error(`Error in /me/new-password, ${err.message}`);
            return res.status(500).json({
                code: 'internal_error',
                message: 'Internal Error'
            });
        });
}

router.post('/me/new-password',
    checkIfExistsBody,
    validateBody,
    getUser
);

module.exports = router;