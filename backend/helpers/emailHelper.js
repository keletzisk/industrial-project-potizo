const greekTranslations = require("../util/language");
const { sendEmail } = require("./emailer");

const emailLanguage = greekTranslations.emailLanguage;

function sendEmailVerification(email, verificationCode) {
  const emailVerificationLink =
    process.env.BASE_DOMAIN + "/verify-email?token=" + verificationCode;

  const htmlContent = `
      <html>
        <head>
          <meta name="viewport" content="width=device-width, initial-scale=1">
        </head>
        <body>
          <h1 style="color: green;">${emailLanguage.verificationEmailHeading}</h1>
          <p>
            Επισκέψου αυτόν τον <a href="${emailVerificationLink}">σύνδεσμο</a> για να επαληθεύσεις την email διεύθυνσή σου.
          </p>
          <p>
            ${emailLanguage.verificationTheLinkWillBeActive}
          </p>
          <p>
            ${emailLanguage.youReceivedThisMessage}
          </p>
          <p>
            ${emailLanguage.doNotReply}
          </p>
          <p style="font-style: italic;margin-top: 40px">
            <a href="${process.env.BASE_DOMAIN}">${emailLanguage.byMoTPotiZo}</a>
          </p>
        </body>
      </html>
    `;

  const subject = emailLanguage.verificationEmailSubject;

  sendEmail(email, subject, htmlContent);
}

function sendPasswordReset(email, resetPasswordCode) {
  const resetPasswordLink =
    process.env.BASE_DOMAIN + "/reset-password?token=" + resetPasswordCode;

  const htmlContent = `
    <html>
      <head>
        <meta name="viewport" content="width=device-width, initial-scale=1">
      </head>
      <body>
        <h1 style="color: green;">${emailLanguage.resetPasswordEmailHeading}</h1>
        <p>
            Επισκέψου αυτόν τον <a href="${resetPasswordLink}">σύνδεσμο</a> για να αλλάξεις τον κωδικό σου.
        </p>
        <p>
          ${emailLanguage.resetTheLinkWillBeActive}
        </p>
        <p>
          ${emailLanguage.youReceivedThisMessage}
        </p>
        <p>
          ${emailLanguage.doNotReply}
        </p>
        <p style="font-style: italic;margin-top: 40px">
          <a href="${process.env.BASE_DOMAIN}">${emailLanguage.byMoTPotiZo}</a>
        </p>
      </body>
    </html>
  `;

  const subject = emailLanguage.resetPasswordEmailSubject;

  sendEmail(email, subject, htmlContent);
}

function sendWateringNotification(email, wateringMessage) {
  const htmlContent = `
    <html>
      <head>
        <meta name="viewport" content="width=device-width, initial-scale=1">
      </head>
      <body>
        <h1 style="color: green;">${emailLanguage.wateringNotificationEmailHeading}</h1>
        <p>
          ${wateringMessage}
        </p>
        <p>
          ${emailLanguage.doNotReply}
        </p>
        <p style="font-style: italic;margin-top: 40px">
          <a href="${process.env.BASE_DOMAIN}">${emailLanguage.byMoTPotiZo}</a>
        </p>
      </body>
    </html>
  `;

  const subject = emailLanguage.wateringNotificationEmailSubject;

  sendEmail(email, subject, htmlContent);
}

function sendTestEmail(email) {
  const htmlContent = `
    <html>
      <head>
        <meta name="viewport" content="width=device-width, initial-scale=1">
      </head>
      <body>
        <h1 style="color: green;">Test email header</h1>
        <p>
          Hello, this is a test body.
        </p>
        <p>
          ${emailLanguage.doNotReply}
        </p>
        <p style="font-style: italic;margin-top: 40px">
          <a href="${process.env.BASE_DOMAIN}">${emailLanguage.byMoTPotiZo}</a>
        </p>
      </body>
    </html>
  `;

  const subject = "Test email";

  sendEmail(email, subject, htmlContent);
}

module.exports = {
  sendEmailVerification,
  sendPasswordReset,
  sendWateringNotification,
  sendTestEmail,
};
