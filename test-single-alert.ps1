# Script de test individuel pour les alertes Sentry
# Utilisez ce script pour tester une alerte spécifique

param(
    [Parameter(Mandatory=$true)]
    [ValidateSet("1", "2", "3", "4", "all")]
    [string]$AlertNumber
)

$baseUrl = "http://localhost:3001/api/test"

function Test-ServerStatus {
    try {
        Invoke-RestMethod -Uri "$baseUrl/health" -Method GET -TimeoutSec 5 | Out-Null
        return $true
    } catch {
        Write-Host "❌ Serveur non accessible. Demarrez le serveur avec: cd server && node app.js" -ForegroundColor Red
        return $false
    }
}

if (-not (Test-ServerStatus)) { exit 1 }

switch ($AlertNumber) {
    "1" {
        Write-Host "🚨 Test Alerte 1: Nouvelle erreur" -ForegroundColor Yellow
        try {
            Invoke-RestMethod -Uri "$baseUrl/error" -Method GET
        } catch {
            Write-Host "✅ Erreur declenchee pour test alerte 1" -ForegroundColor Green
        }
    }
    
    "2" {
        Write-Host "📊 Test Alerte 2: Taux d'erreur eleve (10 erreurs)" -ForegroundColor Yellow
        for ($i = 1; $i -le 10; $i++) {
            Write-Host "Erreur $i/10"
            try { Invoke-RestMethod -Uri "$baseUrl/error" -Method GET } catch { }
            Start-Sleep 0.5
        }
        Write-Host "✅ 10 erreurs declenchees" -ForegroundColor Green
    }
    
    "3" {
        Write-Host "⏱️ Test Alerte 3: Requête lente (3 secondes)" -ForegroundColor Yellow
        try {
            $response = Invoke-RestMethod -Uri "$baseUrl/slow" -Method GET
            Write-Host "✅ Requete lente terminee: $($response.status)" -ForegroundColor Green
        } catch {
            Write-Host "❌ Erreur: $($_.Exception.Message)" -ForegroundColor Red
        }
    }
    
    "4" {
        Write-Host "📈 Test Alerte 4: Pic de requetes lentes (5 requetes)" -ForegroundColor Yellow
        for ($i = 1; $i -le 5; $i++) {
            Write-Host "Requete lente $i/5"
            Start-Job -ScriptBlock {
                Invoke-RestMethod -Uri $using:baseUrl/slow -Method GET
            } | Out-Null
            Start-Sleep 0.2
        }
        Write-Host "✅ 5 requetes lentes demarrees" -ForegroundColor Green
    }
    
    "all" {
        Write-Host "🎯 Test de toutes les alertes..." -ForegroundColor Cyan
        & $PSScriptRoot\test-sentry-alerts.ps1
    }
}

Write-Host ""
Write-Host "📧 Verifiez vos emails dans les 1-5 prochaines minutes" -ForegroundColor Magenta