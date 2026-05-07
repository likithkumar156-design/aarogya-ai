# Verification Script - Check if all fixes are applied
# Run this to verify your codebase has all the fixes

Write-Host "🔍 Aarogya AI - Deployment Verification" -ForegroundColor Cyan
Write-Host "=======================================" -ForegroundColor Cyan
Write-Host ""

$allGood = $true

# Check 1: middleware.ts exists
Write-Host "Checking middleware.ts..." -ForegroundColor Yellow
if (Test-Path "middleware.ts") {
    Write-Host "✅ middleware.ts exists" -ForegroundColor Green
} else {
    Write-Host "❌ middleware.ts is MISSING!" -ForegroundColor Red
    Write-Host "   This is CRITICAL for Vercel deployment!" -ForegroundColor Red
    $allGood = $false
}

# Check 2: Prisma singleton exists
Write-Host "Checking Prisma singleton..." -ForegroundColor Yellow
if (Test-Path "src\lib\prisma.ts") {
    Write-Host "✅ src/lib/prisma.ts exists" -ForegroundColor Green
} else {
    Write-Host "❌ src/lib/prisma.ts is MISSING!" -ForegroundColor Red
    $allGood = $false
}

# Check 3: vercel.json exists
Write-Host "Checking vercel.json..." -ForegroundColor Yellow
if (Test-Path "vercel.json") {
    Write-Host "✅ vercel.json exists" -ForegroundColor Green
} else {
    Write-Host "⚠️  vercel.json not found (optional)" -ForegroundColor Yellow
}

# Check 4: .gitignore is clean
Write-Host "Checking .gitignore..." -ForegroundColor Yellow
$gitignoreContent = Get-Content ".gitignore" -Raw
if ($gitignoreContent -match "<<<<<<< HEAD") {
    Write-Host "❌ .gitignore has merge conflicts!" -ForegroundColor Red
    $allGood = $false
} else {
    Write-Host "✅ .gitignore is clean" -ForegroundColor Green
}

# Check 5: .env is not tracked
Write-Host "Checking if .env is tracked by Git..." -ForegroundColor Yellow
$trackedFiles = git ls-files 2>$null
if ($trackedFiles -match "\.env$") {
    Write-Host "❌ .env is tracked by Git! This is a security risk!" -ForegroundColor Red
    Write-Host "   Run: git rm --cached .env" -ForegroundColor Yellow
    $allGood = $false
} else {
    Write-Host "✅ .env is not tracked by Git" -ForegroundColor Green
}

# Check 6: node_modules exists
Write-Host "Checking dependencies..." -ForegroundColor Yellow
if (Test-Path "node_modules") {
    Write-Host "✅ Dependencies installed" -ForegroundColor Green
} else {
    Write-Host "⚠️  Dependencies not installed. Run: npm install" -ForegroundColor Yellow
}

# Check 7: Prisma client generated
Write-Host "Checking Prisma client..." -ForegroundColor Yellow
if (Test-Path "node_modules\.prisma\client") {
    Write-Host "✅ Prisma client generated" -ForegroundColor Green
} else {
    Write-Host "⚠️  Prisma client not generated. Run: npx prisma generate" -ForegroundColor Yellow
}

Write-Host ""
Write-Host "=======================================" -ForegroundColor Cyan

if ($allGood) {
    Write-Host "✅ ALL CHECKS PASSED!" -ForegroundColor Green
    Write-Host ""
    Write-Host "Your codebase has all the fixes applied." -ForegroundColor Green
    Write-Host ""
    Write-Host "Next steps:" -ForegroundColor Cyan
    Write-Host "1. If you deployed BEFORE these fixes, redeploy now" -ForegroundColor White
    Write-Host "2. Test your deployment using TESTING_GUIDE.md" -ForegroundColor White
    Write-Host "3. Verify environment variables are set in Vercel" -ForegroundColor White
    Write-Host ""
    Write-Host "To redeploy:" -ForegroundColor Yellow
    Write-Host "  Option 1: Run .\DEPLOY-VERCEL.ps1" -ForegroundColor White
    Write-Host "  Option 2: Push to Git (if connected to Vercel)" -ForegroundColor White
    Write-Host "  Option 3: Redeploy in Vercel Dashboard" -ForegroundColor White
} else {
    Write-Host "❌ SOME CHECKS FAILED!" -ForegroundColor Red
    Write-Host ""
    Write-Host "Please fix the issues above before deploying." -ForegroundColor Red
    Write-Host "The fixes should have been applied automatically." -ForegroundColor Yellow
    Write-Host "If files are missing, there may have been an error." -ForegroundColor Yellow
}

Write-Host ""
Write-Host "📋 Documentation:" -ForegroundColor Cyan
Write-Host "  - START_HERE.md - Quick start guide" -ForegroundColor White
Write-Host "  - TESTING_GUIDE.md - Test your deployment" -ForegroundColor White
Write-Host "  - DEPLOYMENT_STATUS.md - Detailed status" -ForegroundColor White
Write-Host "  - SECURITY_CHECKLIST.md - Security best practices" -ForegroundColor White
Write-Host ""
