'use strict';

/* eslint-disable import/no-unresolved */
const mailjet = require('node-mailjet');
const { removeUndefined } = require('@strapi/utils');

function normalizeReceiver(
  receiver,
  receiverName,
  defaultReceiver,
  defaultReceiverName,
) {
  // Receiver not given
  if (typeof receiver === 'undefined') {
    return [{ Email: defaultReceiver, Name: defaultReceiverName }];
  }

  // Receiver given as string
  if (typeof receiver === 'string') {
    const receiverObj = { Email: receiver };
    // If receiver email given we don't use the default receiver name
    if (receiverName) {
      receiverObj.Name = receiverName;
    }
    return [receiverObj];
  }

  // Array of receivers
  if (Array.isArray(receiver)) {
    return receiver.map(receiverEntry => {
      if (typeof receiverEntry === 'string') {
        return { Email: receiverEntry };
      }
      return receiverEntry;
    });
  }

  throw new Error('Looks like receiver format is invalid.');
}

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

          if (!to && !settings.defaultTo)
            reject(new Error("Either 'to' or `defaultTo` field is required."));

          const msg = {
            From: {
              Email: from || settings.defaultFrom,
              Name: fromName || settings.defaultFromName,
            },
            To: normalizeReceiver(
              to,
              toName,
              settings.defaultTo,
              settings.defaultToName,
            ),
            Subject: subject,
            TextPart: text,
            HTMLPart: html,
            ...rest,
          };
          if (cc || settings.defaultCc) {
            msg.Cc = normalizeReceiver(
              cc,
              ccName,
              settings.defaultCc,
              settings.defaultCcName,
            );
          }
          if (bcc || settings.defaultBcc) {
            msg.Bcc = normalizeReceiver(
              bcc,
              bccName,
              settings.defaultBcc,
              settings.defaultBccName,
            );
          }
          if (attachments) msg.Attachments = attachments;

          mailjetClient
            .post('send', { version: 'v3.1' })
            .request(removeUndefined({ Messages: [msg] }))
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
      updateContact: options => {
        return new Promise((resolve, reject) => {
          const request = mailjetClient
            .put('contactdata', { version: 'v3' })
            .id(options.id)
            .request({
              Data: [
                {
                  Name: 'first_name',
                  Value: 'Agirs',
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
