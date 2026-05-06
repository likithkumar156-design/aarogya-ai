Write-Host "========================================" -ForegroundColor Cyan
Write-Host "  Aarogya AI - ngrok IVRS Setup" -ForegroundColor Green
Write-Host "========================================" -ForegroundColor Cyan
Write-Host ""

# Check if ngrok is installed
$ngrokInstalled = Get-Command ngrok -ErrorAction SilentlyContinue

if (-not $ngrokInstalled) {
    Write-Host "ngrok is not installed!" -ForegroundColor Red
    Write-Host ""
    Write-Host "Installing ngrok globally..." -ForegroundColor Yellow
    npm install -g ngrok
    Write-Host ""
}

Write-Host "ngrok is ready!" -ForegroundColor Green
Write-Host ""
Write-Host "Make sure your Next.js app is running:" -ForegroundColor Yellow
Write-Host "   Run in another terminal: npm run dev" -ForegroundColor White
Write-Host ""
Write-Host "Starting ngrok tunnel on port 3000..." -ForegroundColor Cyan
Write-Host ""
Write-Host "Once ngrok starts, your IVRS endpoints will be:" -ForegroundColor Magenta
Write-Host "   https://YOUR-URL.ngrok.io/ivrs/welcome" -ForegroundColor White
Write-Host "   https://YOUR-URL.ngrok.io/api/ivrs/route" -ForegroundColor White
Write-Host ""
Write-Host "Press Ctrl+C to stop ngrok" -ForegroundColor Yellow
Write-Host ""

ngrok http 3000
