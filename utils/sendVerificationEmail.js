import nodemailer from 'nodemailer';

export const sendVerificationEmail = async (email, token) => {
  try {
    const transporter = nodemailer.createTransport({
      service: 'gmail',
      auth: {
        user: process.env.EMAIL_USER,
        pass: process.env.EMAIL_PASS,
      },
    });

    await transporter.sendMail({
      from: `"Emerald Haven" <${process.env.EMAIL_USER}>`,
      to: email,
      subject: 'Verify your Email',
      html: `
        <h2>Verify your Email</h2>
        <p>Use the following 6-digit code to verify your email address:</p>
        <h3>${token}</h3>
        <p>This code will expire in 10 minutes.</p>
      `,
    });

    console.log("✅ Email sent to", email);
  } catch (error) {
    console.error("❌ Failed to send verification email:", error);
  }
};

export const sendResetPasswordEmail = async (email, token) => {
  try {
    const transporter = nodemailer.createTransport({
      service: 'gmail',
      auth: {
        user: process.env.EMAIL_USER,
        pass: process.env.EMAIL_PASS,
      },
    });

    await transporter.sendMail({
      from: `"Emerald Haven" <${process.env.EMAIL_USER}>`,
      to: email,
      subject: 'Reset your Password',
      html: `
        <h2>Reset your Password</h2>
        <p>Use the following 6-digit code to reset your password:</p>
        <h3>${token}</h3>
        <p>This code will expire in 10 minutes.</p>
      `,
    });

    console.log("✅ Reset password email sent to", email);
  } catch (error) {
    console.error("❌ Failed to send reset password email:", error);
  }
};
