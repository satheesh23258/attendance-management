# Email OTP Verification Implementation Guide

## ✅ What's Been Implemented

### Backend
1. ✅ **User Model** - Added `isVerified` field (default: false)
2. ✅ **OTP Model** - Stores OTP codes with 5-minute expiration
3. ✅ **Email Config** (`server/config/email.js`) - Nodemailer + Gmail setup
4. ✅ **Auth Routes**:
   - `POST /api/auth/register` - Create unverified user + send OTP
   - `POST /api/auth/send-otp` - Resend OTP with rate limiting
   - `POST /api/auth/verify-otp` - Verify OTP + activate user
5. ✅ **Nodemailer Dependency** - Already in `server/package.json`

### Frontend
- Already has OTP UI in `EmployeeSignup.jsx`
- Already has API methods in `src/services/api.js`

---

## 🚀 Setup Instructions

### Step 1: Get Gmail App Password

**For Gmail Users ONLY:**

1. Go to [Google Account Security](https://myaccount.google.com/security)
2. Enable **2-Step Verification** (if not already on)
3. Click **App passwords** (appears after 2FA is enabled)
4. Select:
   - App: **Mail**
   - Device: **Windows Computer** (or your device)
5. Google generates a **16-character password**
6. Copy it (without spaces)

**Example:** `abcd efgh ijkl mnop` → Copy as `abcdefghijklmnop`

### Step 2: Configure .env (Project Root)

Create/update `.env` file in the project root:

```env
# MongoDB
MONGO_URI=mongodb://localhost:27017/attendance-employee-management

# API
VITE_API_URL=http://localhost:5000/api

# Google Maps (your existing key)
VITE_GOOGLE_MAPS_API_KEY=AIzaSyCy5HQVsFRhuA4-zyIeHFbhxUVJ_nYAnfY

# JWT
VITE_JWT_SECRET=your_jwt_secret_key_here

# Email (OTP Verification)
NODE_ENV=development
SMTP_HOST=smtp.gmail.com
SMTP_PORT=587
SMTP_SECURE=false
SMTP_USER=satheeshkanna888@gmail.com
SMTP_PASS=abcdefghijklmnop
EMAIL_FROM=satheeshkanna888@gmail.com
```

⚠️ **IMPORTANT:** 
- `.env` is in `.gitignore` and will NOT be committed
- Use your Gmail and its App Password (NOT your regular Gmail password)
- Never share `.env` or commit it to Git

### Step 3: Start Backend

```bash
cd server
npm run dev
```

You should see:
```
✓ Seeded users...
✓ Seeded database...
Server running on http://localhost:5000
```

### Step 4: Start Frontend

```bash
# In project root
npm run dev
```

---

## 🧪 Test the Flow

### Option A: Test via Frontend

1. Open http://localhost:3001 in your browser
2. Navigate to **Employee Signup**
3. Fill in:
   - Name: `Test User`
   - Email: `satheeshkanna888@gmail.com`
   - Password: `password123`
   - Role: `employee`
4. Click **Create Account**
5. **Check your Gmail** for the OTP email
6. Enter the 6-digit code in the verification form
7. Success! Account is activated

### Option B: Test via Postman/cURL

**1. Register user:**
```bash
curl -X POST http://localhost:5000/api/auth/register \
  -H "Content-Type: application/json" \
  -d '{
    "name": "Test User",
    "email": "satheeshkanna888@gmail.com",
    "password": "password123",
    "role": "employee"
  }'
```

Response:
```json
{
  "message": "Account created. Please verify your email with the OTP sent to your inbox.",
  "email": "satheeshkanna888@gmail.com",
  "userId": "xxx",
  "requiresVerification": true
}
```

**2. Check server logs or Gmail for OTP code**

**3. Verify OTP:**
```bash
curl -X POST http://localhost:5000/api/auth/verify-otp \
  -H "Content-Type: application/json" \
  -d '{
    "email": "satheeshkanna888@gmail.com",
    "code": "123456"
  }'
```

Response:
```json
{
  "message": "Email verified successfully",
  "token": "eyJhbGc...",
  "user": { ... }
}
```

---

## 📧 Email Troubleshooting

### Issue: "Failed to send OTP"
**Solutions:**
1. ✅ Check SMTP credentials in `.env` are correct
2. ✅ Verify Gmail App Password (not regular password)
3. ✅ Ensure 2FA is enabled on Gmail
4. ✅ Check if Gmail account has "Less secure apps" setting
5. ✅ Try a different email if using corporate account

### Issue: "App password" not appearing in Gmail
**Solution:** 
- Ensure 2-Step Verification is **fully enabled**
- Wait 5 minutes after enabling 2FA
- Go to [Security Settings](https://myaccount.google.com/security) again

### Issue: "SMTP not configured" in logs (dev mode)
**This is OK in development!**
- Backend will log the OTP to console instead
- Watch server terminal for OTP code
- Use that code in frontend

### Using other email providers:

**SendGrid:**
```env
SMTP_HOST=smtp.sendgrid.net
SMTP_PORT=587
SMTP_SECURE=false
SMTP_USER=apikey
SMTP_PASS=SG.your_sendgrid_api_key
```

**MailGun:**
```env
SMTP_HOST=smtp.mailgun.org
SMTP_PORT=587
SMTP_USER=postmaster@yourdomain.com
SMTP_PASS=your_mailgun_password
```

---

## 🔒 Security Best Practices

### ✅ Implemented
- [x] OTP expires in 5 minutes
- [x] OTP is 6 random digits (1M combinations)
- [x] Rate limiting: Can't request new OTP within 60s
- [x] Passwords hashed with bcrypt (salt rounds: 10)
- [x] User marked `isVerified: false` until OTP confirmed
- [x] Email credentials in `.env` (not in code)
- [x] `.env` in `.gitignore` (not committed)
- [x] SQL Injection protection via Mongoose
- [x] API input validation (email format, password length)

### 📌 TODO for Production
- [ ] Use transactional email service (SendGrid, Mailgun, SES) instead of Gmail
- [ ] Implement CSRF protection
- [ ] Add request rate limiting (express-rate-limit)
- [ ] Enable HTTPS/TLS
- [ ] Add email verification recheck (user might mark as spam)
- [ ] Implement account lockout after failed OTP attempts
- [ ] Add monitoring & alerting for email failures
- [ ] Use environment-specific config (dev, staging, prod)
- [ ] Rotate API keys/passwords regularly

---

## 📁 File Structure

```
server/
├── config/
│   ├── db.js          (MongoDB connection)
│   └── email.js       (NEW: Nodemailer setup)
├── models/
│   ├── User.js        (UPDATED: added isVerified field)
│   └── Otp.js         (OTP model)
├── routes/
│   └── authRoutes.js  (UPDATED: register + OTP endpoints)
└── server.js          (Main server)

src/
├── services/
│   └── api.js         (UPDATED: added sendOtp, verifyOtp)
└── pages/auth/
    └── EmployeeSignup.jsx  (UPDATED: OTP flow)
```

---

## 🎯 API Endpoints

### 1. Register User (Create unverified account + send OTP)
```
POST /api/auth/register
Content-Type: application/json

{
  "name": "John Doe",
  "email": "john@example.com",
  "password": "securepass123",
  "role": "employee",           // or "hr", "admin"
  "department": "IT",
  "phone": "+1234567890"
}

Response 201:
{
  "message": "Account created. Please verify your email with the OTP sent to your inbox.",
  "email": "john@example.com",
  "userId": "6x7x...",
  "requiresVerification": true
}
```

### 2. Resend OTP
```
POST /api/auth/send-otp
Content-Type: application/json

{
  "email": "john@example.com"
}

Response 200:
{
  "message": "OTP sent to email",
  "email": "john@example.com",
  "expiresIn": 300
}
```

### 3. Verify OTP (Activate account + get token)
```
POST /api/auth/verify-otp
Content-Type: application/json

{
  "email": "john@example.com",
  "code": "123456"
}

Response 200:
{
  "message": "Email verified successfully",
  "token": "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9...",
  "user": {
    "id": "6x7x...",
    "name": "John Doe",
    "email": "john@example.com",
    "role": "employee",
    "isVerified": true,
    ...
  }
}
```

---

## ✨ Features & Flow

### User Registration Flow
1. **User signs up** → name, email, password, role
2. **Backend:**
   - Validates inputs
   - Checks email not already used
   - Hashes password with bcrypt
   - Creates user with `isVerified: false`
   - Generates 6-digit OTP
   - Sends email via Gmail SMTP
   - Returns `requiresVerification: true`
3. **Frontend:**
   - Shows OTP input form
   - Resend button (with 60s cooldown)
4. **User enters OTP** from email
5. **Backend:**
   - Validates OTP code
   - Checks expiration (5 min)
   - Marks user as `isVerified: true`
   - Generates JWT token
   - Returns token + user data
6. **Frontend:**
   - Saves token to localStorage
   - Redirects to dashboard
   - User is logged in!

### Security Considerations Per Requirement
✅ **Secure OTP:** 6-digit random (1M combinations, not guessable)
✅ **Expiration:** 5 minutes auto-expiry
✅ **One-time use:** OTP marked `used: true` after verification
✅ **Rate limiting:** Can't request new OTP within 60 seconds
✅ **Password hashing:** bcrypt with 10 salt rounds
✅ **Email credentials:** In `.env`, not in code
✅ **Input validation:** Email format, password length, OTP format
✅ **Account verification:** Users can't login until email verified

---

## 🚨 Common Issues & Solutions

| Issue | Solution |
|-------|----------|
| Email not received | 1. Check spam folder 2. Verify Gmail App Password 3. Check server logs for email error |
| "SMTP not configured" | This is OK in dev - check server console for OTP code |
| "OTP recently sent" | Wait 60 seconds before requesting again |
| "OTP code has expired" | 5-minute limit - request new one with resend button |
| "Invalid OTP code" | Check you're copying the correct code from email |
| 404 on /verify-otp | Ensure backend is running on http://localhost:5000 |

---

## 📞 Support

For issues:
1. Check `.env` file has correct Gmail credentials
2. View server logs: `npm run dev` output in terminal
3. Check browser console for frontend errors (F12)
4. Verify Gmail App Password is correctly set

