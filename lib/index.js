'use strict'

/**
 * Module dependencies
 */

/* eslint-disable import/no-unresolved */
/* eslint-disable prefer-template */
// Public node modules.
const _ = require('lodash')
const mailjet = require ('node-mailjet')

/* eslint-disable no-unused-vars */
module.exports = {
  provider: 'mailjet',
  name: 'Mailjet',
  auth: {
    mailjet_default_from: {
      label: 'Mailjet Default From',
      type: 'text'
    },
    mailjet_default_replyto: {
      label: 'Mailjet Default Reply-To',
      type: 'text'
    },    
    username: {
      label: 'Username',
      type: 'text'
    },
    password: {
      label: 'Password',
      type: 'password'
    }
  },
  init: (config) => {

    const transporter = mailjet.connect(
      config.username,
      config.password
    )

    return {
      send: (options) => {
        return new Promise((resolve, reject) => {
          // Default values.
          options = _.isObject(options) ? options : {}
          options.from = options.from || config.mailjet_default_from
          options.replyTo = options.replyTo || config.mailjet_default_replyto
          options.text = options.text || options.html
          options.html = options.html || options.text

          let msg = {
            "Messages":[{
                "From": {
                    "Email": options.from
                },
                "To": [{
                    "Email": options.to
                }],
                "Subject": options.subject,
                "TextPart": options.text,
                "HTMLPart": options.html
            }]
          }
          
          if (options.attachments){
            msg["Attachments"] = options.attachments;
          }

          transporter.post("send", {'version': 'v3.1'})
                     .request(msg)
                  .then(resolve)
                  .catch(error => reject(error))

        })
      }
    }
  }
}
