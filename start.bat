@echo off
REM Script de démarrage pour Windows
REM Usage: start.bat [dev|prod|build|stop|clean]

if "%1"=="" (
    echo Usage: start.bat [dev^|prod^|build^|stop^|clean]
    echo.
    echo   dev    - Démarrer en mode développement avec Mongo Express
    echo   prod   - Démarrer en mode production avec Nginx
    echo   build  - Construire les images Docker
    echo   stop   - Arrêter tous les services
    echo   clean  - Supprimer tous les conteneurs et volumes
    echo.
    goto :eof
)

if "%1"=="dev" (
    echo Démarrage en mode développement...
    docker-compose --profile development up -d
    echo.
    echo Services disponibles:
    echo - Application: http://localhost:3001
    echo - Mongo Express: http://localhost:8081
    goto :eof
)

if "%1"=="prod" (
    echo Démarrage en mode production...
    docker-compose --profile production up -d
    echo.
    echo Services disponibles:
    echo - Application via Nginx: http://localhost:80
    echo - Application directe: http://localhost:3001
    goto :eof
)

if "%1"=="build" (
    echo Construction des images...
    docker-compose build --no-cache
    goto :eof
)

if "%1"=="stop" (
    echo Arrêt des services...
    docker-compose down
    goto :eof
)

if "%1"=="clean" (
    echo Nettoyage complet...
    docker-compose down -v --remove-orphans
    docker system prune -f
    goto :eof
)

echo Commande inconnue: %1
echo Usage: start.bat [dev^|prod^|build^|stop^|clean]