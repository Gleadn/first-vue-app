# Script de test automatisé pour les alertes Sentry
# Ce script teste toutes les alertes configurées

Write-Host "🚨 === TEST AUTOMATISÉ DES ALERTES SENTRY ===" -ForegroundColor Cyan
Write-Host ""

$baseUrl = "http://localhost:3001/api/test"

function Test-ServerStatus {
    try {
        $response = Invoke-RestMethod -Uri "$baseUrl/health" -Method GET -TimeoutSec 5
        Write-Host "✅ Serveur opérationnel" -ForegroundColor Green
        return $true
    } catch {
        Write-Host "❌ Serveur non accessible: $($_.Exception.Message)" -ForegroundColor Red
        return $false
    }
}

function Send-TestMessage {
    param([string]$message)
    try {
        $headers = @{ "Content-Type" = "application/json" }
        $body = @{ message = $message } | ConvertTo-Json
        $response = Invoke-RestMethod -Uri "$baseUrl/message" -Method POST -Headers $headers -Body $body -TimeoutSec 10
        Write-Host "📤 Message envoyé: $message" -ForegroundColor Gray
    } catch {
        Write-Host "⚠️ Erreur envoi message: $($_.Exception.Message)" -ForegroundColor Yellow
    }
}

# Vérification du serveur
if (-not (Test-ServerStatus)) {
    Write-Host "🛑 Le serveur backend doit être démarré avant de lancer les tests." -ForegroundColor Red
    Write-Host "💡 Démarrez le serveur avec: cd server && node app.js" -ForegroundColor Yellow
    exit 1
}

Write-Host ""
Write-Host "🎯 === TEST ALERTE 1: NOUVELLES ERREURS ===" -ForegroundColor Yellow
Write-Host "Déclenchement d'une erreur unique pour tester la détection de nouvelles erreurs..."

Send-TestMessage "🧪 Test Alerte 1: Nouvelle erreur unique - $(Get-Date)"

try {
    Invoke-RestMethod -Uri "$baseUrl/error" -Method GET -TimeoutSec 10
} catch {
    Write-Host "✅ Erreur déclenchée (attendu): $($_.Exception.Message)" -ForegroundColor Green
}

Write-Host "⏳ Attente 10 secondes avant le test suivant..." -ForegroundColor Gray
Start-Sleep 10

Write-Host ""
Write-Host "📊 === TEST ALERTE 2: TAUX D'ERREUR ÉLEVÉ ===" -ForegroundColor Yellow
Write-Host "Déclenchement de 12 erreurs rapidement pour dépasser le seuil de 5%..."

Send-TestMessage "🧪 Test Alerte 2: Début du bombardement d'erreurs - $(Get-Date)"

for ($i = 1; $i -le 12; $i++) {
    Write-Host "Erreur $i/12..." -ForegroundColor DarkYellow
    try {
        Invoke-RestMethod -Uri "$baseUrl/error" -Method GET -TimeoutSec 5
    } catch {
        # Erreur attendue
    }
    Start-Sleep 0.5  # Petite pause entre les requêtes
}

Write-Host "✅ 12 erreurs déclenchées en série" -ForegroundColor Green
Write-Host "⏳ Attente 15 secondes avant le test suivant..." -ForegroundColor Gray
Start-Sleep 15

Write-Host ""
Write-Host "⏱️ === TEST ALERTE 3 & 4: REQUÊTES LENTES ===" -ForegroundColor Yellow
Write-Host "Déclenchement de 8 requêtes lentes (3 secondes chacune) pour tester les seuils de performance..."

Send-TestMessage "🧪 Test Alerte 3&4: Début des requêtes lentes - $(Get-Date)"

# Lancer plusieurs requêtes lentes en parallèle pour maximiser l'impact
$jobs = @()
for ($i = 1; $i -le 8; $i++) {
    Write-Host "Démarrage requête lente $i/8..." -ForegroundColor DarkYellow
    
    $job = Start-Job -ScriptBlock {
        param($url, $index)
        try {
            $response = Invoke-RestMethod -Uri $url -Method GET -TimeoutSec 10
            return "Requête $index terminée: $($response.status)"
        } catch {
            return "Requête $index échouée: $($_.Exception.Message)"
        }
    } -ArgumentList "$baseUrl/slow", $i
    
    $jobs += $job
    Start-Sleep 0.3  # Décalage léger entre les requêtes
}

Write-Host "⏳ Attente de la fin des requêtes lentes (max 15 secondes)..." -ForegroundColor Gray
$jobs | Wait-Job -Timeout 15 | ForEach-Object {
    $result = Receive-Job $_
    Write-Host "📝 $result" -ForegroundColor Gray
    Remove-Job $_
}

# Nettoyer les jobs restants
$jobs | Remove-Job -Force

Write-Host "✅ Tests de requêtes lentes terminés" -ForegroundColor Green

Write-Host ""
Write-Host "🎉 === TESTS TERMINÉS ===" -ForegroundColor Cyan
Write-Host ""
Write-Host "📧 Vérifications à effectuer:" -ForegroundColor White
Write-Host "1. Alerte 1: Vérifiez votre email pour les nouvelles erreurs détectées" -ForegroundColor Gray
Write-Host "2. Alerte 2: Vérifiez votre email pour l'alerte de taux d'erreur élevé (>5%)" -ForegroundColor Gray
Write-Host "3. Alerte 3: Vérifiez votre email pour les requêtes lentes (>2000ms)" -ForegroundColor Gray
Write-Host "4. Alerte 4: Vérifiez votre email pour le pic de requêtes lentes (>10%)" -ForegroundColor Gray
Write-Host ""
Write-Host "🔍 Dashboard Sentry: https://sentry.io/" -ForegroundColor Magenta
Write-Host "💡 Les alertes peuvent prendre 1-5 minutes pour arriver par email" -ForegroundColor Yellow

# Message final avec statistiques
Send-TestMessage "🎯 Tests d'alertes terminés - 1 erreur unique + 12 erreurs série + 8 requêtes lentes - $(Get-Date)"

Write-Host ""
Write-Host "✨ Script de test terminé avec succès!" -ForegroundColor Green