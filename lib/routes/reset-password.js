// 'use strict';
// const express = require('express');
// const router = express.Router();
// const logger = require('@lib/logger');
// const {User} = require('@lib/models');
// const { checkIfExistsBody } = require('../utils/middlewares/general');

// function validateBody(req, res, next) {
//     if (!req.body.email) {
//         return res.status(403).json({
//             code: 'email_required',
//             message: 'Email required'
//         });
//     }
//     req.email = req.body.email;
//     return next();
// }

// function validateEmailUser(req, res, next) {
//     return User.findOne({email: req.email})
//         .then((user) => {
//             if(!user) {
//                 return res.status(403).json({
//                     code: 'user_doesnt_exist',
//                     message: 'User doesnt exist'
//                 });
//             }

//         })
// }

// router.post('/me/password/restore', 
//     checkIfExistsBody,

// );

// module.exports = router;
