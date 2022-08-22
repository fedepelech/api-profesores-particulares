'use strict';
const logger = require('@lib/logger');
const NOTIFICATIONS_ON = (process.env.NOTIFICATIONS_ON === 'true');
const NOTIFICATIONS_GROUP_QUANT = parseInt(process.env.NOTIFICATIONS_GROUP_QUANT || 10);
const {GeneralCalification, Calification} = require('@lib/models');

function recalculateScoreOfCalification() {
    return GeneralCalification.find({recalculate: true})
        .then((classCalifications) => {
            let promises = classCalifications.map((classCalification) => {
                return Calification.find({class: classCalification.class})
                    .then((califications) => {
                        let sum = 0;
                        califications.forEach((calification) => sum += calification.score);
                        classCalification.score = sum / califications.length;
                        classCalification.recalculate = false;
                        return classCalification.save();
                    })
                    .catch((err) => {
                        logger.error(`getGeneralCalifications error: ID: ${classCalification._id} - ERROR: ${err.message}`);
                    })
            });
            return Promise.all(promises);
        })
}

function runScheduleForRecalculate() {
    if(!NOTIFICATIONS_ON) {
        return Promise.resolve();
    }
    return recalculateScoreOfCalification()
        .then(() => {
            logger.info(`recalculateScoreOfCalification finish successfully`);
        });
}

module.exports = runScheduleForRecalculate;