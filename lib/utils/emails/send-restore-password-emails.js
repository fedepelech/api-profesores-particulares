'use strict';
const logger = require('@lib/logger');
const { Email } = require('@lib/models');
const sendEmail = require('./send-email');
const { createToken } = require('@lib/utils/jwt-utils');
const { createTokenEmail } = require('../jwt-utils');
const URL_FRONT = process.env.URL_FRONT;

function buildTemplate(token) {
  return `
    <h3>Reestablecé tu contraseña</h3>
    <p>Para reestablecerla, click acá: ${URL_FRONT}/reset-password?token=${token}</p>
  `;
}

function sendRestorePasswordEmail(emailStudent) {
  const token = createToken(emailStudent.user, '59m');
  return sendEmail(
    (emailStudent.user.email) ? emailStudent.user.email : null,
    'Restablecer contraseña',
    buildTemplate(token)
  )
    .then((res) => {
      emailStudent.logs.push(res.response);
      emailStudent.sended = true;
      return emailStudent.save();
    })
    .catch((err) => {
      logger.error(`sendRestorePasswordEmail error: ${err.message}`);
      emailStudent.logs.push(err.message);
      emailStudent.attempts++;
      return emailStudent.save();
    });
}

function sendRestorePasswordEmails() {
  if (process.env.SEND_EMAIL_ACTIVE !== 'true') {
      return Promise.resolve();
  }
  logger.debug('Init schedule send emails to restore password');
  return Email.find({
      type: 'restore-password',
      sended: false,
      attempts: {$lt: 3}
  })
      .populate('user')
      .limit(parseInt(process.env.SEND_EMAIL_CANT))
      .then((emailStudents) => {
          const promises = emailStudents.map((emailStudent) => {
              return sendRestorePasswordEmail(emailStudent);
          });
          return Promise.all(promises);
      })
      .then(() => {
          logger.debug('Finish schedule send emails to restore password');
      })
      .catch((err) => {
          logger.error(`sendRestorePasswordEmailss error: ${err.message}`);
      });
}

module.exports = {
  sendRestorePasswordEmails
};
