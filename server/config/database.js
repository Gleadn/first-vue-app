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
    console.log('URI:', process.env.MONGODB_URI);
    
    const conn = await mongoose.connect(process.env.MONGODB_URI, {
      dbName: process.env.MONGODB_DB_NAME || 'bibliotheque'
    });

    console.log(`MongoDB connecté: ${conn.connection.host}`);
    console.log(`Base de données: ${conn.connection.name}`);
    
    return conn;
  } catch (error) {
    console.error('Erreur de connexion à MongoDB:', error.message);
    process.exit(1);
  }
};

export default connectDB;