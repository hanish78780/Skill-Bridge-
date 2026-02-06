
const nodemailer = require('nodemailer');

const sendEmail = async (options) => {
    // Create a transporter
    // For development, we can use a Gmail account with App Password
    // Or just log if no credentials provided
    if (!process.env.EMAIL_USER || !process.env.EMAIL_PASS) {
        console.log('Skipping email send - Credentials not found');
        console.log('Email Details:', options);
        return;
    }

    const transporter = nodemailer.createTransport({
        service: 'gmail',
        auth: {
            user: process.env.EMAIL_USER,
            pass: process.env.EMAIL_PASS,
        },
    });

    const mailOptions = {
        from: `SkillBridge Team <${process.env.EMAIL_USER}>`,
        to: options.to,
        subject: options.subject,
        html: options.html,
    };

    await transporter.sendMail(mailOptions);
};

// Email Templates
const sendWelcomeEmail = async (user) => {
    const message = `
        <div style="font-family: Arial, sans-serif; max-width: 600px; margin: 0 auto;">
            <h2 style="color: #4F46E5;">Welcome to SkillBridge! 🚀</h2>
            <p>Hi ${user.name},</p>
            <p>We're thrilled to have you on board! SkillBridge is the place where developers connect, collaborate, and build amazing things.</p>
            <p>Here are a few things you can do to get started:</p>
            <ul>
                <li>Complete your profile</li>
                <li>Browse existing projects</li>
                <li>Find talent for your next idea</li>
            </ul>
            <p>Happy coding!</p>
            <p>The SkillBridge Team</p>
        </div>
    `;

    await sendEmail({
        to: user.email,
        subject: 'Welcome to SkillBridge!',
        html: message,
    });
};

const sendResetPasswordEmail = async (user, resetUrl) => {
    const message = `
        <div style="font-family: Arial, sans-serif; max-width: 600px; margin: 0 auto;">
            <h2 style="color: #4F46E5;">Reset Your Password</h2>
            <p>Hi ${user.name},</p>
            <p>You requested a password reset. Please click the button below to set a new password:</p>
            <a href="${resetUrl}" style="display: inline-block; background-color: #4F46E5; color: white; padding: 10px 20px; text-decoration: none; border-radius: 5px; margin: 20px 0;">Reset Password</a>
            <p>If you didn't request this, you can safely ignore this email.</p>
            <p>This link will expire in 10 minutes.</p>
            <p>The SkillBridge Team</p>
        </div>
    `;

    await sendEmail({
        to: user.email,
        subject: 'Password Reset Request',
        html: message,
    });
};

module.exports = {
    sendEmail,
    sendWelcomeEmail,
    sendResetPasswordEmail
};
