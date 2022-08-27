'use strict';
const {Class} = require('@lib/models');

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

function validateClass(req, res, next) {
    return Class.findById(req.id)
        .populate('teacher')
        .then((classFound) => {
            if(!classFound) {
                return res.status(404).json({
                    code: 'invalid_id',
                    message: 'Not found any class'
                });
            }
            req.class = classFound;
            return next();
        })
}

module.exports = {
    checkIfExistsBody,
    validateTeacherRole,
    validateClass
};
