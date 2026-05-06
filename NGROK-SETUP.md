# 🚀 Ngrok Setup Guide for Aarogya AI IVRS

## Step 1: Get Your ngrok Authtoken

1. Go to: https://dashboard.ngrok.com/signup
2. Sign up for FREE (no credit card needed)
3. After login, go to: https://dashboard.ngrok.com/get-started/your-authtoken
4. Copy your authtoken (looks like: 2abc123def456_7ghi890jkl123mno456pqr)

## Step 2: Configure ngrok

Run this command with YOUR authtoken:
```bash
npx ngrok config add-authtoken YOUR_AUTHTOKEN_HERE
```

Example:
```bash
npx ngrok config add-authtoken 2abc123def456_7ghi890jkl123mno456pqr
```

## Step 3: Start Your App

Make sure your Next.js app is running:
```bash
npm run dev
```

## Step 4: Start ngrok

Run the PowerShell script:
```bash
.\start-ngrok.ps1
```

OR manually:
```bash
npx ngrok http 3000
```

## Step 5: Get Your IVRS URL

After ngrok starts, you'll see:
```
Forwarding   https://abc123.ngrok.io -> http://localhost:3000
```

Your IVRS endpoints will be:
- **Welcome Page**: https://abc123.ngrok.io/ivrs/welcome
- **API Webhook**: https://abc123.ngrok.io/api/ivrs/route

## Step 6: Configure Twilio (Optional)

1. Go to: https://console.twilio.com/
2. Navigate to: Phone Numbers → Manage → Active Numbers
3. Click on your number: +17542400466
4. Under "Voice Configuration":
   - A CALL COMES IN: Webhook
   - URL: `https://abc123.ngrok.io/api/ivrs/route`
   - HTTP: POST
5. Save

Now when someone calls your Twilio number, it will trigger your IVRS system! 📞

---

## Quick Commands

```bash
# Install ngrok
npm install -g ngrok

# Add authtoken
npx ngrok config add-authtoken YOUR_TOKEN

# Start ngrok
npx ngrok http 3000

# Or use the script
.\start-ngrok.ps1
```

## Troubleshooting

- **"authentication failed"**: You need to add your authtoken (Step 2)
- **"connection refused"**: Make sure your app is running on port 3000
- **ngrok URL changes**: Free ngrok URLs change on restart. Upgrade for static URLs.
