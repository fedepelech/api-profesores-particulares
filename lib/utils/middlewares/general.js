'use strict';

function checkIfExistsBody(req, res, next) {
    if (!req.body || Object.keys(req.body).length === 0) {
        return res.status(400).json({
            code: 'empty_body',
            message: 'The body can not be empty'
        });
    }
    return next();
}

function validateTeacherRole(req, res, next) {
    if(!req.user || req.user.role !== 'teacher') {
        return res.status(400).json({
            code: 'unauthorized',
            message: 'Unauthorized'
        });
    }
    return next();
}

module.exports = {
    checkIfExistsBody,
    validateTeacherRole,
};
