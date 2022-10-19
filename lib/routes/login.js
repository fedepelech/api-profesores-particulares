'use strict';
const express = require('express');
const router = express.Router();
const logger = require('@lib/logger');
const {User} = require('@lib/models');
const { checkIfExistsBody } = require('@utils/middlewares/general');
const { createToken } = require('@utils/jwt-utils');

function validateBodyLogin(req, res, next) {
    console.log('entra');
    if(!req.body.email || !req.body.password) {
        return res.status(400).json({
            code: 'missing_parameters',
            message: 'Missing parameters'
        });
    }
    req.email = req.body.email;
    req.password = req.body.password;
    return next();
}

function validateUser(req, res, next) {
    const emailToFind = req.email.toLowerCase();
    return User.findOne({ email: emailToFind })
        .then((user) => {
            if(!user) {
                return res.status(400).json({
                    message: 'No user linked to this email',
                    code: 'user_doesnt_exist'
                });
            }
            req.user = user;
            return next();
        })
        .catch((err) => {
            logger.error(`error in /login validateUser - ${err.message}`);
            return res.status(500).json({
                error: 'internal_error',
                message: 'Internal Error'
            });
        });
}

function login(req, res) {
    const user = req.user;
    if(!user.validPassword(req.password)) {
        return res.status(400).json({
            message: 'Invalid password',
            code: 'invalid_password'
        });
    }
    const token = createToken(user, '1d');
    return res.status(200).json({token, user});
}

router.post('/login',
    checkIfExistsBody,
    validateBodyLogin,
    validateUser,
    login
);

module.exports = router;
