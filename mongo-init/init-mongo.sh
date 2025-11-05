#!/bin/bash

# Script d'initialisation MongoDB pour Docker
# Ce script sera exécuté au premier démarrage de MongoDB

echo "Initialisation de la base de données MongoDB..."

# Créer l'utilisateur et la base de données pour l'application
mongosh <<EOF
use admin
db.auth('$MONGO_INITDB_ROOT_USERNAME', '$MONGO_INITDB_ROOT_PASSWORD')

use $MONGO_INITDB_DATABASE
db.createUser({
  user: 'app_user',
  pwd: 'app_password',
  roles: [
    {
      role: 'readWrite',
      db: '$MONGO_INITDB_DATABASE'
    }
  ]
})

// Créer quelques collections de base si nécessaire
db.createCollection('users')
db.createCollection('restaurants')
db.createCollection('menuitems')

echo "Base de données initialisée avec succès!"
EOF