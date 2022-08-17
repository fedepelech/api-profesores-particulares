'use strict';
const jwt = require('jsonwebtoken');

function createToken(data, expiration) {
    return jwt.sign(data, process.env.JWT_SECRET, {
        expiresIn: expiration,
        issuer: process.env.JWT_ISSUER
    });
}

function getJwt(request) {
    var token;
    if (request.headers.authorization && request.headers.authorization.indexOf('Bearer') !== -1) {
        token = request.headers.authorization.replace('Bearer ', '');
    } else if (request.query && request.query.jwt) {
        token = request.query.jwt;
    }
    return token;
}

function extractJwt(request, response, next) {
    jwt.verify(getJwt(request), process.env.JWT_SECRET, (err, decoded) => {
        if (err) {
            return response.status(401).json({
                errorCode: 401,
                userMessage: 'Unauthorized'
            });
        }
        request.user = decoded;
        return next();
    });
}

module.exports = {
    createToken,
    extractJwt,
    getJwt
};
