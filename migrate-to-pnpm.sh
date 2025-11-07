#!/bin/bash

# Script pour migrer de npm vers pnpm dans la CI/CD
# Usage: ./migrate-to-pnpm.sh

echo "🔄 Migration de npm vers pnpm..."

# Supprimer les anciens fichiers de verrouillage npm s'ils existent
if [ -f "package-lock.json" ]; then
    echo "🗑️  Suppression de package-lock.json..."
    rm package-lock.json
fi

if [ -f "client/package-lock.json" ]; then
    echo "🗑️  Suppression de client/package-lock.json..."
    rm client/package-lock.json
fi

if [ -f "server/package-lock.json" ]; then
    echo "🗑️  Suppression de server/package-lock.json..."
    rm server/package-lock.json
fi

# Supprimer node_modules pour une installation propre
echo "🧹 Nettoyage des node_modules..."
rm -rf node_modules client/node_modules server/node_modules

# Installer pnpm si pas déjà installé
if ! command -v pnpm &> /dev/null; then
    echo "📦 Installation de pnpm..."
    npm install -g pnpm
fi

# Installer les dépendances avec pnpm
echo "📦 Installation des dépendances avec pnpm..."
pnpm install

echo "✅ Migration terminée !"
echo "Les fichiers pnpm-lock.yaml ont été générés."
echo "Vous pouvez maintenant utiliser 'pnpm' au lieu de 'npm' dans vos commandes."