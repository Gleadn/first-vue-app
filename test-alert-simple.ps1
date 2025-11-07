# Script de test simple pour les alertes Sentry
param([string]$AlertNumber = "1")

$baseUrl = "http://localhost:3001/api/test"

Write-Host "Test Alerte $AlertNumber" -ForegroundColor Yellow

try {
    $health = Invoke-RestMethod -Uri "$baseUrl/health" -Method GET -TimeoutSec 5
    Write-Host "Serveur OK" -ForegroundColor Green
} catch {
    Write-Host "Serveur non accessible" -ForegroundColor Red
    exit 1
}

switch ($AlertNumber) {
    "1" {
        Write-Host "Test: Nouvelle erreur"
        try {
            Invoke-RestMethod -Uri "$baseUrl/error" -Method GET
        } catch {
            Write-Host "Erreur declenchee avec succes" -ForegroundColor Green
        }
    }
    "2" {
        Write-Host "Test: Taux d'erreur eleve (10 erreurs)"
        for ($i = 1; $i -le 10; $i++) {
            Write-Host "Erreur $i/10"
            try { 
                Invoke-RestMethod -Uri "$baseUrl/error" -Method GET 
            } catch { 
                # Erreur attendue
            }
            Start-Sleep 0.5
        }
        Write-Host "10 erreurs declenchees" -ForegroundColor Green
    }
    "3" {
        Write-Host "Test: Requete lente"
        try {
            $response = Invoke-RestMethod -Uri "$baseUrl/slow" -Method GET
            Write-Host "Requete lente terminee: $($response.status)" -ForegroundColor Green
        } catch {
            Write-Host "Erreur: $($_.Exception.Message)" -ForegroundColor Red
        }
    }
}

Write-Host ""
Write-Host "Verifiez vos emails dans les 1-5 prochaines minutes" -ForegroundColor Magenta