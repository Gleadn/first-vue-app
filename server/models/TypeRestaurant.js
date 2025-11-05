import mongoose from 'mongoose';

const typeRestaurantSchema = new mongoose.Schema({
  nom: {
    type: String,
    required: [true, 'Le nom du type de restaurant est requis'],
    trim: true,
    maxlength: [50, 'Le nom ne peut pas dépasser 50 caractères'],
    unique: true
  },
  icone: {
    type: String,
    trim: true,
    validate: {
      validator: function(v) {
        if (!v) return true; // Optionnel
        return /^https?:\/\/.+/i.test(v);
      },
      message: 'L\'icône doit être une URL valide'
    }
  }
});

// Index pour améliorer les performances
typeRestaurantSchema.index({ nom: 1 });

const TypeRestaurant = mongoose.model('TypeRestaurant', typeRestaurantSchema);

export default TypeRestaurant;