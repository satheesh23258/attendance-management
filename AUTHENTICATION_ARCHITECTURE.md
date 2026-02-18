# Professional Role-Based Authentication System

**Last Updated:** February 18, 2026  
**Status:** Production Ready ✅

## 📋 Table of Contents
1. [System Overview](#system-overview)
2. [Architecture](#architecture)
3. [Tech Stack](#tech-stack)
4. [Features Implemented](#features-implemented)
5. [Folder Structure](#folder-structure)
6. [Database Models](#database-models)
7. [API Endpoints](#api-endpoints)
8. [Frontend Components](#frontend-components)
9. [Security Features](#security-features)
10. [Setup & Installation](#setup--installation)
11. [Testing Guide](#testing-guide)
12. [Deployment Guide](#deployment-guide)

---

## System Overview

A **production-grade, role-based authentication system** for an attendance management platform with support for multiple user roles (Admin, HR, Employee) with email OTP verification and password recovery.

### Key Highlights:
- ✅ Email-based OTP verification (5-minute expiry)
- ✅ Secure password hashing (bcrypt with 10 salt rounds)
- ✅ JWT tokens (7-day expiry)
- ✅ Forgot password with OTP
- ✅ Reset password with validation
- ✅ Input validation using express-validator
- ✅ Rate limiting on OTP requests
- ✅ CORS enabled for frontend
- ✅ Error handling & logging
- ✅ Production-ready deployment

---

## Architecture

### Authentication Flow

#### 1. User Registration (Signup)
```
┌─────────────────────────────────────────────────────────────┐
│ User fills signup form (name, email, password, role)        │
└──────────────────┬──────────────────────────────────────────┘
                   │
┌──────────────────▼──────────────────────────────────────────┐
│ Backend: Hash password → Create User (isVerified: false)    │
│ Generate 6-digit OTP → Store with 5min expiry              │
│ Send OTP to email                                           │
└──────────────────┬──────────────────────────────────────────┘
                   │
┌──────────────────▼──────────────────────────────────────────┐
│ Frontend: Show OTP input field                              │
│ User receives email with OTP code                           │
└─────────────────────────────────────────────────────────────┘
```

#### 2. OTP Verification
```
┌──────────────────────────────────────────┐
│ User enters 6-digit OTP from email       │
└──────────────────┬───────────────────────┘
                   │
┌──────────────────▼───────────────────────┐
│ Backend: Validate OTP code               │
│ Check expiration (5 minutes)             │
│ ✓ Correct: Mark user as verified        │
│           Mark OTP as used               │
│           Create Employee record         │
│           Generate JWT token             │
│           Return token + user            │
│ ✗ Wrong:  Return error immediately     │
└──────────────────┬───────────────────────┘
                   │
┌──────────────────▼───────────────────────┐
│ Frontend: Store JWT in localStorage      │
│ Redirect to dashboard                    │
└──────────────────────────────────────────┘
```

#### 3. User Login
```
┌──────────────────────────────────────────┐
│ User enters email + password             │
└──────────────────┬───────────────────────┘
                   │
┌──────────────────▼───────────────────────┐
│ Backend: Find user by email              │
│ Verify password using bcrypt             │
│ Check if user is verified (isVerified)   │
│ ✓ Valid: Generate JWT token (7 days)    │
│ ✗ Invalid: Return authentication error  │
└──────────────────┬───────────────────────┘
                   │
┌──────────────────▼───────────────────────┐
│ Frontend: Store JWT + user               │
│ Redirect to role-based dashboard         │
└──────────────────────────────────────────┘
```

#### 4. Forgot Password
```
┌──────────────────────────────────────────┐
│ User enters email on forgot-password pg  │
└──────────────────┬───────────────────────┘
                   │
┌──────────────────▼───────────────────────┐
│ Backend: Find user (don't reveal result) │
│ Generate OTP (6 digits, 5min expiry)    │
│ Send OTP to email                        │
│ Return success (security: always true)   │
└──────────────────┬───────────────────────┘
                   │
┌──────────────────▼───────────────────────┐
│ Frontend: Show reset-password form       │
│ User checks email for OTP                │
└──────────────────────────────────────────┘
```

#### 5. Reset Password
```
┌────────────────────────────────────────────────┐
│ User enters: email + OTP + new password        │
└────────────────────┬─────────────────────────────┘
                     │
┌────────────────────▼─────────────────────────────┐
│ Backend: Validate OTP code                      │
│ Check expiration                                │
│ ✓ Valid: Hash new password                      │
│         Update user record                      │
│         Mark OTP as used                        │
│         Return success                          │
│ ✗ Invalid: Return error                         │
└────────────────────┬─────────────────────────────┘
                     │
┌────────────────────▼─────────────────────────────┐
│ Frontend: Redirect to login page                │
│ User can now login with new password            │
└────────────────────────────────────────────────────┘
```

---

## Tech Stack

### Frontend
- **Framework:** Vite + React 18.2
- **UI Library:** Material-UI (MUI) 5.x
- **HTTP Client:** Axios with interceptors
- **State Management:** React Context (AuthContext)
- **Notifications:** React Hot Toast
- **Routing:** React Router v6

### Backend
- **Runtime:** Node.js
- **Framework:** Express.js 4.18
- **Database:** MongoDB (local)
- **Authentication:** JWT (jsonwebtoken)
- **Password Hashing:** bcryptjs
- **Email:** Nodemailer with Gmail SMTP
- **Input Validation:** express-validator
- **Environment:** dotenv

### Infrastructure
- **Dev Server:** Vite (Frontend) + Node --watch (Backend)
- **Port:** Frontend 3000-3003, Backend 5000
- **Database:** MongoDB localhost:27017

---

## Features Implemented

### ✅ 1. SIGNUP WITH OTP
- [x] User roles: Admin, HR, Employee
- [x] Fields: name, role, email, password, department, phone, employeeId
- [x] Hash password using bcrypt (10 salt rounds)
- [x] Generate secure 6-digit OTP
- [x] Store OTP with 5-minute expiration
- [x] Send OTP to user's email via Gmail
- [x] User account created but marked unverified
- [x] Add isVerified field in User model
- [x] Input validation (email format, password strength, phone)
- [x] Prevent duplicate email accounts
- [x] Rate limit OTP resend (60-second cooldown)

### ✅ 2. VERIFY OTP
- [x] POST /api/auth/verify-otp
- [x] Accept email + OTP code
- [x] Validate OTP format (6 digits only)
- [x] Check expiration (5 minutes)
- [x] If correct:
  - [x] Mark user as verified (isVerified: true)
  - [x] Delete OTP record (mark as used)
  - [x] Create Employee record
  - [x] Generate JWT token (7-day expiry)
  - [x] Return token + user object
- [x] If incorrect: Return proper error message
- [x] Prevent OTP reuse (mark as used)

### ✅ 3. LOGIN SYSTEM
- [x] Only verified users can login
- [x] Validate email + password
- [x] Password validation using bcrypt
- [x] Generate JWT token (7-day expiry)
- [x] Return user object + token
- [x] Store token in localStorage (frontend)
- [x] Protect routes using JWT middleware
- [x] Handle expired tokens (401 response)

### ✅ 4. FORGOT PASSWORD WITH OTP
- [x] POST /api/auth/forgot-password
  - [x] Accept email
  - [x] Generate new OTP (6 digits)
  - [x] Store with 5-minute expiration
  - [x] Send OTP to email
  - [x] Always return success (security: don't reveal if email exists)
- [x] Rate limiting (60-second cooldown)
- [x] Proper error handling

### ✅ 5. RESET PASSWORD
- [x] POST /api/auth/reset-password
  - [x] Accept email + OTP + new password
  - [x] Validate OTP code format
  - [x] Check expiration
  - [x] If valid:
    - [x] Hash new password using bcrypt
    - [x] Update user's password
    - [x] Mark OTP as used
    - [x] Return success
  - [x] If invalid: Return error
- [x] Password strength validation
  - [x] Minimum 8 characters
  - [x] Contains uppercase + lowercase + numbers
- [x] Secure password handling

### ✅ 6. SECURITY REQUIREMENTS
- [x] Use dotenv for email & JWT secrets
- [x] Gmail App Password (not regular password)
- [x] CORS configuration
- [x] express-validator for input validation
- [x] Prevent duplicate accounts
- [x] Resend OTP endpoint with rate limiting
- [x] Error handling middleware
- [x] Professional project structure
- [x] Password strength requirements
- [x] Secure token storage (localStorage frontend, JWT verification backend)

### ✅ 7. FRONTEND COMPONENTS
- [x] Signup pages (Employee, HR, Admin)
- [x] OTP verification during signup
- [x] Login pages (Employee, HR, Admin)
- [x] Forgot Password page
- [x] Reset Password page
- [x] JWT storage in localStorage
- [x] Protected routes via middleware
- [x] Loading states (forms, buttons)
- [x] Error messages (form validation, API errors)
- [x] Success messages (signup, verification, login)
- [x] Resend OTP button with countdown timer
- [x] Password visibility toggle

---

## Folder Structure

```
attendance-management/
├── server/
│   ├── config/
│   │   └── email.js                 # Nodemailer configuration
│   │   └── db.js                    # MongoDB connection
│   ├── middleware/
│   │   ├── auth.js                  # JWT verification middleware
│   │   ├── hybridAuth.js            # Role-based auth
│   │   └── validation.js            # Input validation rules ⭐ NEW
│   ├── models/
│   │   ├── User.js                  # User schema with isVerified
│   │   ├── Otp.js                   # OTP schema with TTL
│   │   ├── Employee.js
│   │   ├── Leave.js
│   │   ├── Attendance.js
│   │   ├── Location.js
│   │   ├── Notification.js
│   │   ├── Service.js
│   │   └── HybridPermission.js
│   ├── routes/
│   │   ├── authRoutes.js            # All auth endpoints ⭐ UPDATED
│   │   ├── employeeRoutes.js
│   │   ├── attendanceRoutes.js
│   │   ├── locationRoutes.js
│   │   ├── leaveRoutes.js
│   │   ├── notificationRoutes.js
│   │   ├── serviceRoutes.js
│   │   └── hybridPermissionRoutes.js
│   ├── server.js                    # Express app & setup
│   └── package.json
│
├── src/
│   ├── pages/
│   │   └── auth/
│   │       ├── AdminLogin.jsx            # Admin login with forgot-password link
│   │       ├── HRLogin.jsx               # HR login with forgot-password link
│   │       ├── EmployeeLogin.jsx         # Employee login with forgot-password link
│   │       ├── AdminSignup.jsx           # Admin signup with OTP
│   │       ├── HRSignup.jsx              # HR signup with OTP
│   │       ├── EmployeeSignup.jsx        # Employee signup with OTP
│   │       ├── ForgotPassword.jsx        # ⭐ NEW - Forgot password form
│   │       └── ResetPassword.jsx         # ⭐ NEW - Reset password with OTP
│   │
│   ├── contexts/
│   │   └── AuthContext.jsx          # Global auth state & methods
│   │
│   ├── services/
│   │   └── api.js                   # Axios API client ⭐ UPDATED
│   │
│   └── App.jsx                      # Route definitions ⭐ UPDATED
│
├── .env                             # Secret config (gitignored)
├── .env.example                     # Template for .env
├── .gitignore                       # Ignores node_modules, .env, dist
├── EMAIL_OTP_SETUP.md               # Email verification setup guide
└── AUTHENTICATION_ARCHITECTURE.md   # This file

```

---

## Database Models

### 1. User Model
```javascript
{
  _id: ObjectId,
  name: String (required),
  email: String (unique, required, lowercase),
  password: String (hashed, required),
  role: String (enum: 'admin', 'hr', 'employee'),
  isVerified: Boolean (default: false),           // ⭐ NEW
  status: String (default: 'active'),
  department: String,
  employeeId: String,
  phone: String,
  branchName: String,
  hybridPermissions: {
    hasAccess: Boolean,
    roles: Array
  },
  createdAt: Date,
  updatedAt: Date
}
```

### 2. OTP Model
```javascript
{
  _id: ObjectId,
  email: String (indexed),
  code: String (6 digits),
  used: Boolean (default: false),
  expiresAt: Date (TTL: 5 minutes),
  createdAt: Date
}
```

### 3. Employee Model
```javascript
{
  _id: ObjectId,
  name: String,
  email: String (indexed),
  role: String,
  department: String,
  phone: String,
  employeeId: String,
  isActive: Boolean,
  joinDate: Date,
  branchName: String,
  ...other fields
}
```

---

## API Endpoints

### Authentication Endpoints

#### 1. POST /api/auth/register
**Create new user account and send OTP**

Request:
```json
{
  "name": "John Doe",
  "email": "john@company.com",
  "password": "SecurePass123",
  "role": "employee",
  "department": "Engineering",
  "employeeId": "EMP001",
  "phone": "+1 (555) 123-4567"
}
```

Response (201):
```json
{
  "message": "Account created. Please verify your email with the OTP sent to your inbox.",
  "email": "john@company.com",
  "userId": "6995a5e23ed856851dd1e062",
  "requiresVerification": true
}
```

Validation:
- ✅ Name: required, min 2 chars
- ✅ Email: required, valid format, unique
- ✅ Password: required, min 8 chars, contains uppercase + lowercase + numbers
- ✅ Role: optional, must be 'admin'|'hr'|'employee'
- ✅ Phone: optional, valid phone format

---

#### 2. POST /api/auth/login
**Authenticate verified user**

Request:
```json
{
  "email": "john@company.com",
  "password": "SecurePass123"
}
```

Response (200):
```json
{
  "token": "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9...",
  "user": {
    "id": "6995a5e23ed856851dd1e062",
    "name": "John Doe",
    "email": "john@company.com",
    "role": "employee",
    "isVerified": true,
    "department": "Engineering",
    "status": "active"
  }
}
```

Validation:
- ✅ Email: required, valid format
- ✅ Password: required (min 1 char)

Errors:
- 401: Invalid email or password
- 401: Account is inactive
- 404: User not found

---

#### 3. POST /api/auth/send-otp
**Request OTP for signup or forgot password**

Request:
```json
{
  "email": "john@company.com"
}
```

Response (200):
```json
{
  "message": "OTP sent to email",
  "email": "john@company.com",
  "expiresIn": 300
}
```

Validation:
- ✅ Email: required, valid format
- ✅ Rate limit: max 1 OTP per 60 seconds

---

#### 4. POST /api/auth/verify-otp
**Verify OTP and complete signup**

Request:
```json
{
  "email": "john@company.com",
  "code": "983460"
}
```

Response (200):
```json
{
  "message": "Email verified successfully",
  "token": "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9...",
  "user": {
    "id": "6995a5e23ed856851dd1e062",
    "name": "John Doe",
    "email": "john@company.com",
    "isVerified": true,
    "role": "employee"
  }
}
```

Validation:
- ✅ Email: required, valid format
- ✅ Code: required, exactly 6 digits, numeric only

Errors:
- 400: Invalid OTP code
- 400: OTP code has expired (5 min max)
- 400: Email already verified

---

#### 5. POST /api/auth/forgot-password ⭐ NEW
**Request OTP for password reset**

Request:
```json
{
  "email": "john@company.com"
}
```

Response (200):
```json
{
  "message": "If the email exists, an OTP will be sent to reset your password",
  "email": "john@company.com",
  "expiresIn": 300
}
```

**Important:** Always returns success for security (doesn't reveal if email exists)

---

#### 6. POST /api/auth/reset-password ⭐ NEW
**Reset password using OTP**

Request:
```json
{
  "email": "john@company.com",
  "code": "983460",
  "newPassword": "NewSecurePass456"
}
```

Response (200):
```json
{
  "message": "Password reset successfully. You can now login with your new password."
}
```

Validation:
- ✅ Email: required, valid format
- ✅ Code: required, exactly 6 digits
- ✅ New Password: required, min 8 chars, uppercase + lowercase + numbers

Errors:
- 400: Invalid OTP code
- 400: OTP code has expired
- 404: User not found

---

#### 7. GET /api/auth/me
**Get current authenticated user**

Headers:
```
Authorization: Bearer <token>
```

Response (200):
```json
{
  "id": "6995a5e23ed856851dd1e062",
  "name": "John Doe",
  "email": "john@company.com",
  "role": "employee",
  "isVerified": true,
  "department": "Engineering"
}
```

---

## Frontend Components

### 1. AdminSignup.jsx ✅
- Two-step OTP verification flow
- Input validation (name, email, password, phone, department)
- OTP input field after signup submission
- Resend OTP button with 60s cooldown
- Redirects to /login/admin after verification

### 2. HRSignup.jsx ✅
- Two-step OTP verification flow
- HR-specific fields (HR Email, HR Department)
- OTP input with resend functionality
- Redirects to /login/hr after verification

### 3. EmployeeSignup.jsx ✅
- Two-step OTP verification flow
- Employee-specific fields (department, position, employeeId)
- OTP input with countdown timer
- Redirects to /login/employee after verification

### 4. AdminLogin.jsx ✅ UPDATED
- Login form (email + password)
- **NEW:** "Forgot Password?" link (color-matched)
- Demo credentials display
- Redirects to /dashboard/admin on success

### 5. HRLogin.jsx ✅ UPDATED
- Login form (email + password)
- **NEW:** "Forgot Password?" link (color-matched)
- Demo credentials display
- Redirects to /dashboard/hr on success

### 6. EmployeeLogin.jsx ✅ UPDATED
- Login form (email + password)
- **NEW:** "Forgot Password?" link (color-matched)
- Demo credentials display
- Redirects to /dashboard/employee on success

### 7. ForgotPassword.jsx ⭐ NEW
**Purpose:** Request OTP for password reset

Features:
- Email input field
- Submit button triggers OTP sending
- Security notice: "We don't confirm if email exists"
- Success message with instruction to check email
- Link to continue to reset password page
- Back to login button

States:
- `!otpSent`: Show email input
- `otpSent`: Show success message with continue button

---

### 8. ResetPassword.jsx ⭐ NEW
**Purpose:** Reset password using OTP

Features:
- Email input field
- OTP code input (6 digits)
- New password field with visibility toggle
- Confirm password field with visibility toggle
- Password strength requirements displayed
- Security notice: "Password will be hashed"
- Redirect to login on success

Validations:
- ✅ All fields required
- ✅ Password min 8 characters
- ✅ Uppercase + lowercase + numbers
- ✅ Passwords must match
- ✅ OTP must be 6 digits

---

## Security Features

### 1. Password Security
- ✅ Bcrypt hashing with 10 salt rounds
- ✅ Never store plain text passwords
- ✅ Password strength requirements:
  - Minimum 8 characters
  - At least 1 uppercase letter
  - At least 1 lowercase letter
  - At least 1 number
- ✅ Secure password reset with OTP

### 2. Email Verification
- ✅ OTP sent via Gmail SMTP
- ✅ OTP expires in 5 minutes
- ✅ One-time use OTP (marked as used)
- ✅ Rate limiting (60-second resend cooldown)
- ✅ Users can't login until verified

### 3. JWT Authentication
- ✅ JWT tokens expire in 7 days
- ✅ Tokens stored in localStorage (frontend)
- ✅ Bearer token in Authorization header
- ✅ Server verifies token signature
- ✅ Expired tokens return 401 Unauthorized

### 4. Input Validation
- ✅ express-validator on all endpoints
- ✅ Email format validation
- ✅ Phone number format validation
- ✅ Role enum validation
- ✅ OTP format validation (6 digits, numeric)
- ✅ Password strength validation
- ✅ Max length validation on strings

### 5. Account Protection
- ✅ Prevent duplicate email accounts
- ✅ Account locked until email verified
- ✅ Inactive accounts can't login
- ✅ Password reset requires valid OTP
- ✅ Forgot password doesn't reveal if email exists

### 6. API Security
- ✅ CORS enabled for localhost
- ✅ All routes require HTTPS in production
- ✅ Rate limiting on OTP endpoints
- ✅ Input sanitization on email fields
- ✅ Error messages don't leak database info

### 7. Environment Security
- ✅ .env file gitignored (not committed)
- ✅ Use Gmail App Password (not regular password)
- ✅ JWT_SECRET stored in .env
- ✅ Production requires strong JWT_SECRET
- ✅ .env.example shows required variables

---

## Setup & Installation

### Prerequisites
- Node.js v14+ 
- MongoDB running locally (mongodb://localhost:27017)
- Gmail account with App Password enabled

### 1. Install Backend Dependencies
```bash
cd server
npm install
```

### 2. Install Frontend Dependencies
```bash
npm install
```

### 3. Configure Gmail App Password

1. Go to [myaccount.google.com](https://myaccount.google.com)
2. Click "Security" in left sidebar
3. Enable "2-Step Verification" if not done
4. Scroll to "App passwords" (appears only if 2FA enabled)
5. Select "Mail" and "Windows Computer"
6. Click "Generate"
7. Copy the 16-character password (includes spaces)

### 4. Create .env File

**Root directory (attendance-management/):**
```bash
# MongoDB Configuration (Backend)
MONGO_URI=mongodb://localhost:27017/attendance-employee-management

# API Configuration
VITE_API_URL=http://localhost:5000/api

# Google Maps API Key
VITE_GOOGLE_MAPS_API_KEY=your_google_maps_api_key_here

# JWT Configuration
VITE_JWT_SECRET=your_super_secret_jwt_key_min_32_chars_long_for_production

# Email Configuration (Gmail)
NODE_ENV=development
SMTP_HOST=smtp.gmail.com
SMTP_PORT=587
SMTP_SECURE=false
SMTP_USER=your-email@gmail.com
SMTP_PASS=your_16_char_app_password_from_step_3
EMAIL_FROM=your-email@gmail.com

# App Configuration
VITE_APP_NAME=Employee Management System
VITE_APP_VERSION=1.0.0
VITE_NODE_ENV=development
```

### 5. Start MongoDB
```bash
# Windows
mongod

# macOS/Linux
brew services start mongodb-community
```

### 6. Start Backend Server
```bash
cd server
npm run dev
# Watches for changes, runs on port 5000
```

### 7. Start Frontend Server
```bash
npm run dev
# Runs on port 3000 (or next available)
```

### 8. Access Application
- **Frontend:** http://localhost:3000 (or http://localhost:3003 if ports busy)
- **Backend API:** http://localhost:5000/api

---

## Testing Guide

### 1. Test Signup Flow (Employee)
1. Navigate to http://localhost:3000/signup/employee
2. Fill form:
   - First Name: "Test"
   - Last Name: "User"
   - Email: "test@example.com"
   - Password: "TestPassword123"
   - Confirm Password: "TestPassword123"
   - Department: "Engineering"
   - Phone: "+1 (555) 123-4567"
3. Click "Create Employee Account"
4. Check email inbox for OTP (or console if SMTP not fully configured)
5. From MongoDB OTP query, get the 6-digit code
6. Enter OTP on verification page
7. Click "Verify & Complete"
8. Should redirect to /login/employee

### 2. Test Login
1. Navigate to http://localhost:3000/login/employee
2. Login with credentials from step 1
3. Should redirect to /dashboard/employee
4. Check localStorage for JWT token (DevTools → Application → localStorage)

### 3. Test Forgot Password
1. Navigate to http://localhost:3000/login/employee
2. Click "Forgot Password?" link
3. Enter email from test
4. Check MongoDB for OTP
5. Navigate to /reset-password
6. Fill form:
   - Email: (same email)
   - OTP: (6-digit code from DB)
   - New Password: "NewPassword456"
   - Confirm: "NewPassword456"
7. Click "Reset Password"
8. Should redirect to login
9. Login with new password

### 4. Test OTP Rate Limiting
1. Click "Resend" on OTP verification page
2. Try to resend immediately again
3. Should receive: "OTP recently sent. Please wait a moment before requesting another."
4. Wait 60 seconds and try again
5. Should succeed

### 5. Test Input Validation

**Weak Password:**
- Password: "test"
- Error: "Password must be at least 8 characters"

**Invalid Email:**
- Email: "notanemail"
- Error: "Invalid email format"

**Weak OTP:**
- Code: "12345" (only 5 digits)
- Error: "OTP must be 6 digits"

### 6. Test Expired OTP
1. Get OTP from MongoDB
2. Wait 5+ minutes
3. Try to verify
4. Should error: "OTP code has expired"

---

## Deployment Guide

### Production Checklist

#### 1. Environment Variables
```bash
# Set strong secrets
JWT_SECRET=generate_min_32_char_secure_random_string
NODE_ENV=production
```

#### 2. Gmail Configuration
```
SMTP_USER=your-company@gmail.com
SMTP_PASS=correct_app_password_16_chars
```
> Use company Gmail account in production

#### 3. MongoDB
```
# Use MongoDB Atlas (cloud) for production
MONGO_URI=mongodb+srv://user:password@cluster.mongodb.net/attendance-management
```

#### 4. CORS Configuration
Update `server.js`:
```javascript
app.use(cors({
  origin: ['https://yourdomain.com'],
  credentials: true
}))
```

#### 5. Frontend Build
```bash
npm run build
# Creates optimized dist/ folder
```

#### 6. Deploy Backend
- Use services: Heroku, Railway, Render, AWS Elastic Beanstalk
- Set environment variables before deploy
- Ensure MongoDB is accessible from cloud

#### 7. Deploy Frontend
- Use services: Vercel, Netlify, AWS S3 + CloudFront
- Build: `npm run build`
- Upload `dist/` folder
- Set `VITE_API_URL` to production backend URL

#### 8. HTTPS & Security
- ✅ Use HTTPS (not HTTP)
- ✅ Enable CORS properly
- ✅ Set secure cookies
- ✅ Use strong JWT_SECRET (min 32 chars)
- ✅ Enable rate limiting in production

#### 9. Monitoring
```javascript
// Add error tracking to production
import Sentry from '@sentry/node'
app.use(Sentry.Handlers.errorHandler())
```

#### 10. Database Backups
- Configure MongoDB Atlas automated backups
- Test restore procedures
- Monitor query performance

---

## Troubleshooting

### Email Not Sending
1. Check SMTP_USER and SMTP_PASS in .env
2. Verify Gmail App Password is correct (16 chars, includes spaces)
3. Check if 2FA is enabled on Gmail
4. Check server logs for SMTP errors
5. In dev mode, OTP prints to console

### OTP Not Generating
1. Ensure MongoDB is running
2. Check connection to database: `mongosh`
3. Verify Otp model is imported in routes
4. Check server logs for errors

### Login Fails After Signup
1. Verify user has `isVerified: true` in MongoDB
2. Check password was hashed (starts with $2a$)
3. Verify JWT_SECRET is set in .env
4. Check for expired JWT tokens (7 days)

### Frontend Routes Not Working
1. Check routes are added to App.jsx
2. Verify components are imported correctly
3. Clear browser cache
4. Restart dev server

### CORS Errors
1. Ensure CORS is enabled in backend: `cors()` middleware
2. Check preflight OPTIONS requests pass
3. Set `VITE_API_URL` correctly in .env

---

## Additional Resources

### Documents
- `EMAIL_OTP_SETUP.md` - Detailed email configuration
- `.env.example` - Environment variable template

### Files Modified
- ✅ `server/routes/authRoutes.js` - Added forgot/reset endpoints
- ✅ `server/middleware/validation.js` - Input validation rules
- ✅ `src/pages/auth/ForgotPassword.jsx` - Forgot password form
- ✅ `src/pages/auth/ResetPassword.jsx` - Reset password form
- ✅ `src/services/api.js` - API methods for forgot/reset
- ✅ `src/App.jsx` - Forgot/reset password routes
- ✅ Login pages - Added forgot password links

### Git Commits
```
- "refactor(auth): production-ready OTP email verification with Gmail..."
- "feat(auth): add OTP email verification to HR and Admin signup flows"
- "feat(auth): complete forgot password and reset password flow..."
```

---

## Support Matrix

| Feature | Status | Notes |
|---------|--------|-------|
| Signup with OTP | ✅ Complete | All 3 roles supported |
| Email Verification | ✅ Complete | Gmail SMTP configured |
| Login | ✅ Complete | 7-day JWT tokens |
| Forgot Password | ✅ Complete | OTP-based reset |
| Reset Password | ✅ Complete | Password strength validation |
| Input Validation | ✅ Complete | express-validator on all endpoints |
| Rate Limiting | ✅ Complete | 60s OTP cooldown |
| Password Hashing | ✅ Complete | bcrypt 10 salt rounds |
| Protected Routes | ✅ Complete | JWT middleware |
| Error Handling | ✅ Complete | Comprehensive error responses |
| CORS | ✅ Complete | Configured for localhost |

---

**Status:** Production Ready ✅  
**Last Updated:** February 18, 2026  
**Version:** 1.0.0
