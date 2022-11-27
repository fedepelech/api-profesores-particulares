'use strict';
const publicPaths = {
    get: [
        'api/teacher/[a-z0-9]+',
        'api/classes',
    ],
    put: [],
    post: [
        'api/signup',
        'api/login',
        'api/me/password/restore'
    ],
    delete: []
};

function regex(method) {
    const prefix = '^\/';
    const pathRegexStr = prefix + publicPaths[method.toLowerCase()].map((path) => {
        return `(?!${path})`;
    }).join('') + '.*';
    return new RegExp(pathRegexStr, 'i');
}

module.exports = {
    regex
};
