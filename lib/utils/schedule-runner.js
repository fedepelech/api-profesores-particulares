'use strict';
const schedule = require('node-schedule');
const runningProcesses = new Set();
const runScheduleForRecalculate = require('./schedules/calculate-class-calification');

function runSchedule(name, func) {
    if (runningProcesses.has(name)) {
        return false;
    }
    runningProcesses.add(name);
    return func()
        .catch(() => {
            return;
        })
        .then(() => {
            runningProcesses.delete(name);
        });
}

function initSchedule() {
    schedule.scheduleJob('*/1 * * * *', () => {
        return runSchedule('runScheduleForRecalculate', runScheduleForRecalculate);
    });
}

module.exports = initSchedule;
