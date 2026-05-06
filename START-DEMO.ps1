$ErrorActionPreference = "SilentlyContinue"

Write-Host ""
Write-Host "======================================" -ForegroundColor Cyan
Write-Host "   AAROGYA AI - DEMO STARTER" -ForegroundColor Cyan
Write-Host "======================================" -ForegroundColor Cyan
Write-Host ""

# Step 1: Kill any old servers
Write-Host "[1/5] Stopping old servers..." -ForegroundColor Yellow
taskkill /F /IM node.exe 2>$null | Out-Null
Start-Sleep 1

# Step 2: Start Next.js production server in background
Write-Host "[2/5] Starting production server..." -ForegroundColor Yellow
$serverJob = Start-Process -FilePath "cmd" -ArgumentList "/c npm run start" -WorkingDirectory $PSScriptRoot -PassThru -WindowStyle Minimized
Start-Sleep 3
Write-Host "      Server running at http://localhost:3000" -ForegroundColor Green

# Step 3: Start Cloudflare tunnel and capture URL
Write-Host "[3/5] Starting Cloudflare tunnel..." -ForegroundColor Yellow
$logFile = "$env:TEMP\cf-tunnel.log"
if (Test-Path $logFile) { Remove-Item $logFile -Force }

Start-Process -FilePath "C:\Program Files (x86)\cloudflared\cloudflared.exe" `
  -ArgumentList "tunnel --url http://localhost:3000 --logfile `"$logFile`"" `
  -WindowStyle Hidden

# Wait for tunnel URL to appear
$tunnelUrl = ""
$attempts = 0
while ($tunnelUrl -eq "" -and $attempts -lt 20) {
    Start-Sleep 2
    $attempts++
    if (Test-Path $logFile) {
        $content = Get-Content $logFile -Raw
        $match = [regex]::Match($content, 'https://[a-z0-9\-]+\.trycloudflare\.com')
        if ($match.Success) {
            $tunnelUrl = $match.Value
        }
    }
}

if ($tunnelUrl -eq "") {
    Write-Host "      ERROR: Could not get tunnel URL. Check cloudflared." -ForegroundColor Red
    exit 1
}

$whatsappWebhookUrl = "$tunnelUrl/api/whatsapp/webhook"
$ivrsWebhookUrl     = "$tunnelUrl/api/ivrs"
Write-Host "      Tunnel URL: $tunnelUrl" -ForegroundColor Green

# ── Step 4: Write BASE_URL into .env so IVRS route builds correct absolute URLs ──
Write-Host "[4/5] Updating .env with tunnel URL..." -ForegroundColor Yellow
$envFile = "$PSScriptRoot\.env"
if (Test-Path $envFile) {
    $envContent = Get-Content $envFile -Raw
    # Replace or append BASE_URL
    if ($envContent -match "BASE_URL=.*") {
        $envContent = $envContent -replace "BASE_URL=.*", "BASE_URL=$tunnelUrl"
    } else {
        $envContent = $envContent.TrimEnd() + "`nBASE_URL=$tunnelUrl`n"
    }
    Set-Content $envFile -Value $envContent -NoNewline
    Write-Host "      BASE_URL set to: $tunnelUrl" -ForegroundColor Green
}

