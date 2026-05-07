# 🔧 WhatsApp/Twilio Setup & Troubleshooting

## Current Status Check

Visit this URL to check if webhook is working:
**https://demo-aragoya-ai.vercel.app/api/whatsapp/test**

Expected response:
```json
{
  "status": "ok",
  "message": "WhatsApp webhook is reachable",
  "env": {
    "twilioConfigured": true/false,
    "groqConfigured": true/false,
    "geminiConfigured": true/false
  }
}
```

---

## ⚠️ Common Issues & Fixes

### Issue 1: Environment Variables Not Set in Vercel

**Check**: Visit test URL above. If `twilioConfigured: false`, then:

**Fix**:
1. Go to https://vercel.com/dashboard
2. Click your project: `demo-aragoya-ai`
3. Go to Settings → Environment Variables
4. Add these:
   ```
   TWILIO_ACCOUNT_SID=your_account_sid_here
   TWILIO_AUTH_TOKEN=your_auth_token_here
   TWILIO_PHONE_NUMBER=whatsapp:+14155238886
   ```
5. Redeploy

---

### Issue 2: Twilio Webhook URL Not Configured

**Fix**:
1. Go to https://console.twilio.com
2. Navigate to: Messaging → Try it out → Send a WhatsApp message
3. Find "Sandbox Settings"
4. Set webhook URL to:
   ```
   https://demo-aragoya-ai.vercel.app/api/whatsapp/webhook
   ```
5. Method: POST
6. Save

---

### Issue 3: Not Joined Twilio Sandbox

**Fix**:
1. Go to Twilio Console → Messaging → Try WhatsApp
2. You'll see a message like: "Send 'join <code>' to +1 415 523 8886"
3. Open WhatsApp on your phone
4. Send that exact message to the Twilio number
5. Wait for confirmation
6. Now try sending: "I have fever"

---

### Issue 4: Twilio Credentials Wrong

**Check**: Your credentials should be:
```
TWILIO_ACCOUNT_SID=AC... (starts with AC)
TWILIO_AUTH_TOKEN=32_character_token
```

**Note**: API Key SID format starts with `SK...`, but you need Account SID starting with `AC...`

**Correct Format**:
- Account SID starts with: `AC...`
- Auth Token: 32 characters
- API Key SID starts with: `SK...`

**Fix**:
1. Go to https://console.twilio.com
2. Click "Account Info" in dashboard
3. Copy the correct **Account SID** (starts with AC)
4. Copy the correct **Auth Token**
5. Update in Vercel environment variables

---

## 🧪 Testing Steps

### Step 1: Test Webhook Endpoint
```bash
curl https://demo-aragoya-ai.vercel.app/api/whatsapp/test
```

Should return JSON with status "ok"

### Step 2: Test POST to Webhook
```bash
curl -X POST https://demo-aragoya-ai.vercel.app/api/whatsapp/webhook \
  -d "Body=hello&From=whatsapp:+1234567890"
```

Should return TwiML XML response

### Step 3: Test via WhatsApp
1. Join Twilio sandbox (see Issue 3 above)
2. Send message: "I have fever"
3. Should get response from Aarogya AI

---

## 🔍 Debugging

### Check Vercel Logs
1. Go to Vercel Dashboard
2. Click your project
3. Go to "Logs" tab
4. Filter by "Functions"
5. Send a WhatsApp message
6. Check if webhook is being called

### Check Twilio Logs
1. Go to Twilio Console
2. Monitor → Logs → Messaging
3. Look for recent webhook calls
4. Check for errors

---

## ✅ Correct Setup Checklist

- [ ] Twilio Account SID (starts with AC) set in Vercel
- [ ] Twilio Auth Token set in Vercel
- [ ] Twilio Phone Number set in Vercel
- [ ] Webhook URL configured in Twilio: `https://demo-aragoya-ai.vercel.app/api/whatsapp/webhook`
- [ ] Joined Twilio sandbox via WhatsApp
- [ ] Test endpoint returns `twilioConfigured: true`
- [ ] Can send/receive messages

---

## 📝 Quick Fix Script

If environment variables are missing:

1. **Get Correct Credentials**:
   - Go to https://console.twilio.com
   - Copy Account SID (AC...)
   - Copy Auth Token
   - Copy WhatsApp number

2. **Set in Vercel**:
   - Dashboard → Project → Settings → Environment Variables
   - Add all three variables
   - Redeploy

3. **Configure Webhook**:
   - Twilio Console → Messaging → WhatsApp Sandbox
   - Set webhook URL
   - Save

4. **Test**:
   - Join sandbox
   - Send "hello"
   - Should get response

---

## 🚨 Most Likely Issue

Based on your credentials, the issue is:

**You're using API Key SID (`SK...`) instead of Account SID (`AC...`)**

**Fix**:
1. Go to Twilio Console
2. Get the correct Account SID (starts with `AC`)
3. Update in Vercel environment variables
4. Redeploy

---

**Test URL**: https://demo-aragoya-ai.vercel.app/api/whatsapp/test
**Webhook URL**: https://demo-aragoya-ai.vercel.app/api/whatsapp/webhook
