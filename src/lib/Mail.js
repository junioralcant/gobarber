const nodemailer = require("nodemailer");
const mailConfig = require("../config/mail");

class Mail {
  constructor() {
    const { host, port, secure, auth } = mailConfig;

    this.transporter = nodemailer.createTransport({
      host,
      port,
      secure,
      auth: auth.user ? auth : null
    });
  }

  // responsável pelo envio de email
  sedMail(message) {
    return this.transporter.sendMail({
      ...mailConfig.default,
      ...message
    });
  }
}

module.exports = new Mail();
