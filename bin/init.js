'use strict';
require('dotenv').config();
require('module-alias/register');
const {initializeDb} = require('@lib/models');
const app = require('../app');
const logger = require('@lib/logger');
const scheduleRunner = require('@lib/utils/schedule-runner');

return initializeDb()
    .then(() => {
        const application = app.initialize();
        application.listen(process.env.SERVER_PORT);
        logger.info(`Your server is listening on port ${process.env.SERVER_PORT}`);
        scheduleRunner();
    })
    .catch((error) => {
        logger.error('APP STOPPED');
        logger.error(error.stack);
        return process.exit(1);
    });
