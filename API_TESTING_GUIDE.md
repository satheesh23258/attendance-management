# API Testing Guide

Quick reference for testing authentication endpoints using curl or Postman.

## Base URL
```
http://localhost:5000/api
```

---

## 1. Signup (Register New User)

### Request
```bash
curl -X POST http://localhost:5000/api/auth/register \
  -H "Content-Type: application/json" \
  -d '{
    "name": "John Doe",
    "email": "john@example.com",
    "password": "SecurePass123",
    "role": "employee",
    "department": "Engineering",
    "phone": "+1 (555) 123-4567",
    "employeeId": "EMP001"
  }'
```

### Expected Response (201)
```json
{
  "message": "Account created. Please verify your email with the OTP sent to your inbox.",
  "email": "john@example.com",
  "userId": "6995a5e23ed856851dd1e062",
  "requiresVerification": true
}
```

---

## 2. Send OTP

### Request
```bash
curl -X POST http://localhost:5000/api/auth/send-otp \
  -H "Content-Type: application/json" \
  -d '{
    "email": "john@example.com"
  }'
```

### Expected Response (200)
```json
{
  "message": "OTP sent to email",
  "email": "john@example.com",
  "expiresIn": 300
}
```

---

## 3. Verify OTP (Complete Signup)

### Request
```bash
curl -X POST http://localhost:5000/api/auth/verify-otp \
  -H "Content-Type: application/json" \
  -d '{
    "email": "john@example.com",
    "code": "983460"
  }'
```

### Expected Response (200)
```json
{
  "message": "Email verified successfully",
  "token": "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9...",
  "user": {
    "id": "6995a5e23ed856851dd1e062",
    "name": "John Doe",
    "email": "john@example.com",
    "isVerified": true,
    "role": "employee"
  }
}
```

---

## 4. Login

### Request
```bash
curl -X POST http://localhost:5000/api/auth/login \
  -H "Content-Type: application/json" \
  -d '{
    "email": "john@example.com",
    "password": "SecurePass123"
  }'
```

### Expected Response (200)
```json
{
  "token": "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9...",
  "user": {
    "id": "6995a5e23ed856851dd1e062",
    "name": "John Doe",
    "email": "john@example.com",
    "role": "employee",
    "isVerified": true,
    "status": "active"
  }
}
```

---

## 5. Forgot Password (Request Reset OTP)

### Request
```bash
curl -X POST http://localhost:5000/api/auth/forgot-password \
  -H "Content-Type: application/json" \
  -d '{
    "email": "john@example.com"
  }'
```

### Expected Response (200)
```json
{
  "message": "If the email exists, an OTP will be sent to reset your password",
  "email": "john@example.com",
  "expiresIn": 300
}
```

