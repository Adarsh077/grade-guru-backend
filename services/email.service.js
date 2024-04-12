const nodemailer = require('nodemailer');

const transporter = nodemailer.createTransport({
  service: 'gmail',
  auth: {
    user: 'adarsh.senghani@universal.edu.in',
    pass: 'mxilqwwkywvshlnv', // the app password you generated
  },
});

class EmailService {
  async sendEmail(data) {
    const { to, subject, html } = data;
    const mailOptions = {
      from: 'adarsh.senghani@universal.edu.in',
      to: to,
      subject: subject,
      html,
    };
    transporter.sendMail(mailOptions, (error, info) => {
      if (error) {
        console.log(error);
      } else {
        console.log(`Email sent: ${info.response}`);
      }
    });
  }
}

module.exports = new EmailService();
