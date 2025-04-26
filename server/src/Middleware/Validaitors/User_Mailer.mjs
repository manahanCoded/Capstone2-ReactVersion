// mailer.js
import { createTransport } from "nodemailer";

const transporter = createTransport({
  service: 'gmail',
  auth: {
    user: 'checkmythrift68@gmail.com',
    pass: process.env.EMAIL_MAILER
  }
});

const sendVerificationEmail = async (to, code) => {
  try {
    await transporter.sendMail({
      from: '"CryptoWarriors" <checkmythrift68@gmail.com>',
      to,
      subject: 'Your Verification Code',
      text: `Your verification code is: ${code}`,
    });
  } catch (error) {
    console.error('Error sending email:', error);
  }
};

export {sendVerificationEmail}
