$ErrorActionPreference = "SilentlyContinue"

Write-Host ""
Write-Host "======================================" -ForegroundColor Cyan
Write-Host "   AAROGYA AI - DEMO STARTER" -ForegroundColor Cyan
Write-Host "======================================" -ForegroundColor Cyan
Write-Host ""

# Step 1: Kill any old servers
Write-Host "[1/4] Stopping old servers..." -ForegroundColor Yellow
taskkill /F /IM node.exe 2>$null | Out-Null
Start-Sleep 1

# Step 2: Start Next.js production server in background
Write-Host "[2/4] Starting production server..." -ForegroundColor Yellow
$serverJob = Start-Process -FilePath "cmd" -ArgumentList "/c npm run start" -WorkingDirectory $PSScriptRoot -PassThru -WindowStyle Minimized
Start-Sleep 3
Write-Host "      Server running at http://localhost:3000" -ForegroundColor Green

# Step 3: Start Cloudflare tunnel and capture URL
Write-Host "[3/4] Starting Cloudflare tunnel..." -ForegroundColor Yellow
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

$webhookUrl = "$tunnelUrl/api/whatsapp/webhook"
Write-Host "      Tunnel URL: $tunnelUrl" -ForegroundColor Green

# Step 4: Update Twilio webhook automatically
Write-Host "[4/4] Updating Twilio webhook..." -ForegroundColor Yellow

# Parse .env file for secrets
$envFile = "$PSScriptRoot\.env"
$sid = ""
$token = ""
if (Test-Path $envFile) {
    $envContent = Get-Content $envFile
    foreach ($line in $envContent) {
        if ($line -match "^TWILIO_ACCOUNT_SID=`"(.+)`"") { $sid = $matches[1] }
        elseif ($line -match "^TWILIO_AUTH_TOKEN=`"(.+)`"") { $token = $matches[1] }
        elseif ($line -match "^TWILIO_ACCOUNT_SID=(.+)") { $sid = $matches[1] }
        elseif ($line -match "^TWILIO_AUTH_TOKEN=(.+)") { $token = $matches[1] }
    }
}

if ($sid -eq "" -or $token -eq "") {
    Write-Host "      WARNING: Could not find TWILIO_ACCOUNT_SID or AUTH_TOKEN in .env" -ForegroundColor Yellow
} else {
    $base64 = [Convert]::ToBase64String([Text.Encoding]::ASCII.GetBytes("${sid}:${token}"))
    $headers = @{ Authorization = "Basic $base64" }

# Verify Twilio auth works
try {
    Invoke-RestMethod -Uri "https://api.twilio.com/2010-04-01/Accounts/$sid/Messages.json" -Headers $headers -Method Get | Out-Null
    Write-Host "      Twilio auth: OK" -ForegroundColor Green
} catch {
    Write-Host "      Twilio auth failed. Check SID/token in script." -ForegroundColor Red
}
}

Write-Host ""
Write-Host "======================================" -ForegroundColor Cyan
Write-Host "   DEMO IS READY!" -ForegroundColor Green
Write-Host "======================================" -ForegroundColor Cyan
Write-Host ""
Write-Host "  Web App:  http://localhost:3000" -ForegroundColor White
Write-Host "  Tunnel:   $tunnelUrl" -ForegroundColor White
Write-Host ""
Write-Host "  ACTION REQUIRED:" -ForegroundColor Red
Write-Host "  Go to Twilio Sandbox Settings and paste:" -ForegroundColor Yellow
Write-Host "  $webhookUrl" -ForegroundColor Cyan
Write-Host ""
Write-Host "  Then text 'hi' to +1 415 523 8886 on WhatsApp" -ForegroundColor White
Write-Host ""

# Copy webhook URL to clipboard
$webhookUrl | Set-Clipboard
Write-Host "  (Webhook URL copied to clipboard!)" -ForegroundColor Green
Write-Host ""

# Open Twilio sandbox settings automatically
Start-Process "https://console.twilio.com/us1/develop/sms/try-it-out/whatsapp-learn"

Write-Host "Press any key to exit..."
$null = $Host.UI.RawUI.ReadKey("NoEcho,IncludeKeyDown")
