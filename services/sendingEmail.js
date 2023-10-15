const nodemailer = require("nodemailer");
const dotenv = require("dotenv");
dotenv.config({ path: "../environment/.env" });

exports.sendingEmail = async (verificationToken, mail) => {
  const transporter = nodemailer.createTransport({
    host: process.env.MAILGUN_HOST,
    port: process.env.MAILGUN_PORT,
    secure: false,
    auth: {
      user: process.env.MAILGUN_USERNAME,
      pass: process.env.MAILGUN_PASSWORD,
    },
  });

  const emailConfig = {
    from: process.env.EMAIL_SENDER,
    to: mail,
    subject: "Verifying email",
    text: `This message send to verify your email address. Click to verify: ${process.env.MAILGUN_PASSWORD}/users/verify/${verificationToken}`,
  };

  try {
    await transporter.sendMail(emailConfig);
  } catch (error) {
    console.log(error.message);
  }
};
