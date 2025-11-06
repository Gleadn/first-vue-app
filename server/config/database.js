import mongoose from 'mongoose';
import dotenv from 'dotenv';
import path from 'path';
import { fileURLToPath } from 'url';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

// Charger le fichier .env depuis la racine du projet
dotenv.config({ path: path.join(__dirname, '../../.env') });

const connectDB = async () => {
  try {
    console.log('Tentative de connexion à MongoDB...');
    
    // Construire l'URI MongoDB si MONGODB_URI n'est pas défini
    let mongoUri = process.env.MONGODB_URI;
    
    if (!mongoUri) {
      // Fallback : construire l'URI à partir des variables individuelles
      const username = process.env.MONGO_ROOT_USERNAME || 'admin';
      const password = process.env.MONGO_ROOT_PASSWORD || 'password123';
      const dbName = process.env.MONGODB_DB_NAME || 'bibliotheque';
      const host = process.env.MONGODB_HOST || 'localhost';
      const port = process.env.MONGODB_PORT || '27017';
      
      mongoUri = `mongodb://${username}:${password}@${host}:${port}/${dbName}?authSource=admin`;
    }
    
    console.log('URI de connexion:', mongoUri.replace(/\/\/.*@/, '//***:***@')); // Masquer les credentials dans les logs
    
    const conn = await mongoose.connect(mongoUri, {
      dbName: process.env.MONGODB_DB_NAME || 'bibliotheque'
    });

    console.log(`MongoDB connecté: ${conn.connection.host}`);
    console.log(`Base de données: ${conn.connection.name}`);
    
    return conn;
  } catch (error) {
    console.error('Erreur de connexion à MongoDB:', error.message);
    console.error('Détails de l\'erreur:', error);
    process.exit(1);
  }
};

export default connectDB;