# strapi-provider-email-mailjet

[Strapi](http://strapi.io/) email service for [Mailjet](https://mailjet.com/)

# Prerequisites

You will need to have the plugin `strapi-plugin-email` installed in you Strapi project.

# Installation

```
# using yarn
yarn add strapi-provider-email-mailjet

# using npm
npm i strapi-provider-email-mailjet
```

# Configuration

| Variable                     | Type   | Description                                                                                   | Required | Default   |
| ---------------------------- | ------ | --------------------------------------------------------------------------------------------- | -------- | --------- |
| provider                     | string | The name of the provider you use                                                              | yes      |           |
| providerOptions              | object | Provider options                                                                              | yes      |           |
| providerOptions.publicApiKey | string | Mailjet public API key. See your [MailJet API keys](https://app.mailjet.com/account/api_keys) | yes      |           |
| providerOptions.secretApiKey | string | Mailjet secret API key. See your [MailJet API keys](https://app.mailjet.com/account/api_keys) | yes      |           |
| settings                     | object | Settings                                                                                      | no       | {}        |
| settings.defaultFrom         | string | Default sender mail address                                                                   | yes      | undefined |
| settings.defaultFromName     | string | Default sender name                                                                           | yes      | undefined |
| settings.defaultTo           | string | Default receiver mail address                                                                 | yes      | undefined |
| settings.defaultToName       | string | Default receiver name                                                                         | yes      | undefined |

### Example config file

Path - `config/plugins.js`

```javascript
module.exports = ({ env }) => ({
  // ...
  email: {
    provider: "mailjet",
    providerOptions: {
      publicApiKey: env("MAILJET_PUBLIC_KEY"),
      secretApiKey: env("MAILJET_SECRET_KEY"),
    },
    settings: {
      defaultFrom: "scott@ijs.to",
      defaultFromName: "Scott from iJS.to",
      defaultTo: "john.doe@ijs.to",
      defaultToName: "Johnny Bravodoe",
    },
  },
  // ...
});
```

# Actions API

> Currently Actions are experimental and in Beta, as they depend on PR submitted to Strapi [#7560](https://github.com/strapi/strapi/pull/7560).
> To implement in your app, you will need to overwrite your strapi-email-plugin and enable `action()` service.
>
> If Strapi rejects this PR [#7560](https://github.com/strapi/strapi/pull/7560), Actions API may be deprecated or may not be officially supported.
> Follow this repo for updates on this.

Takes in an object which must contain `type` to determine action type and supporting data. This API is a subset of the [MailJet API](https://dev.mailjet.com/email/reference/).

## Available Actions

You can request additional actions by submitting a Feature Request or a Pull Request.

### **addContactToList**

| Field  | Type   | Description                          | Required | Default |
| ------ | ------ | ------------------------------------ | -------- | ------- |
| listId | String | MailJet List ID to which add contact | yes      |         |
| id     | String | Contact's email or MailJet ID        | yes      |         |

### **createContact**

| Field | Type   | Description              | Required | Default |
| ----- | ------ | ------------------------ | -------- | ------- |
| email | String | Contact's email          | yes      |         |
| name  | String | Full name of the contact | no       |         |

### **createContactList**

| Field | Type   | Description              | Required | Default |
| ----- | ------ | ------------------------ | -------- | ------- |
| name  | String | Name of the contact list | yes      |         |

### **retrieveContact**

| Field     | Type   | Description                   | Required | Default |
| --------- | ------ | ----------------------------- | -------- | ------- |
| contactId | String | Contact's email or MailJet ID | yes      |         |

# Licence

- [MIT](https://github.com/ijsto/strapi-provider-email-mailjet/blob/master/LICENSE.md)

### Credits

Authors:
[Scott Agirs](https://github.com/scottagirs)

Package initially published by [sboutet06](https://github.com/sboutet06)
