const nodemailer = require('nodemailer');

const transporter = nodemailer.createTransport({
    service: 'gmail',
    auth: {
        user: process.env.EMAIL_USER,
        pass: process.env.EMAIL_PASSWORD
    },
    tls: {
        rejectUnauthorized: false
    }
});

// Send verification email
exports.sendVerificationEmail = async (email, token) => {
    const verificationUrl = `${process.env.CLIENT_URL}/verify-email/${token}`;

    const mailOptions = {
        from: `"Chronos Timetable System" <${process.env.EMAIL_USER}>`,
        to: email,
        subject: 'Email Verification - Chronos',
        html: `
            <!DOCTYPE html>
            <html>
            <head>
                <style>
                    body {
                        font-family: 'Manrope', -apple-system, BlinkMacSystemFont, sans-serif;
                        background-color: #f5f5f5;
                        margin: 0;
                        padding: 0;
                    }
                    .container {
                        max-width: 600px;
                        margin: 40px auto;
                        background-color: #1a1a1a;
                        border-radius: 16px;
                        overflow: hidden;
                        box-shadow: 0 4px 16px rgba(0, 0, 0, 0.3);
                    }
                    .header {
                        background-color: #6731b7;
                        padding: 30px;
                        text-align: center;
                    }
                    .header h1 {
                        color: #ffffff;
                        margin: 0;
                        font-size: 24px;
                        font-family: 'Comfortaa', sans-serif;
                    }
                    .content {
                        padding: 40px 30px;
                        color: #c3c3c3;
                    }
                    .content h2 {
                        color: #ffffff;
                        margin-top: 0;
                        font-family: 'Comfortaa', sans-serif;
                    }
                    .button {
                        display: inline-block;
                        padding: 14px 32px;
                        background-color: #6731b7;
                        color: #ffffff;
                        text-decoration: none;
                        border-radius: 8px;
                        font-weight: 600;
                        margin: 20px 0;
                    }
                    .footer {
                        background-color: #0a0a0a;
                        padding: 20px;
                        text-align: center;
                        color: #808080;
                        font-size: 12px;
                    }
                </style>
            </head>
            <body>
                <div class="container">
                    <div class="header">
                        <h1>CHRONOS</h1>
                    </div>
                    <div class="content">
                        <h2>Verify Your Email Address</h2>
                        <p>Thank you for registering with Chronos!</p>
                        <p>Please click the button below to verify your email address and activate your account:</p>
                        <center>
                            <a href="${verificationUrl}" class="button">Verify Email</a>
                        </center>
                        <p>Or copy and paste this link into your browser:</p>
                        <p style="color: #808080; word-break: break-all;">${verificationUrl}</p>
                        <p style="color: #808080; font-size: 14px; margin-top: 30px;">
                            This link will expire in 1 hour. If you didn't create an account, please ignore this email.
                        </p>
                    </div>
                    <div class="footer">
                        <p>© 2025 Chronos. Automated Timetable Management System.</p>
                    </div>
                </div>
            </body>
            </html>
        `
    };

    try {
        await transporter.sendMail(mailOptions);
        console.log('Verification email sent to:', email);
    } catch (error) {
        console.error('Error sending verification email:', error);
        throw new Error('Failed to send verification email');
    }
};

