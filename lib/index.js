'use strict';

/* eslint-disable import/no-unresolved */
const mailjet = require('node-mailjet');
const { removeUndefined } = require('strapi-utils');

module.exports = {
  init: (providerOptions = {}, settings = {}) => {
    const mailjetClient = mailjet.connect(
      providerOptions.publicApiKey,
      providerOptions.secretApiKey,
    );
    return {
      send: options => {
        return new Promise((resolve, reject) => {
          const {
            from,
            fromName,
            to,
            toName,
            cc,
            ccName,
            bcc,
            bccName,
            replyTo,
            subject,
            text,
            html,
            attachments,
            ...rest
          } = options;

          const msg = {
            Messages: [
              {
                From: {
                  Email: from || settings.defaultFrom,
                  Name: fromName || settings.defaultFromName,
                },
                To: [
                  {
                    Email: to || settings.defaultTo,
                    Name: toName || settings.defaultToName,
                  },
                ],
                Subject: subject,
                TextPart: text,
                HTMLPart: html,
                ...rest,
              },
            ],
          };
          if (cc || settings.defaultCc) {
            msg.Cc = [
              {
                Email: cc || settings.defaultCc,
                Name: ccName || settings.defaultCcName,
              },
            ];
          }
          if (bcc || settings.defaultBcc) {
            msg.Bcc = [
              {
                Email: bcc || settings.defaultBcc,
                Name: bccName || settings.defaultBccName,
              },
            ];
          }
          if (attachments) msg.Attachments = attachments;

          mailjetClient
            .post('send', { version: 'v3.1' })
            .request(removeUndefined(msg))
            .then(resolve)
            .catch(error => reject(error));
        });
      },
    };
  },
};
