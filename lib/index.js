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

          if (!to) reject(new Error("'to' field is required."));

          let To;
          if (typeof to === 'string' || to instanceof String) {
            To = [{ Email: to, Name: toName || settings.defaultToName }];
          } else if (Array.isArray(to)) {
            To = to.map(toEntry => ({
              Email: toEntry.email || settings.defaultTo,
              Name: toEntry.toName || settings.defaultToName,
            }));
          } else {
            reject(
              new Error(
                "'to' must be either a String or an Array of objects. Read more: https://github.com/ijsto/strapi-provider-email-mailjet#configuration",
              ),
            );
          }

          const msg = {
            Messages: [
              {
                From: {
                  Email: from || settings.defaultFrom,
                  Name: fromName || settings.defaultFromName,
                },
                To,
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
      addContactToList: options => {
        return new Promise((resolve, reject) => {
          const request = mailjetClient
            .post('contact')
            .id(options.id)
            .action('managecontactslists')
            .request({
              ContactsLists: [
                {
                  ListID: options.listId,
                  Action: 'addforce',
                },
              ],
            });

          request
            .then(result => resolve(result.body))
            .catch(err => reject(err.message));
        });
      },
      createContact: options => {
        return new Promise((resolve, reject) => {
          const request = mailjetClient
            .post('contact', { version: 'v3' })
            .request({
              IsExcludedFromCampaigns: options.excludeFromCampaigns || 'true',
              Name: options.name,
              Email: options.email,
            });

          request
            .then(result => resolve(result.body))
            .catch(err => reject(err.message));
        });
      },
      createContactList: options => {
        return new Promise((resolve, reject) => {
          const request = mailjetClient
            .post('contactslist', { version: 'v3' })
            .request({
              Name: options.name,
            });

          request
            .then(result => resolve(result.body))
            .catch(err => reject(err.message));
        });
      },
      removeContactFromList: options => {
        return new Promise((resolve, reject) => {
          const request = mailjetClient
            .post('contact')
            .id(options.id)
            .action('managecontactslists')
            .request({
              ContactsLists: [
                {
                  ListID: options.listId,
                  Action: 'remove',
                },
              ],
            });

          request
            .then(result => resolve(result.body))
            .catch(err => reject(err.message));
        });
      },
      retrieveContact: options => {
        return new Promise((resolve, reject) => {
          const request = mailjetClient
            .get('contact', { version: 'v3' })
            .id(options.contactId)
            .request();

          request
            .then(result => resolve(result.body))
            .catch(err => reject(err.message));
        });
      },
      subscribeContactToList: options => {
        return new Promise((resolve, reject) => {
          const request = mailjetClient
            .post('contact')
            .id(options.id)
            .action('managecontactslists')
            .request({
              ContactsLists: [
                {
                  ListID: options.listId,
                  Action: 'addforce',
                },
              ],
            });

          request
            .then(result => resolve(result.body))
            .catch(err => reject(err.message));
        });
      },
      unsubscribeContactFromList: options => {
        return new Promise((resolve, reject) => {
          const request = mailjetClient
            .post('contact')
            .id(options.id)
            .action('managecontactslists')
            .request({
              ContactsLists: [
                {
                  ListID: options.listId,
                  Action: 'unsub',
                },
              ],
            });

          request
            .then(result => resolve(result.body))
            .catch(err => reject(err.message));
        });
      },
    };
  },
};