**Note:** Always returns success for security (doesn't reveal if email exists)

---

## 6. Reset Password

### Request
```bash
curl -X POST http://localhost:5000/api/auth/reset-password \
  -H "Content-Type: application/json" \
  -d '{
    "email": "john@example.com",
    "code": "983460",
    "newPassword": "NewPassword456"
  }'
```

### Expected Response (200)
```json
{
  "message": "Password reset successfully. You can now login with your new password."
}
```

---

## 7. Get Current User (Protected)

### Request
```bash
curl -X GET http://localhost:5000/api/auth/me \
  -H "Authorization: Bearer YOUR_JWT_TOKEN_HERE"
```

### Expected Response (200)
```json
{
  "id": "6995a5e23ed856851dd1e062",
  "name": "John Doe",
  "email": "john@example.com",
  "role": "employee",
  "isVerified": true,
  "department": "Engineering"
}
```

---

## Error Responses

### 400 - Validation Failed
```json
{
  "message": "Validation failed",
  "errors": [
    {
      "field": "email",
      "message": "Invalid email format"
    },
    {
      "field": "password",
      "message": "Password must be at least 8 characters"
    }
  ]
}
```

### 400 - Invalid OTP
```json
{
  "message": "Invalid OTP code"
}
```

### 400 - OTP Expired
```json
{
  "message": "OTP code has expired"
}
```

### 401 - Authentication Failed
```json
{
  "message": "Invalid email or password"
}
```

### 429 - Rate Limited
```json
{
  "message": "OTP recently sent. Please wait a moment before requesting another."
}
```

---

## Testing Steps

### Step 1: Create Account
```bash
curl -X POST http://localhost:5000/api/auth/register \
  -H "Content-Type: application/json" \
  -d '{
    "name": "Test User",
    "email": "test@example.com",
    "password": "TestPassword123",
    "role": "employee"
  }'
```
Save the `userId` from response.

### Step 2: Get OTP from MongoDB
```bash
mongosh
use attendance-employee-management
db.otps.findOne({email: "test@example.com"})
```
Copy the `code` field.

### Step 3: Verify OTP
```bash
curl -X POST http://localhost:5000/api/auth/verify-otp \
  -H "Content-Type: application/json" \
  -d '{
    "email": "test@example.com",
    "code": "PASTE_OTP_CODE_HERE"
  }'
```
Save the `token` from response.

### Step 4: Login
```bash
curl -X POST http://localhost:5000/api/auth/login \
  -H "Content-Type: application/json" \
  -d '{
    "email": "test@example.com",
    "password": "TestPassword123"
  }'
```

### Step 5: Test Protected Route
```bash
curl -X GET http://localhost:5000/api/auth/me \
  -H "Authorization: Bearer PASTE_TOKEN_HERE"
```

### Step 6: Test Forgot Password
```bash
curl -X POST http://localhost:5000/api/auth/forgot-password \
  -H "Content-Type: application/json" \
  -d '{
    "email": "test@example.com"
  }'
```

### Step 7: Reset Password
```bash
# Get new OTP from MongoDB
mongosh
use attendance-employee-management
db.otps.findOne({email: "test@example.com", used: false}, {sort: {createdAt: -1}})
```

```bash
curl -X POST http://localhost:5000/api/auth/reset-password \
  -H "Content-Type: application/json" \
  -d '{
    "email": "test@example.com",
    "code": "NEW_OTP_CODE",
    "newPassword": "NewPassword789"
  }'
```

### Step 8: Login with New Password
```bash
curl -X POST http://localhost:5000/api/auth/login \
  -H "Content-Type: application/json" \
  -d '{
    "email": "test@example.com",
    "password": "NewPassword789"
  }'
```

---

## Postman Collection

Import this into Postman for easy testing:

```json
{
  "info": {
    "name": "Auth API",
    "schema": "https://schema.getpostman.com/json/collection/v2.1.0/collection.json"
  },
  "item": [
    {
      "name": "Register",
      "request": {
        "method": "POST",
        "url": "{{baseUrl}}/auth/register",
        "body": {
          "mode": "raw",
          "raw": "{\n  \"name\": \"Test User\",\n  \"email\": \"test@example.com\",\n  \"password\": \"TestPassword123\",\n  \"role\": \"employee\"\n}"
        }
      }
    },
    {
      "name": "Login",
      "request": {
        "method": "POST",
        "url": "{{baseUrl}}/auth/login",
        "body": {
          "mode": "raw",
          "raw": "{\n  \"email\": \"test@example.com\",\n  \"password\": \"TestPassword123\"\n}"
        }
      }
    },
    {
      "name": "Verify OTP",
      "request": {
        "method": "POST",
        "url": "{{baseUrl}}/auth/verify-otp",
        "body": {
          "mode": "raw",
          "raw": "{\n  \"email\": \"test@example.com\",\n  \"code\": \"000000\"\n}"
        }
      }
    },
    {
      "name": "Forgot Password",
      "request": {
        "method": "POST",
        "url": "{{baseUrl}}/auth/forgot-password",
        "body": {
          "mode": "raw",
          "raw": "{\n  \"email\": \"test@example.com\"\n}"
        }
      }
    },
    {
      "name": "Reset Password",
      "request": {
        "method": "POST",
        "url": "{{baseUrl}}/auth/reset-password",
        "body": {
          "mode": "raw",
          "raw": "{\n  \"email\": \"test@example.com\",\n  \"code\": \"000000\",\n  \"newPassword\": \"NewPassword456\"\n}"
        }
      }
    },
    {
      "name": "Get Current User",
      "request": {
        "method": "GET",
        "header": [
          {
            "key": "Authorization",
            "value": "Bearer {{token}}"
          }
        ],
        "url": "{{baseUrl}}/auth/me"
      }
    }
  ],
  "variable": [
    {
      "key": "baseUrl",
      "value": "http://localhost:5000/api"
    },
    {
      "key": "token",
      "value": ""
    }
  ]
}
```

**Setup:**
1. Create new Postman Collection
2. Set `baseUrl` to `http://localhost:5000/api`
3. After login, copy token and paste in `{{token}}` variable
4. Use {{baseUrl}} and {{token}} in requests

---

## Common Validation Errors

### Invalid Email
```
❌ "test@" → Invalid email format
❌ "test" → Invalid email format
✅ "test@example.com" → Valid
```

### Weak Password
```
❌ "test" → Password must be at least 8 characters
❌ "testpass" → Must contain uppercase, lowercase, and numbers
❌ "TestPass" → Must contain at least one number
✅ "TestPass123" → Valid
```

### Invalid OTP
```
❌ "12345" → OTP must be 6 digits
❌ "abcdef" → OTP must contain only numbers
❌ "1234567" → OTP must be 6 digits
✅ "123456" → Valid
```

### Rate Limiting
```
❌ Request OTP twice within 60 seconds
   → "OTP recently sent. Please wait..."
✅ Wait 60 seconds before requesting again
```

---

## Database Queries

### Find All OTPs
```javascript
mongosh
use attendance-employee-management
db.otps.find()
```

### Find Specific User OTP
```javascript
db.otps.findOne({email: "test@example.com"})
```

### Delete Used OTPs
```javascript
db.otps.deleteMany({used: true})
```

### Check User Verification Status
```javascript
db.users.findOne({email: "test@example.com"}, {email: 1, isVerified: 1})
```

### Update User Password Manually
```javascript
const bcrypt = require('bcryptjs')
const hashedPassword = await bcrypt.hash("NewPassword123", 10)
db.users.updateOne(
  {email: "test@example.com"},
  {$set: {password: hashedPassword}}
)
```

---

## Performance Tips

- OTP expires in 5 minutes (300 seconds)
- Rate limit: 60 seconds between OTP requests
- JWT tokens expire in 7 days
- Password hashing takes ~100ms (bcrypt 10 rounds)
- Email sending typically takes 1-3 seconds

---

**Last Updated:** February 18, 2026
