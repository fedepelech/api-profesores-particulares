'use strict';
const express = require('express');
const router = express.Router();
const {upload} = require('@utils/multer');
const {File} = require('@lib/models');
const logger = require('@lib/logger');

function createFile(req, res) {
    if (!req.file) {
        return res.status(400).json({
            errorMessage: 'Missing file',
            errorCode: 'missing_file'
        });
    }
    const fileToCreate = new File({
        name: req.file.filename,
        path: req.file.path,
        mime: req.file.mimetype,
        size: req.file.size
    })
    return fileToCreate.save()
        .then((file) => {
            return res.status(200).json({
                id: file.id
            });
        })
        .catch((err) => {
            logger.error(`ERROR in /upload-file createFile ${err.message}`);
            return res.status(500).json({
                code: 'internal_error',
                message: 'Internal error'
            });
        });
}

router.post('/upload-file',
    upload.single('file'),
    createFile
);

module.exports = router;