// Send password reset email
exports.sendPasswordResetEmail = async (email, token) => {
    const resetUrl = `${process.env.CLIENT_URL}/reset-password/${token}`;

    const mailOptions = {
        from: `"Chronos Timetable System" <${process.env.EMAIL_USER}>`,
        to: email,
        subject: 'Password Reset Request - Chronos',
        html: `
            <!DOCTYPE html>
            <html>
            <head>
                <style>
                    body {
                        font-family: 'Manrope', -apple-system, BlinkMacSystemFont, sans-serif;
                        background-color: #f5f5f5;
                        margin: 0;
                        padding: 0;
                    }
                    .container {
                        max-width: 600px;
                        margin: 40px auto;
                        background-color: #1a1a1a;
                        border-radius: 16px;
                        overflow: hidden;
                        box-shadow: 0 4px 16px rgba(0, 0, 0, 0.3);
                    }
                    .header {
                        background-color: #6731b7;
                        padding: 30px;
                        text-align: center;
                    }
                    .header h1 {
                        color: #ffffff;
                        margin: 0;
                        font-size: 24px;
                        font-family: 'Comfortaa', sans-serif;
                    }
                    .content {
                        padding: 40px 30px;
                        color: #c3c3c3;
                    }
                    .content h2 {
                        color: #ffffff;
                        margin-top: 0;
                        font-family: 'Comfortaa', sans-serif;
                    }
                    .button {
                        display: inline-block;
                        padding: 14px 32px;
                        background-color: #6731b7;
                        color: #ffffff;
                        text-decoration: none;
                        border-radius: 8px;
                        font-weight: 600;
                        margin: 20px 0;
                    }
                    .warning {
                        background-color: #f44336;
                        padding: 15px;
                        border-radius: 8px;
                        margin: 20px 0;
                        color: #ffffff;
                    }
                    .footer {
                        background-color: #0a0a0a;
                        padding: 20px;
                        text-align: center;
                        color: #808080;
                        font-size: 12px;
                    }
                </style>
            </head>
            <body>
                <div class="container">
                    <div class="header">
                        <h1>CHRONOS</h1>
                    </div>
                    <div class="content">
                        <h2>Reset Your Password</h2>
                        <p>We received a request to reset your password. Click the button below to create a new password:</p>
                        <center>
                            <a href="${resetUrl}" class="button">Reset Password</a>
                        </center>
                        <p>Or copy and paste this link into your browser:</p>
                        <p style="color: #808080; word-break: break-all;">${resetUrl}</p>
                        <div class="warning">
                            <strong>Security Notice:</strong> This link will expire in 1 hour. If you didn't request a password reset, please ignore this email and your password will remain unchanged.
                        </div>
                    </div>
                    <div class="footer">
                        <p>© 2025 Chronos. Automated Timetable Management System.</p>
                    </div>
                </div>
            </body>
            </html>
        `
    };

    try {
        await transporter.sendMail(mailOptions);
        console.log('Password reset email sent to:', email);
    } catch (error) {
        console.error('Error sending password reset email:', error);
        throw new Error('Failed to send password reset email');
    }
};

// Send password change notification
exports.sendPasswordChangeNotification = async (email, firstName) => {
    const mailOptions = {
        from: `"Chronos Timetable System" <${process.env.EMAIL_USER}>`,
        to: email,
        subject: 'Password Changed Successfully - Chronos',
        html: `
            <!DOCTYPE html>
            <html>
            <head>
                <style>
                    body {
                        font-family: 'Manrope', -apple-system, BlinkMacSystemFont, sans-serif;
                        background-color: #f5f5f5;
                        margin: 0;
                        padding: 0;
                    }
                    .container {
                        max-width: 600px;
                        margin: 40px auto;
                        background-color: #1a1a1a;
                        border-radius: 16px;
                        overflow: hidden;
                        box-shadow: 0 4px 16px rgba(0, 0, 0, 0.3);
                    }
                    .header {
                        background-color: #4caf50;
                        padding: 30px;
                        text-align: center;
                    }
                    .header h1 {
                        color: #ffffff;
                        margin: 0;
                        font-size: 24px;
                        font-family: 'Comfortaa', sans-serif;
                    }
                    .content {
                        padding: 40px 30px;
                        color: #c3c3c3;
                    }
                    .content h2 {
                        color: #ffffff;
                        margin-top: 0;
                        font-family: 'Comfortaa', sans-serif;
                    }
                    .info-box {
                        background-color: #2a2a2a;
                        padding: 15px;
                        border-radius: 8px;
                        margin: 20px 0;
                        border-left: 4px solid #4caf50;
                    }
                    .footer {
                        background-color: #0a0a0a;
                        padding: 20px;
                        text-align: center;
                        color: #808080;
                        font-size: 12px;
                    }
                </style>
            </head>
            <body>
                <div class="container">
                    <div class="header">
                        <h1>CHRONOS</h1>
                    </div>
                    <div class="content">
                        <h2>Password Changed Successfully</h2>
                        <p>Hi ${firstName},</p>
                        <p>Your password has been changed successfully.</p>
                        <div class="info-box">
                            <p style="margin: 0;"><strong>Changed on:</strong> ${new Date().toLocaleString()}</p>
                        </div>
                        <p style="color: #808080; font-size: 14px; margin-top: 30px;">
                            If you didn't make this change, please contact support immediately and secure your account.
                        </p>
                    </div>
                    <div class="footer">
                        <p>© 2025 Chronos. Automated Timetable Management System.</p>
                    </div>
                </div>
            </body>
            </html>
        `
    };

    try {
        await transporter.sendMail(mailOptions);
        console.log('Password change notification sent to:', email);
    } catch (error) {
        console.error('Error sending password change notification:', error);
        throw new Error('Failed to send password change notification');
    }
};