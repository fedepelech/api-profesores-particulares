'use strict';
const schedule = require('node-schedule');
const runningProcesses = new Set();
// const sendPendingNotificationsUserConfirmation = require('./schedules/send-notifications-user-confirmation');

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
    // schedule.scheduleJob('*/1 * * * *', () => {
    //     return runSchedule('sendPendingNotificationsOrderCreated', sendPendingNotificationsOrderCreated);
    // });
}

module.exports = initSchedule;
