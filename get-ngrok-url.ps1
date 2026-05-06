Write-Host "Fetching ngrok URL..." -ForegroundColor Cyan

Start-Sleep -Seconds 5

try {
    $response = Invoke-RestMethod -Uri "http://127.0.0.1:4040/api/tunnels"
    $url = $response.tunnels[0].public_url
    
    if ($url) {
        Write-Host ""
        Write-Host "========================================" -ForegroundColor Green
        Write-Host "   NGROK TUNNEL ACTIVE" -ForegroundColor Green
        Write-Host "========================================" -ForegroundColor Green
        Write-Host ""
        Write-Host "Base URL: $url" -ForegroundColor Yellow
        Write-Host ""
        Write-Host "IVRS Endpoints:" -ForegroundColor Cyan
        Write-Host "   Welcome: $url/ivrs/welcome" -ForegroundColor White
        Write-Host "   API:     $url/api/ivrs/route" -ForegroundColor White
        Write-Host ""
        Write-Host "WhatsApp: $url/api/whatsapp/webhook" -ForegroundColor Magenta
        Write-Host ""
        
        # Save to file
        $content = @"
========================================
   AAROGYA AI - NGROK TUNNEL ACTIVE
========================================

Base URL: $url

IVRS Endpoints:
   Welcome: $url/ivrs/welcome
   API:     $url/api/ivrs/route

WhatsApp: $url/api/whatsapp/webhook

Started: $(Get-Date)

========================================
"@
        
        $content | Out-File -FilePath "CURRENT_NGROK_URL.txt" -Encoding UTF8
        Write-Host "Saved to: CURRENT_NGROK_URL.txt" -ForegroundColor Green
        Write-Host ""
    }
} catch {
    Write-Host "Could not fetch ngrok URL. Make sure ngrok is running." -ForegroundColor Red
    Write-Host "Check the ngrok window or run: npx ngrok http 3000" -ForegroundColor Yellow
}
