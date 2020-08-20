'use strict';

/* eslint-disable import/no-unresolved */
const mailjet = require('node-mailjet');
const { removeUndefined } = require('strapi-utils');

module.exports = {
  init: (providerOptions = {}, settings = {}) => {
    //
    const mailjetClient = mailjet.connect(
      providerOptions.publicApiKey,
      providerOptions.secretApiKey,
    );

    return {
      send: options => {
        return new Promise((resolve, reject) => {
          const {
            from,
            to,
            cc,
            bcc,
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
                  Name: settings.defaultFromName,
                },
                To: [
                  {
                    Email: to || settings.defaultTo,
                    Name: settings.defaultToName,
                  },
                ],
                Cc: [
                  {
                    Email: cc || settings.defaultCc,
                    Name: settings.defaultCcName,
                  },
                ],
                Bcc: [
                  {
                    Email: bcc || settings.defaultBcc,
                    Name: settings.defaultBccName,
                  },
                ],
                Subject: subject,
                TextPart: text,
                HTMLPart: html,
                ...rest,
              },
            ],
          };

          if (attachments) msg.Attachments = attachments;
          //
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
