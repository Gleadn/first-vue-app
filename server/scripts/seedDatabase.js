import mongoose from "mongoose";
import bcryptjs from "bcryptjs";
import dotenv from 'dotenv';
import path from 'path';
import { fileURLToPath } from 'url';

// Importer les modèles
import { TypeRestaurant, Restaurant, MenuItem, User, Cart, Order } from '../models/index.js';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

// Charger les variables d'environnement
dotenv.config({ path: path.join(__dirname, '../../.env') });

async function connectDB() {
  try {
    await mongoose.connect(process.env.MONGODB_URI, {
      dbName: process.env.MONGODB_DB_NAME || 'bibliotheque'
    });
    console.log('✅ Connexion à MongoDB réussie');
  } catch (error) {
    console.error('❌ Erreur de connexion à MongoDB:', error);
    process.exit(1);
  }
}

export async function seedDatabase() {
  try {
    console.log('🚀 Début du seeding de la base de données...');
    
    await connectDB();

    console.log("🗑️ Suppression des anciennes données...");
    await Promise.all([
      TypeRestaurant.deleteMany({}),
      Restaurant.deleteMany({}),
      MenuItem.deleteMany({}),
      User.deleteMany({}),
      Cart.deleteMany({}),
      Order.deleteMany({}),
    ]);

  console.log("📌 Insertion des Types de restaurants...");

  const typeImages = {
    Français: "https://cdn-icons-png.flaticon.com/512/3171/3171835.png",
    Italien: "https://cdn-icons-png.flaticon.com/512/3171/3171855.png",
    Asiatique: "https://cdn-icons-png.flaticon.com/512/1046/1046857.png",
    Mexicain: "https://cdn-icons-png.flaticon.com/512/3171/3171911.png",
    Gastronomique: "https://cdn-icons-png.flaticon.com/512/1046/1046859.png",
    "Fast Food": "https://cdn-icons-png.flaticon.com/512/5787/5787016.png",
    Végétarien: "https://cdn-icons-png.flaticon.com/512/883/883407.png",
    Américain: "https://cdn-icons-png.flaticon.com/512/3075/3075977.png",
  };

  const types = await TypeRestaurant.insertMany(
    Object.entries(typeImages).map(([nom, icone]) => ({ nom, icone }))
  );

  console.log("🏪 Insertion des Restaurants...");

  function pickRandom(arr, n = 1) {
    return arr.sort(() => 0.5 - Math.random()).slice(0, n);
  }

  const restaurantData = Array.from({ length: 18 }).map((_, i) => ({
    nom: `Restaurant ${i + 1}`,
    image: `https://picsum.photos/seed/resto_${i}/500/350`,
    idTypeRestaurant: pickRandom(types.map(t => t._id), Math.floor(1 + Math.random() * 3)),
    note: (Math.random() * 5).toFixed(1),
    votes: Math.floor(Math.random() * 200),
  }));

  const restaurants = await Restaurant.insertMany(restaurantData);

  console.log("🍽️ Insertion des Menu Items...");

  const samplePlats = [
    { nom: "Burger Gourmet", prix: 12, image: "https://picsum.photos/seed/burger/450/300" },
    { nom: "Pizza Margherita", prix: 11, image: "https://picsum.photos/seed/pizza/450/300" },
    { nom: "Sushi Assortiment", prix: 16, image: "https://picsum.photos/seed/sushi/450/300" },
    { nom: "Pâtes Carbonara", prix: 13, image: "https://picsum.photos/seed/pasta/450/300" },
    { nom: "Tacos Poulet", prix: 9, image: "https://picsum.photos/seed/tacos/450/300" },
    { nom: "Salade César", prix: 8, image: "https://picsum.photos/seed/salade/450/300" },
  ];

  for (const resto of restaurants) {
    const count = 2 + Math.floor(Math.random() * 5);
    const items = pickRandom(samplePlats, count).map((p) => ({
      ...p,
      idRestaurant: resto._id,
      ingredientsList: ["Sel", "Poivre", "Huile d'Olive"],
    }));
    await MenuItem.insertMany(items);
  }

  console.log("👤 Création du User Admin...");

  const hashed = await bcryptjs.hash("admin", 10);
  await User.create({
    email: "admin@mail.fr",
    motDePasse: hashed,
  });

  console.log("✅ SEED OK — Admin → email: admin@mail.fr | mdp: admin");
  
  } catch (error) {
    console.error('❌ Erreur pendant le seeding:', error);
  } finally {
    await mongoose.connection.close();
    console.log('🔌 Connexion fermée');
  }
}

// Exécuter le seeding
seedDatabase();
