# Admin Dashboard Setup Guide

## 🔐 Environment Variables Required

The admin dashboard requires two critical environment variables to function:

### 1. ADMIN_PASSWORD
- **Purpose**: The password used to authenticate into the admin dashboard
- **Required**: Yes
- **Example**: `ADMIN_PASSWORD=MySecurePassword123!`

### 2. ADMIN_SECRET_KEY 
- **Purpose**: Secret key for signing JWT tokens (authentication)
- **Required**: Yes
- **Generate with**: `openssl rand -base64 32`
- **Example**: `ADMIN_SECRET_KEY=6Q7VdKxvuUqnP8YrL2+m5AzWj9nE3Fg1HsKpRtYoL7X=`

## 🚀 Setup Instructions

### For Local Development:
1. Copy `.env.example` to `.env.local`:
   ```bash
   cp .env.example .env.local
   ```

2. Edit `.env.local` and set your values:
   ```env
   ADMIN_PASSWORD=your_chosen_password
   ADMIN_SECRET_KEY=your_generated_secret_key
   ```

### For Production Deployment:
1. Set environment variables in your hosting platform:
   - **Vercel**: Project Settings → Environment Variables
   - **Netlify**: Site Settings → Environment Variables
   - **Railway**: Variables tab
   - **Other platforms**: Check their documentation

2. Never commit `.env` files with real credentials to git!

## 🔄 Authentication Flow

The new authentication system works as follows:

### Login Process:
1. User enters password on `/admin` page
2. Password sent to `/api/admin/login` endpoint
3. Server validates against `ADMIN_PASSWORD` environment variable
4. If valid, JWT token created and stored in secure HTTP-only cookie
5. User redirected to admin dashboard

### Session Management:
- JWT tokens expire after 1 hour
- Automatic session verification on page loads
- Rate limiting: 5 failed attempts = 15 minute lockout
- Secure HTTP-only cookies (not accessible via JavaScript)

### Logout Process:
- JWT cookie deleted from browser
- User redirected to login page

## 🛡️ Security Features

- ✅ **No client-side password storage** (was security vulnerability)
- ✅ **JWT-based authentication** with secure HTTP-only cookies
- ✅ **Rate limiting** to prevent brute force attacks
- ✅ **Automatic session expiration** (1 hour)
- ✅ **Environment variable validation** (fails if not set)
- ✅ **IP-based failed attempt tracking**

## 🚨 Troubleshooting

### "Server configuration error"
- **Cause**: Missing `ADMIN_PASSWORD` or `ADMIN_SECRET_KEY` environment variables
- **Solution**: Set both environment variables in your hosting platform

### "Too many failed attempts"
- **Cause**: Rate limiting activated (5 failed attempts)
- **Solution**: Wait 15 minutes or restart the server to clear attempts

### Admin login not working
- **Check**: Environment variables are set correctly
- **Check**: No typos in password
- **Check**: Server logs for error messages

## 📱 Admin Dashboard Features

Once logged in, you have access to 6 management tabs:

1. **Connections** - Contact form submissions
2. **Reviews** - Testimonial approval system
3. **Feedback** - User feedback management
4. **Projects** - Portfolio project management
5. **Experience** - Work experience management
6. **Stats** - Analytics dashboard

Each tab has search, filtering, and data management capabilities.