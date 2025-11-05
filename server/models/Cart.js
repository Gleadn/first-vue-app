import mongoose from 'mongoose';

const cartItemSchema = new mongoose.Schema({
  idMenuItem: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'MenuItem',
    required: true
  },
  nom: {
    type: String,
    required: true
  },
  prix: {
    type: Number,
    required: true,
    min: 0
  },
  quantite: {
    type: Number,
    required: true,
    min: 1,
    default: 1
  }
});

const cartSchema = new mongoose.Schema({
  idUser: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'User',
    required: [true, 'La référence à l\'utilisateur est requise']
  },
  items: {
    type: [cartItemSchema],
    required: [true, 'Les items du panier sont requis'],
    validate: {
      validator: function(items) {
        return items && items.length > 0;
      },
      message: 'Le panier doit contenir au moins un item'
    }
  },
  totalPrice: {
    type: Number,
    required: [true, 'Le prix total est requis'],
    min: [0, 'Le prix total ne peut pas être négatif']
  },
  finished: {
    type: Boolean,
    default: false
  },
  idRestaurant: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'Restaurant'
  }
});

// Index pour améliorer les performances
cartSchema.index({ idUser: 1, finished: 1 });

// Méthode pour calculer le prix total automatiquement
cartSchema.methods.calculateTotalPrice = function() {
  const itemsTotal = this.items.reduce((total, item) => {
    return total + (item.prix * item.quantite);
  }, 0);
  
  this.totalPrice = itemsTotal;
  return this.totalPrice;
};

// Middleware pour recalculer le prix total avant la sauvegarde
cartSchema.pre('save', function(next) {
  if (this.isModified('items')) {
    this.calculateTotalPrice();
  }
  next();
});

const Cart = mongoose.model('Cart', cartSchema);

export default Cart;