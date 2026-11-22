const nodemailer = require('nodemailer');

/**
 * Sends an email (e.g., password reset, status update)
 * If SMTP credentials are not configured, logs to console for development ease.
 */
const sendEmail = async ({ to, subject, html, text }) => {
  if (process.env.SMTP_HOST && process.env.SMTP_USER) {
    try {
      const transporter = nodemailer.createTransport({
        host: process.env.SMTP_HOST,
        port: process.env.SMTP_PORT || 587,
        secure: process.env.SMTP_SECURE === 'true',
        auth: {
          user: process.env.SMTP_USER,
          pass: process.env.SMTP_PASS,
        },
      });

      const info = await transporter.sendMail({
        from: `"${process.env.FROM_NAME || 'Catering Job Portal'}" <${process.env.FROM_EMAIL || 'no-reply@cateringportal.com'}>`,
        to,
        subject,
        text,
        html,
      });

      console.log('Email sent:', info.messageId);
      return { success: true, messageId: info.messageId };
    } catch (err) {
      console.warn('Error sending email through SMTP:', err.message);
    }
  }

  // Fallback dev mode logging
  console.log('----------------------------------------------------');
  console.log(`[DEV EMAIL SIMULATION] To: ${to}`);
  console.log(`Subject: ${subject}`);
  console.log(`Content: ${text || html}`);
  console.log('----------------------------------------------------');
  return { success: true, simulated: true };
};

module.exports = { sendEmail };
