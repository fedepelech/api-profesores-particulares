'use strict';

const multer = require('multer');

const storage = multer.diskStorage({
    destination(req, file, cb) {
        cb(null, process.env.FILE_UPLOAD_PATH);
    },
    filename(req, file, cb) {
        const fileName = new Date().toISOString() + file.originalname;
        req.fileName = fileName;
        cb(null, fileName);
    }
});

const upload = multer({
    storage,
    limits: {
        fileSize: parseInt(process.env.FILE_UPLOAD_MAX_SIZE, 10) || 20971520
    }
});

module.exports = {
    upload
};
