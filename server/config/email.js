import nodemailer from 'nodemailer'

// Create transporter with Gmail SMTP
const createTransporter = () => {
  const smtpConfig = {
    host: process.env.SMTP_HOST || 'smtp.gmail.com',
    port: parseInt(process.env.SMTP_PORT || 587, 10),
    secure: process.env.SMTP_SECURE === 'true' || false, // true for 465, false for other ports
    auth: {
      user: process.env.SMTP_USER,
      pass: process.env.SMTP_PASS, // Gmail App Password, NOT your regular password
    },
  }

  // Validate required fields
  if (!smtpConfig.auth.user || !smtpConfig.auth.pass) {
    console.warn('⚠️ SMTP credentials not configured. Email sending will not work.')
    console.warn('Set SMTP_USER and SMTP_PASS in your .env file.')
    return null
  }

  return nodemailer.createTransport(smtpConfig)
}

export const sendOtpEmail = async (email, otp) => {
  const transporter = createTransporter()
  if (!transporter) {
    console.warn(`[DEV MODE] OTP for ${email}: ${otp}`)
    return { success: true, message: 'OTP logged (SMTP not configured)' }
  }

  const mailOptions = {
    from: process.env.EMAIL_FROM || process.env.SMTP_USER,
    to: email,
    subject: 'Email Verification - OTP Code',
    html: `
      <div style="font-family: Arial, sans-serif; background-color: #f5f5f5; padding: 20px;">
        <div style="background-color: #fff; border-radius: 8px; padding: 20px; max-width: 600px; margin: 0 auto;">
          <h2 style="color: #1976d2; margin-bottom: 20px;">Verify Your Email</h2>
          <p>Hello,</p>
          <p>Thank you for signing up! To complete your registration, please verify your email address using the OTP code below.</p>
          <div style="background-color: #f0f0f0; border: 2px solid #1976d2; border-radius: 8px; padding: 20px; text-align: center; margin: 20px 0;">
            <h1 style="color: #1976d2; letter-spacing: 5px; margin: 0;">${otp}</h1>
          </div>
          <p style="color: #d32f2f; font-weight: bold;">⏱️ This code expires in 5 minutes.</p>
          <p>If you didn't request this code, please ignore this email.</p>
          <hr style="border: none; border-top: 1px solid #eee; margin: 20px 0;">
          <p style="color: #666; font-size: 12px;">© ${new Date().getFullYear()} Employee Management System. All rights reserved.</p>
        </div>
      </div>
    `,
    text: `Your OTP code is: ${otp}\n\nThis code expires in 5 minutes.\n\nIf you didn't request this, please ignore this email.`,
  }

  try {
    await transporter.sendMail(mailOptions)
    return { success: true, message: 'OTP sent successfully' }
  } catch (error) {
    console.error('Error sending OTP email:', error)
    return { success: false, error: error.message }
  }
}

export default createTransporter

