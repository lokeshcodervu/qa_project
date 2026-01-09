const nodemailer = require('nodemailer');

const otpExpiryMinutes = 3; // OTP validity in minutes
const otpExpiryTime = new Date(Date.now() + otpExpiryMinutes * 60 * 1000);

const sendOtpToEmail = async (email, otp) => {
  const sessionId = `email-${Date.now()}-${Math.floor(Math.random() * 1000)}`;

  const transporter = nodemailer.createTransport({
    service: 'gmail',
    auth: {
      user: process.env.EMAIL_USER,
      pass: process.env.EMAIL_PASS
    }
  });

  const mailOptions = {
    from: process.env.EMAIL_USER,
    to: email,
    subject: "QA Project - OTP Verification Code",
    html: `
      <div style="font-family: 'Segoe UI', Tahoma, Geneva, Verdana, sans-serif; max-width: 480px; margin: auto; padding: 20px; border-radius: 12px; background: #ffffff; border: 1px solid #e5e7eb;">

        <div style="text-align: center; margin-bottom: 20px;">
          <h2 style="color: #1a73e8; margin: 0; font-size: 24px;">QA Project</h2>
          <p style="color: #555; margin-top: 6px; font-size: 14px;">Secure Verification Code</p>
        </div>

        <p style="font-size: 15px; color: #333;">
          Hello,
          <br><br>
          Thank you for registering with <strong>QA Project</strong>.  
          To verify your account, please use the OTP code provided below.
        </p>

        <div style="
          font-size: 28px; 
          font-weight: bold; 
          background: #eef4ff; 
          padding: 15px; 
          border-radius: 10px; 
          border: 1px solid #1a73e8; 
          text-align: center; 
          color: #1a73e8;
          letter-spacing: 3px;
          margin: 20px 0;
        ">
          ${otp}
        </div>

        <p style="font-size: 14px; color: #555; margin-top: 10px;">
          This OTP is valid for <strong>${otpExpiryMinutes} minutes</strong>.<br>
          It will expire at <strong>${otpExpiryTime.toLocaleTimeString()}</strong>.<br>
          For your security, please do not share this OTP with anyone.
        </p>

        <!-- Static progress bar representing 3 minutes -->
        <div style="width: 100%; background: #eee; border-radius: 5px; height: 10px; margin-top: 10px;">
          <div style="width: 100%; height: 10px; background: #1a73e8; border-radius: 5px;"></div>
        </div>

        <p style="font-size: 14px; color: #777; margin-top: 20px;">
          If you did not request this OTP, please ignore this email.
        </p>

        <div style="text-align: center; margin-top: 30px; font-size: 12px; color: #aaa;">
          © ${new Date().getFullYear()} QA Project. All rights reserved.
        </div>

      </div>
    `
  };

  await transporter.sendMail(mailOptions);
  return { sessionId };
};

// Provide both default and named export so callers can use either:
module.exports = sendOtpToEmail;
module.exports.sendOtpToEmail = sendOtpToEmail;
