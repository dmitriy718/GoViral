import nodemailer from 'nodemailer';
import dotenv from 'dotenv';
import path from 'path';

// Load env from server root
dotenv.config({ path: path.join(__dirname, '../../.env') });

const transporter = nodemailer.createTransport({
  host: process.env.SMTP_HOST,
  port: parseInt(process.env.SMTP_PORT || '587'),
  secure: false, // true for 465, false for other ports
  auth: {
    user: process.env.SMTP_USER,
    pass: process.env.SMTP_PASS,
  },
});

async function main() {
  try {
    console.log('Sending email...');
    console.log(`Host: ${process.env.SMTP_HOST}`);
    console.log(`User: ${process.env.SMTP_USER}`);
    
    const info = await transporter.sendMail({
      from: `"PostDoctor Admin" <${process.env.SMTP_USER}>`,
      to: "dmitriynyc718@gmail.com",
      subject: "Test Email from Gemini Agent",
      text: "This is a test email to verify SMTP configuration.",
      html: "<b>This is a test email</b> to verify SMTP configuration.",
    });

    console.log("Message sent: %s", info.messageId);
  } catch (error) {
    console.error("Error sending email:", error);
  }
}

main();
