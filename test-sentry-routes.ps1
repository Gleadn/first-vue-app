# Script de test pour les routes API Sentry
# Utilisez ce script pour tester toutes les routes créées

Write-Host "=== Test des routes API Sentry ===" -ForegroundColor Cyan
Write-Host ""

# Test 1: Route Health
Write-Host "1. Test de la route health..." -ForegroundColor Yellow
try {
    $response = Invoke-RestMethod -Uri "http://localhost:3001/api/test/health" -Method GET
    Write-Host "✅ Succès:" -ForegroundColor Green
    $response | ConvertTo-Json
} catch {
    Write-Host "❌ Erreur: $($_.Exception.Message)" -ForegroundColor Red
}
Write-Host ""

# Test 2: Route Error
Write-Host "2. Test de la route error..." -ForegroundColor Yellow
try {
    $response = Invoke-RestMethod -Uri "http://localhost:3001/api/test/error" -Method GET
    Write-Host "✅ Succès:" -ForegroundColor Green
    $response | ConvertTo-Json
} catch {
    Write-Host "⚠️ Erreur attendue (capturée par Sentry): $($_.Exception.Message)" -ForegroundColor Orange
}
Write-Host ""

# Test 3: Route Slow
Write-Host "3. Test de la route slow (3 secondes)..." -ForegroundColor Yellow
try {
    $response = Invoke-RestMethod -Uri "http://localhost:3001/api/test/slow" -Method GET
    Write-Host "✅ Succès:" -ForegroundColor Green
    $response | ConvertTo-Json
} catch {
    Write-Host "❌ Erreur: $($_.Exception.Message)" -ForegroundColor Red
}
Write-Host ""

# Test 4: Route Message
Write-Host "4. Test de la route message..." -ForegroundColor Yellow
try {
    $headers = @{ "Content-Type" = "application/json" }
    $body = @{ message = "Test message depuis PowerShell - $(Get-Date)" } | ConvertTo-Json
    $response = Invoke-RestMethod -Uri "http://localhost:3001/api/test/message" -Method POST -Headers $headers -Body $body
    Write-Host "✅ Succès:" -ForegroundColor Green
    $response | ConvertTo-Json
} catch {
    Write-Host "❌ Erreur: $($_.Exception.Message)" -ForegroundColor Red
}

Write-Host ""
Write-Host "=== Tests terminés ===" -ForegroundColor Cyan
Write-Host "Vérifiez votre dashboard Sentry pour voir les erreurs et messages capturés !" -ForegroundColor Magenta