# Parse .env file for Twilio secrets
$sid = ""
$token = ""
$phoneNumber = ""
if (Test-Path $envFile) {
    $envLines = Get-Content $envFile
    foreach ($line in $envLines) {
        if ($line -match "^TWILIO_ACCOUNT_SID=`"(.+)`"")  { $sid         = $matches[1] }
        elseif ($line -match "^TWILIO_AUTH_TOKEN=`"(.+)`"")  { $token       = $matches[1] }
        elseif ($line -match "^TWILIO_PHONE_NUMBER=`"(.+)`"") { $phoneNumber = $matches[1] }
        elseif ($line -match "^TWILIO_ACCOUNT_SID=(.+)")      { $sid         = $matches[1] }
        elseif ($line -match "^TWILIO_AUTH_TOKEN=(.+)")        { $token       = $matches[1] }
        elseif ($line -match "^TWILIO_PHONE_NUMBER=(.+)")      { $phoneNumber = $matches[1] }
    }
}

# ── Step 5: Update Twilio webhooks ──────────────────────────────────────────
Write-Host "[5/5] Configuring Twilio webhooks..." -ForegroundColor Yellow

if ($sid -eq "" -or $token -eq "") {
    Write-Host "      WARNING: Could not find TWILIO credentials in .env" -ForegroundColor Yellow
} else {
    $base64  = [Convert]::ToBase64String([Text.Encoding]::ASCII.GetBytes("${sid}:${token}"))
    $headers = @{ Authorization = "Basic $base64" }

    # ── Verify Twilio auth ──────────────────────────────────────────────
    try {
        Invoke-RestMethod -Uri "https://api.twilio.com/2010-04-01/Accounts/$sid.json" `
            -Headers $headers -Method Get | Out-Null
        Write-Host "      Twilio auth: OK" -ForegroundColor Green
    } catch {
        Write-Host "      Twilio auth FAILED - check SID/token in .env" -ForegroundColor Red
    }

    # ── Update Voice webhook (IVRS) on the phone number ────────────────
    if ($phoneNumber -ne "") {
        # Strip + from phone number for the API query
        $e164 = $phoneNumber.TrimStart("+").Trim()
        try {
            # Find the IncomingPhoneNumber SID for this number
            $numbersResp = Invoke-RestMethod `
                -Uri "https://api.twilio.com/2010-04-01/Accounts/$sid/IncomingPhoneNumbers.json?PhoneNumber=%2B$e164" `
                -Headers $headers -Method Get
            $phoneSid = $numbersResp.incoming_phone_numbers[0].sid

            if ($phoneSid) {
                # Update Voice URL to point to our IVRS endpoint
                $body = "VoiceUrl=$ivrsWebhookUrl&VoiceMethod=POST"
                Invoke-RestMethod `
                    -Uri "https://api.twilio.com/2010-04-01/Accounts/$sid/IncomingPhoneNumbers/$phoneSid.json" `
                    -Headers $headers -Method Post -Body $body | Out-Null
                Write-Host "      Voice (IVRS) webhook set: $ivrsWebhookUrl" -ForegroundColor Green
            } else {
                Write-Host "      WARNING: Phone number $phoneNumber not found in Twilio account." -ForegroundColor Yellow
                Write-Host "      Set Voice URL manually to: $ivrsWebhookUrl" -ForegroundColor Cyan
            }
        } catch {
            Write-Host "      Could not auto-set Voice webhook. Set manually:" -ForegroundColor Yellow
            Write-Host "      $ivrsWebhookUrl" -ForegroundColor Cyan
        }
    } else {
        Write-Host "      No TWILIO_PHONE_NUMBER in .env — set Voice URL manually:" -ForegroundColor Yellow
        Write-Host "      $ivrsWebhookUrl" -ForegroundColor Cyan
    }

    # ── WhatsApp sandbox webhook ─────────────────────────────────────────
    Write-Host "      WhatsApp webhook URL: $whatsappWebhookUrl" -ForegroundColor Cyan
    Write-Host "      (Set this in Twilio Sandbox → When a message comes in)" -ForegroundColor Gray
}

Write-Host ""
Write-Host "======================================" -ForegroundColor Cyan
Write-Host "   DEMO IS READY!" -ForegroundColor Green
Write-Host "======================================" -ForegroundColor Cyan
Write-Host ""
Write-Host "  Web App:          http://localhost:3000" -ForegroundColor White
Write-Host "  Tunnel:           $tunnelUrl" -ForegroundColor White
Write-Host ""
Write-Host "  IVRS Voice URL:   $ivrsWebhookUrl" -ForegroundColor Green
Write-Host "  WhatsApp Webhook: $whatsappWebhookUrl" -ForegroundColor Green
Write-Host ""
Write-Host "  Call $phoneNumber to test IVRS!" -ForegroundColor Yellow
Write-Host "  Text 'hi' to +1 415 523 8886 on WhatsApp to test chatbot." -ForegroundColor White
Write-Host ""

# Copy IVRS webhook URL to clipboard
$ivrsWebhookUrl | Set-Clipboard
Write-Host "  (IVRS Voice URL copied to clipboard!)" -ForegroundColor Green
Write-Host ""

# Open Twilio Console
Start-Process "https://console.twilio.com/us1/develop/voice/manage/incoming-numbers"

Write-Host "Press any key to exit..."
$null = $Host.UI.RawUI.ReadKey("NoEcho,IncludeKeyDown")
