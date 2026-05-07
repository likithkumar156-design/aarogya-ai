# Vercel Deployment Script for Aarogya AI
# Run this script to deploy to Vercel

Write-Host "🚀 Aarogya AI - Vercel Deployment Script" -ForegroundColor Cyan
Write-Host "=========================================" -ForegroundColor Cyan
Write-Host ""

# Check if Vercel CLI is installed
Write-Host "Checking Vercel CLI..." -ForegroundColor Yellow
$vercelInstalled = Get-Command vercel -ErrorAction SilentlyContinue

if (-not $vercelInstalled) {
    Write-Host "❌ Vercel CLI not found!" -ForegroundColor Red
    Write-Host "Installing Vercel CLI..." -ForegroundColor Yellow
    npm install -g vercel
    Write-Host "✅ Vercel CLI installed!" -ForegroundColor Green
} else {
    Write-Host "✅ Vercel CLI found!" -ForegroundColor Green
}

Write-Host ""

# Check if .env exists
if (Test-Path ".env") {
    Write-Host "⚠️  WARNING: .env file found!" -ForegroundColor Yellow
    Write-Host "Make sure your API keys are set in Vercel Dashboard!" -ForegroundColor Yellow
    Write-Host "Go to: Vercel Dashboard → Settings → Environment Variables" -ForegroundColor Yellow
    Write-Host ""
    
    $continue = Read-Host "Have you set all environment variables in Vercel? (y/n)"
    if ($continue -ne "y") {
        Write-Host "❌ Deployment cancelled. Please set environment variables first." -ForegroundColor Red
        Write-Host "See SECURITY_CHECKLIST.md for details." -ForegroundColor Yellow
        exit
    }
}

Write-Host ""
Write-Host "Running pre-deployment checks..." -ForegroundColor Yellow

# Check if node_modules exists
if (-not (Test-Path "node_modules")) {
    Write-Host "Installing dependencies..." -ForegroundColor Yellow
    npm install
}

# Generate Prisma Client
Write-Host "Generating Prisma Client..." -ForegroundColor Yellow
npx prisma generate

Write-Host "✅ Pre-deployment checks complete!" -ForegroundColor Green
Write-Host ""

# Ask for deployment type
Write-Host "Select deployment type:" -ForegroundColor Cyan
Write-Host "1. Production (recommended)" -ForegroundColor White
Write-Host "2. Preview" -ForegroundColor White
$deployType = Read-Host "Enter choice (1 or 2)"

Write-Host ""
Write-Host "🚀 Starting deployment..." -ForegroundColor Cyan

if ($deployType -eq "1") {
    Write-Host "Deploying to PRODUCTION..." -ForegroundColor Yellow
    vercel --prod
} else {
    Write-Host "Deploying to PREVIEW..." -ForegroundColor Yellow
    vercel
}

Write-Host ""
Write-Host "✅ Deployment complete!" -ForegroundColor Green
Write-Host ""
Write-Host "📋 Post-Deployment Checklist:" -ForegroundColor Cyan
Write-Host "1. Test landing page: /en-IN" -ForegroundColor White
Write-Host "2. Test chat interface: /en-IN/chat" -ForegroundColor White
Write-Host "3. Test WhatsApp demo: /en-IN/whatsapp" -ForegroundColor White
Write-Host "4. Test ASHA dashboard: /en-IN/asha" -ForegroundColor White
Write-Host "5. Test API endpoint: /api/phc" -ForegroundColor White
Write-Host "6. Check browser console for errors" -ForegroundColor White
Write-Host "7. Test on mobile device" -ForegroundColor White
Write-Host ""
Write-Host "🎉 Happy deploying!" -ForegroundColor Green
