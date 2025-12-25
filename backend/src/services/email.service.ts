import nodemailer from 'nodemailer';
import Mail from 'nodemailer/lib/mailer';

// Development mode - log emails to console instead of sending
const DEV_MODE = process.env.NODE_ENV !== 'production';

// Mailtrap credentials for development
// In production, these should come from environment variables
const transporter = nodemailer.createTransport({
    host: process.env.SMTP_HOST || 'sandbox.smtp.mailtrap.io',
    port: parseInt(process.env.SMTP_PORT || '2525'),
    auth: {
        user: process.env.SMTP_USER || '23aa7552a011fa',
        pass: process.env.SMTP_PASS || '5fe76187c7e178',
    },
});

const APP_URL = process.env.APP_URL || 'http://localhost:3000';
const FROM_EMAIL = process.env.FROM_EMAIL || 'noreply@bloomncuddles.com';

// Helper to send email with console fallback for development
const sendEmailWithFallback = async (mailOptions: Mail.Options, logMessage: string): Promise<boolean> => {
    try {
        await transporter.sendMail(mailOptions);
        console.log(logMessage);
        return true;
    } catch (error) {
        // In dev mode, log the email to console so we can still test
        if (DEV_MODE) {
            console.log('\n' + '='.repeat(60));
            console.log('📧 EMAIL (Dev Mode - SMTP unavailable)');
            console.log('='.repeat(60));
            console.log(`To: ${mailOptions.to}`);
            console.log(`Subject: ${mailOptions.subject}`);
            console.log('-'.repeat(60));
            console.log(mailOptions.text);
            console.log('='.repeat(60) + '\n');
            return true; // Return true in dev mode so the flow continues
        }
        console.error('Failed to send email:', error);
        return false;
    }
};

export interface InviteEmailData {
    to: string;
    inviteToken: string;
    schoolName: string;
    inviterName: string;
    role: string;
}

export const sendInviteEmail = async (data: InviteEmailData): Promise<boolean> => {
    const { to, inviteToken, schoolName, inviterName, role } = data;
    const inviteUrl = `${APP_URL}/register/invite?token=${inviteToken}`;

    const mailOptions = {
        from: `"Bloom n Cuddles" <${FROM_EMAIL}>`,
        to,
        subject: `You're invited to join ${schoolName} on Bloom n Cuddles!`,
        html: `
            <div style="font-family: 'Segoe UI', Tahoma, Geneva, Verdana, sans-serif; max-width: 600px; margin: 0 auto; padding: 40px 20px;">
                <div style="text-align: center; margin-bottom: 30px;">
                    <h1 style="color: #6366f1; margin: 0;">🌸 Bloom n Cuddles</h1>
                </div>
                
                <div style="background: linear-gradient(135deg, #f8fafc 0%, #f1f5f9 100%); padding: 30px; border-radius: 16px; border: 1px solid #e2e8f0;">
                    <h2 style="color: #1e293b; margin-top: 0;">You're Invited! 🎉</h2>
                    
                    <p style="color: #475569; font-size: 16px; line-height: 1.6;">
                        <strong>${inviterName}</strong> has invited you to join <strong>${schoolName}</strong> as a <strong>${role}</strong>.
                    </p>
                    
                    <p style="color: #475569; font-size: 16px; line-height: 1.6;">
                        Click the button below to create your account and get started:
                    </p>
                    
                    <div style="text-align: center; margin: 30px 0;">
                        <a href="${inviteUrl}" style="display: inline-block; background: linear-gradient(135deg, #6366f1 0%, #8b5cf6 100%); color: white; padding: 14px 32px; border-radius: 12px; text-decoration: none; font-weight: bold; font-size: 16px; box-shadow: 0 4px 14px rgba(99, 102, 241, 0.3);">
                            Accept Invitation
                        </a>
                    </div>
                    
                    <p style="color: #94a3b8; font-size: 14px; margin-top: 20px;">
                        This invitation will expire in 7 days. If you didn't expect this email, you can safely ignore it.
                    </p>
                </div>
                
                <div style="text-align: center; margin-top: 30px; color: #94a3b8; font-size: 12px;">
                    <p>© ${new Date().getFullYear()} Bloom n Cuddles. All rights reserved.</p>
                </div>
            </div>
        `,
        text: `
            You're invited to join ${schoolName} on Bloom n Cuddles!
            
            ${inviterName} has invited you to join as a ${role}.
            
            Click here to accept: ${inviteUrl}
            
            This invitation expires in 7 days.
        `,
    };

    return sendEmailWithFallback(mailOptions, `Invite email sent to ${to}`);
};

export interface PasswordSetupEmailData {
    to: string;
    name: string;
    schoolName: string;
    token: string;
    role: string;
}

