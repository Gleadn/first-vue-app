import mongoose from 'mongoose';

const menuItemSchema = new mongoose.Schema({
  nom: {
    type: String,
    required: [true, 'Le nom du plat est requis'],
    trim: true,
    maxlength: [100, 'Le nom ne peut pas dépasser 100 caractères']
  },
  prix: {
    type: Number,
    required: [true, 'Le prix est requis'],
    min: [0, 'Le prix ne peut pas être négatif']
  },
  idRestaurant: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'Restaurant',
    required: [true, 'La référence au restaurant est requise']
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
  ingredientsList: [{
    type: String,
    trim: true
  }]
});

// Index pour améliorer les performances
menuItemSchema.index({ nom: 'text' });
menuItemSchema.index({ idRestaurant: 1 });
menuItemSchema.index({ prix: 1 });

const MenuItem = mongoose.model('MenuItem', menuItemSchema);

export default MenuItem;