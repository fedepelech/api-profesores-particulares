'use strict';
const jwt = require('jsonwebtoken');
const {JWT_SECRET, JWT_ISSUER} = process.env;

function createToken(user, expiration) {
    return jwt.sign(user.toToken(), JWT_SECRET, {
        expiresIn: expiration,
        issuer: JWT_ISSUER
    });
}

function createTokenEmail(data, expiresIn) {
    const token = jwt.sign(
        data,
        JWT_SECRET,
        {
            expiresIn,
            issuer: JWT_ISSUER
        }
    );
    return token;
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
                code: 'unauthorized',
                message: 'Unauthorized'
            });
        }
        request.user = decoded;
        return next();
    });
}

module.exports = {
    createToken,
    createTokenEmail,
    extractJwt,
    getJwt
};
