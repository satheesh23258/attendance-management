// Simple SMS/email mock sender. In production replace with Twilio or other provider.
export const sendSms = async (phone, message) => {
  // If TWILIO env configured, you could integrate here. For now, log to console.
  console.log(`\n[REAL CODE] >> SMS to ${phone}: ${message}\n`)
  return { ok: true }
}

export const sendEmail = async (to, subject, text) => {
  // Only attempt to use nodemailer when SMTP config is provided
  if (process.env.SMTP_HOST && process.env.SMTP_USER && process.env.SMTP_PASS) {
    try {
      const nodemailer = await import('nodemailer')
      const port = parseInt(process.env.SMTP_PORT) || 587
      const transporter = nodemailer.createTransport({
        host: process.env.SMTP_HOST,
        port: port,
        secure: port === 465, // true for 465, false for other ports
        auth: {
          user: process.env.SMTP_USER,
          pass: process.env.SMTP_PASS,
        },
        connectionTimeout: 5000, // 5 seconds
        greetingTimeout: 5000,   // 5 seconds
      })

      const info = await transporter.sendMail({ from: process.env.VITE_EMAIL_FROM || 'satheeshkanna888@gmail.com', to, subject, text })
      console.log('Email sent successfully:', info.messageId)
      return { ok: true, messageId: info.messageId }
    } catch (err) {
      console.error('Failed to send email via SMTP:', err.message)
      
      const isDev = (process.env.VITE_NODE_ENV || process.env.NODE_ENV || 'development') === 'development'
      if (isDev) {
        console.warn('CRITICAL: SMTP Connection TIMEOUT/FAILURE. Falling back to console log for development.')
        console.log(`\n================ REAL CODE BELOW ===============`)
        console.log(`>> DEVELOPMENT OTP FALLBACK`)
        console.log(`>> To: ${to}`)
        console.log(`>> Subject: ${subject}`)
        console.log(`>> Content: ${text}`)
        console.log(`==================================================\n`)
        return { ok: true, fallback: true }
      }
      
      return { ok: false, error: err.message }
    }
  }

  console.log(`>> Email (MOCK) from satheeshkanna888@gmail.com to ${to}: ${subject} - ${text}`)
  return { ok: true, mock: true }
}
