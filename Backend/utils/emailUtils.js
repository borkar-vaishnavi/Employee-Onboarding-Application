const nodemailer = require("nodemailer");

async function sendEmail(toEmail, subject, text) {
  try {
    const transporter = nodemailer.createTransport({
      service: "Gmail",
      auth: {
        user: "cheenuborkar@gmail.com",
        pass: "nmmz znik dekh yjjv",
      },
    });

    const mailOptions = {
      from: "cheenuborkar@gmail.com",
      to: toEmail,
      subject: subject,
      text: text,
    };

    await transporter.sendMail(mailOptions);
    console.log("Email sent successfully");
  } catch (error) {
    console.error("Error sending email:", error);
    throw error;
  }
}

module.exports = { sendEmail };