export const sendPasswordSetupEmail = async (data: PasswordSetupEmailData): Promise<boolean> => {
    const { to, name, schoolName, token, role } = data;
    const setupUrl = `${APP_URL}/register/setup-password?token=${token}`;

    const mailOptions = {
        from: `"Bloom n Cuddles" <${FROM_EMAIL}>`,
        to,
        subject: `Welcome to ${schoolName} - Set Up Your Password`,
        html: `
            <div style="font-family: 'Segoe UI', Tahoma, Geneva, Verdana, sans-serif; max-width: 600px; margin: 0 auto; padding: 40px 20px;">
                <div style="text-align: center; margin-bottom: 30px;">
                    <h1 style="color: #6366f1; margin: 0;">🌸 Bloom n Cuddles</h1>
                </div>
                
                <div style="background: linear-gradient(135deg, #f8fafc 0%, #f1f5f9 100%); padding: 30px; border-radius: 16px; border: 1px solid #e2e8f0;">
                    <h2 style="color: #1e293b; margin-top: 0;">Welcome, ${name}! 🎉</h2>
                    
                    <p style="color: #475569; font-size: 16px; line-height: 1.6;">
                        Your account has been created at <strong>${schoolName}</strong> as a <strong>${role}</strong>.
                    </p>
                    
                    <p style="color: #475569; font-size: 16px; line-height: 1.6;">
                        Click the button below to set up your password and access your account:
                    </p>
                    
                    <div style="text-align: center; margin: 30px 0;">
                        <a href="${setupUrl}" style="display: inline-block; background: linear-gradient(135deg, #6366f1 0%, #8b5cf6 100%); color: white; padding: 14px 32px; border-radius: 12px; text-decoration: none; font-weight: bold; font-size: 16px; box-shadow: 0 4px 14px rgba(99, 102, 241, 0.3);">
                            Set Up Password
                        </a>
                    </div>
                    
                    <p style="color: #94a3b8; font-size: 14px; margin-top: 20px;">
                        This link will expire in 48 hours. If you didn't expect this email, please contact your school administrator.
                    </p>
                </div>
                
                <div style="text-align: center; margin-top: 30px; color: #94a3b8; font-size: 12px;">
                    <p>© ${new Date().getFullYear()} Bloom n Cuddles. All rights reserved.</p>
                </div>
            </div>
        `,
        text: `
            Welcome to ${schoolName} on Bloom n Cuddles!
            
            Hello ${name}, your account has been created as a ${role}.
            
            Click here to set up your password: ${setupUrl}
            
            This link expires in 48 hours.
        `,
    };

    return sendEmailWithFallback(mailOptions, `Password setup email sent to ${to}`);
};

// Password reset email for forgot password flow
export interface PasswordResetEmailData {
    to: string;
    name: string;
    token: string;
}

export const sendPasswordResetEmail = async (data: PasswordResetEmailData): Promise<boolean> => {
    const { to, name, token } = data;
    const resetUrl = `${APP_URL}/reset-password?token=${token}`;

    const mailOptions = {
        from: `"Bloom n Cuddles" <${FROM_EMAIL}>`,
        to,
        subject: `Reset Your Password - Bloom n Cuddles`,
        html: `
            <div style="font-family: 'Segoe UI', Tahoma, Geneva, Verdana, sans-serif; max-width: 600px; margin: 0 auto; padding: 40px 20px;">
                <div style="text-align: center; margin-bottom: 30px;">
                    <h1 style="color: #6366f1; margin: 0;">🌸 Bloom n Cuddles</h1>
                </div>
                
                <div style="background: linear-gradient(135deg, #f8fafc 0%, #f1f5f9 100%); padding: 30px; border-radius: 16px; border: 1px solid #e2e8f0;">
                    <h2 style="color: #1e293b; margin-top: 0;">Password Reset Request 🔐</h2>
                    
                    <p style="color: #475569; font-size: 16px; line-height: 1.6;">
                        Hi <strong>${name}</strong>,
                    </p>
                    
                    <p style="color: #475569; font-size: 16px; line-height: 1.6;">
                        We received a request to reset your password. Click the button below to create a new password:
                    </p>
                    
                    <div style="text-align: center; margin: 30px 0;">
                        <a href="${resetUrl}" style="display: inline-block; background: linear-gradient(135deg, #6366f1 0%, #8b5cf6 100%); color: white; padding: 14px 32px; border-radius: 12px; text-decoration: none; font-weight: bold; font-size: 16px; box-shadow: 0 4px 14px rgba(99, 102, 241, 0.3);">
                            Reset Password
                        </a>
                    </div>
                    
                    <p style="color: #94a3b8; font-size: 14px; margin-top: 20px;">
                        This link will expire in 1 hour. If you didn't request this reset, you can safely ignore this email.
                    </p>
                </div>
                
                <div style="text-align: center; margin-top: 30px; color: #94a3b8; font-size: 12px;">
                    <p>© ${new Date().getFullYear()} Bloom n Cuddles. All rights reserved.</p>
                </div>
            </div>
        `,
        text: `
            Password Reset Request - Bloom n Cuddles
            
            Hi ${name},
            
            We received a request to reset your password.
            
            Click here to reset: ${resetUrl}
            
            This link expires in 1 hour. If you didn't request this, ignore this email.
        `,
    };

    return sendEmailWithFallback(mailOptions, `Password reset email sent to ${to}`);
};
