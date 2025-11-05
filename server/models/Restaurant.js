import mongoose from 'mongoose';

const restaurantSchema = new mongoose.Schema({
  nom: {
    type: String,
    required: [true, 'Le nom du restaurant est requis'],
    trim: true,
    maxlength: [100, 'Le nom ne peut pas dépasser 100 caractères']
  },
  image: {
    type: String,
    trim: true,
    validate: {
      validator: function(v) {
        if (!v) return true; // Optionnel
        return /^https?:\/\/.+/i.test(v);
      },
      message: 'L\'image doit être une URL valide'
    }
  },
  idTypeRestaurant: [{
    type: mongoose.Schema.Types.ObjectId,
    ref: 'TypeRestaurant'
  }],
  note: {
    type: Number,
    min: [0, 'La note ne peut pas être inférieure à 0'],
    max: [5, 'La note ne peut pas être supérieure à 5'],
    default: null
  },
  votes: {
    type: Number,
    min: [0, 'Le nombre de votes ne peut pas être négatif'],
    default: 0
  }
});

// Index pour améliorer les performances
restaurantSchema.index({ nom: 'text' });
restaurantSchema.index({ idTypeRestaurant: 1 });
restaurantSchema.index({ note: -1 });

const Restaurant = mongoose.model('Restaurant', restaurantSchema);

export default Restaurant;