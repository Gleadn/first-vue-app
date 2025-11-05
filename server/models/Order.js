import mongoose from 'mongoose';

const orderItemSchema = new mongoose.Schema({
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
    min: 1
  }
});

const orderSchema = new mongoose.Schema({
  numeroCommande: {
    type: String,
    unique: true,
    required: true
  },
  idClient: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'User',
    required: true
  },
  idRestaurant: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'Restaurant',
    required: true
  },
  items: [orderItemSchema],
  statut: {
    type: String,
    enum: ['en_attente', 'confirmee', 'annulee'],
    default: 'en_attente'
  },
  montantTotal: {
    type: Number,
    required: true,
    min: 0
  }
});

// Générer un numéro de commande unique avant la sauvegarde
orderSchema.pre('save', async function(next) {
  if (!this.numeroCommande) {
    const count = await mongoose.model('Order').countDocuments();
    this.numeroCommande = `CMD-${Date.now()}-${(count + 1).toString().padStart(4, '0')}`;
  }
  next();
});

// Index pour améliorer les performances
orderSchema.index({ idClient: 1 });
orderSchema.index({ idRestaurant: 1 });
orderSchema.index({ statut: 1 });
orderSchema.index({ numeroCommande: 1 });

const Order = mongoose.model('Order', orderSchema);

export default Order;