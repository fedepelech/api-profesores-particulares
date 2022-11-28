'use strict';
const logger = require('@lib/logger');
const { Email } = require('@lib/models');
const sendEmail = require('./send-email');
const { createToken } = require('@lib/utils/jwt-utils');
const { createTokenEmail } = require('../jwt-utils');
const URL_FRONT = process.env.URL_FRONT;

function buildTemplate(reasonBlocked) {
  return `
    <h3>El docente ha bloqueado su comentario</h3>
    <p>Motivo por el cual fue bloqueado: ${reasonBlocked}</p>
  `;
}

function sendBlockedCommentEmail(emailStudent) {
  return sendEmail(
    (emailStudent.user.email) ? emailStudent.user.email : null,
    `Comentario bloqueado en la clase ${emailStudent.referenceClass.name}`,
    buildTemplate(emailStudent.reasonBlocked)
  )
    .then((res) => {
      emailStudent.logs.push(res.response);
      emailStudent.sended = true;
      return emailStudent.save();
    })
    .catch((err) => {
      logger.error(`sendBlockedCommentEmail error: ${err.message}`);
      emailStudent.logs.push(err.message);
      emailStudent.attempts++;
      return emailStudent.save();
    });
}

function sendBlockedCommentEmails() {
  if (process.env.SEND_EMAIL_ACTIVE !== 'true') {
      return Promise.resolve();
  }
  logger.debug('Init schedule send emails to notify blocked comments');
  return Email.find({
      type: 'blocked-comment',
      sended: false,
      attempts: {$lt: 3}
  })
      .populate('user referenceClass')
      .limit(parseInt(process.env.SEND_EMAIL_CANT))
      .then((emailStudents) => {
          const promises = emailStudents.map((emailStudent) => {
              return sendBlockedCommentEmail(emailStudent);
          });
          return Promise.all(promises);
      })
      .then(() => {
          logger.debug('Finish schedule send emails to notify blocked comments');
      })
      .catch((err) => {
          logger.error(`sendBlockedCommentEmails error: ${err.message}`);
      });
}

module.exports = {
    sendBlockedCommentEmails
};
