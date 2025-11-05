#!/bin/bash
# Script de démarrage pour Linux/Mac
# Usage: ./start.sh [dev|prod|build|stop|clean]

if [ $# -eq 0 ]; then
    echo "Usage: ./start.sh [dev|prod|build|stop|clean]"
    echo ""
    echo "  dev    - Démarrer en mode développement avec Mongo Express"
    echo "  prod   - Démarrer en mode production avec Nginx"
    echo "  build  - Construire les images Docker"
    echo "  stop   - Arrêter tous les services"
    echo "  clean  - Supprimer tous les conteneurs et volumes"
    echo ""
    exit 1
fi

case $1 in
    "dev")
        echo "Démarrage en mode développement..."
        docker-compose --profile development up -d
        echo ""
        echo "Services disponibles:"
        echo "- Application: http://localhost:3001"
        echo "- Mongo Express: http://localhost:8081"
        ;;
    "prod")
        echo "Démarrage en mode production..."
        docker-compose --profile production up -d
        echo ""
        echo "Services disponibles:"
        echo "- Application via Nginx: http://localhost:80"
        echo "- Application directe: http://localhost:3001"
        ;;
    "build")
        echo "Construction des images..."
        docker-compose build --no-cache
        ;;
    "stop")
        echo "Arrêt des services..."
        docker-compose down
        ;;
    "clean")
        echo "Nettoyage complet..."
        docker-compose down -v --remove-orphans
        docker system prune -f
        ;;
    *)
        echo "Commande inconnue: $1"
        echo "Usage: ./start.sh [dev|prod|build|stop|clean]"
        exit 1
        ;;
esac