# 🔍 Vercel Deployment - Testing & Debugging Guide

## Your App is Already Deployed! Let's Test It

### 📋 Quick Testing Checklist

Visit your Vercel URL and test each of these:

#### 1. ✅ Landing Page
- [ ] `https://your-app.vercel.app/en-IN` - Should load
- [ ] `https://your-app.vercel.app/hi-IN` - Hindi version
- [ ] `https://your-app.vercel.app/kn-IN` - Kannada version
- [ ] `https://your-app.vercel.app/ta-IN` - Tamil version
- [ ] `https://your-app.vercel.app/te-IN` - Telugu version
- [ ] `https://your-app.vercel.app/mr-IN` - Marathi version

**Expected**: All pages should load without errors

#### 2. ✅ Chat Interface
- [ ] Visit `/en-IN/chat`
- [ ] Type a symptom (e.g., "I have fever")
- [ ] Check if AI responds
- [ ] Try voice input (if available)

**Expected**: AI should respond with follow-up questions

#### 3. ✅ WhatsApp Demo
- [ ] Visit `/en-IN/whatsapp`
- [ ] Page should load with instructions

**Expected**: WhatsApp demo page loads

#### 4. ✅ ASHA Dashboard
- [ ] Visit `/en-IN/asha`
- [ ] Should show mock patient data
- [ ] Click on a patient
- [ ] Check if details panel opens

**Expected**: Dashboard with 7 mock patients

#### 5. ✅ PHC Map
- [ ] Visit `/en-IN/phc-map`
- [ ] Map should load
- [ ] Should show PHC locations

**Expected**: Interactive map with markers

#### 6. ✅ API Endpoints
Test these directly in browser:
- [ ] `/api/phc` - Should return JSON with PHC locations
- [ ] `/api/risk` - POST request (use Postman/curl)

**Expected**: JSON responses without errors

---

## 🐛 Common Issues & Fixes

### Issue 1: "404 - Page Not Found" on locale routes
**Symptom**: `/en-IN` returns 404
**Cause**: Missing middleware.ts
**Status**: ✅ FIXED (middleware.ts created)
**Action**: Redeploy if you deployed before the fix

### Issue 2: "Prisma Client initialization error"
**Symptom**: API routes fail with Prisma errors
**Cause**: Multiple Prisma instances
**Status**: ✅ FIXED (singleton pattern implemented)
**Action**: Redeploy if you deployed before the fix

### Issue 3: Database connection errors
**Symptom**: "Can't reach database server"
**Cause**: SQLite doesn't work on Vercel
**Status**: ✅ FIXED (graceful fallback to mock data)
**Action**: App should work without database

### Issue 4: Environment variables not set
**Symptom**: AI chat doesn't work, API errors
**Cause**: Missing API keys in Vercel
**Action**: 
1. Go to Vercel Dashboard → Settings → Environment Variables
2. Add all keys from your .env file
3. Redeploy

### Issue 5: Build fails
**Symptom**: Deployment fails during build
**Cause**: Missing dependencies or Prisma issues
**Action**:
1. Check Vercel build logs
2. Ensure `prisma generate` runs in build
3. Check vercel.json configuration

---

## 🔧 How to Redeploy (If Needed)

If you deployed BEFORE the fixes were applied:

### Option 1: Redeploy via Vercel Dashboard
1. Go to Vercel Dashboard
2. Click on your project
3. Go to "Deployments" tab
4. Click "..." on latest deployment
5. Click "Redeploy"

### Option 2: Redeploy via Git
```bash
# Commit the fixes
git add .
git commit -m "Applied Vercel deployment fixes"
git push origin main

# Vercel will auto-deploy
```

### Option 3: Redeploy via CLI
```bash
vercel --prod
```

---

## 📊 Check Vercel Logs

### Real-time Function Logs:
1. Go to Vercel Dashboard
2. Click your project
3. Go to "Logs" tab
4. Filter by "Functions" or "Errors"

### Build Logs:
1. Go to "Deployments" tab
2. Click on latest deployment
3. View "Build Logs"

---

## ✅ Expected Behavior (All Working)

### Pages:
- ✅ All locale routes load (`/en-IN`, `/hi-IN`, etc.)
- ✅ Chat interface works with AI responses
- ✅ WhatsApp demo page loads
- ✅ ASHA dashboard shows mock patients
- ✅ PHC map displays locations
- ✅ All navigation links work

### API Routes:
- ✅ `/api/phc` returns mock PHC data
- ✅ `/api/chat` responds with AI messages
- ✅ `/api/abha` generates ABHA IDs
- ✅ `/api/risk` calculates risk scores
- ✅ `/api/whatsapp/webhook` handles WhatsApp messages

### Performance:
- ✅ Pages load in < 2 seconds
- ✅ AI responses in < 1 second (Groq)
- ✅ No console errors
- ✅ Mobile responsive

---

## 🚨 If Something Doesn't Work

### Step 1: Check Browser Console
1. Open browser DevTools (F12)
2. Go to Console tab
3. Look for errors (red text)
4. Share error messages if you need help

### Step 2: Check Network Tab
1. Open DevTools → Network tab
2. Reload page
3. Look for failed requests (red)
4. Check status codes (404, 500, etc.)

### Step 3: Check Vercel Function Logs
1. Go to Vercel Dashboard → Logs
2. Look for errors in real-time
3. Check which API route is failing

### Step 4: Verify Environment Variables
1. Vercel Dashboard → Settings → Environment Variables
2. Ensure all keys are set:
   - GEMINI_API_KEY
   - GROQ_API_KEY
   - SARVAM_API_KEY
   - TWILIO_ACCOUNT_SID
   - TWILIO_AUTH_TOKEN
   - TWILIO_PHONE_NUMBER

---

## 📱 Mobile Testing

Test on mobile devices:
- [ ] Responsive design works
- [ ] Touch interactions work
- [ ] Voice input works (if supported)
- [ ] Maps work on mobile
- [ ] All buttons are tappable

---

## 🎯 Performance Testing

Use these tools:
- **Lighthouse**: Run in Chrome DevTools
- **PageSpeed Insights**: https://pagespeed.web.dev/
- **GTmetrix**: https://gtmetrix.com/

Expected scores:
- Performance: > 80
- Accessibility: > 90
- Best Practices: > 90
- SEO: > 90

---

## ✅ Deployment Status

If all tests pass:
- ✅ Your app is working perfectly!
- ✅ All fixes were applied successfully
- ✅ Ready for production use

If some tests fail:
- ⚠️ Check the specific issue above
- ⚠️ Redeploy if you deployed before fixes
- ⚠️ Check Vercel logs for errors

---

## 📞 Need Help?

Share these details:
1. Your Vercel deployment URL
2. Which test failed
3. Error messages from browser console
4. Error messages from Vercel logs

---

**Last Updated**: 2024
**Status**: Ready for Testing
