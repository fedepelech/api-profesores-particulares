'use strict';
const publicPaths = {
    get: [
    ],
    put: [],
    post: [
        'api/orders/[0-9]+/file',
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
