const mongoose = require('mongoose');

const variantSchema = new mongoose.Schema({
  name: { type: String, required: true },
  price: { type: Number, required: true },
  isAvailable: { type: Boolean, default: true }
}, { _id: false });

const productSchema = new mongoose.Schema({
  name: {
    type: String,
    required: true,
    trim: true
  },
  slug: {
    type: String,
    required: true,
    unique: true
  },
  category: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'Category',
    required: true
  },
  description: {
    type: String,
    default: ''
  },
  ingredients: {
    type: [String],
    default: []
  },
  images: [{
    url: { type: String, required: true },
    publicId: { type: String, required: true }
  }],
  variants: {
    type: [variantSchema],
    default: []
  },
  price: {
    type: Number,
    default: null
  },
  isAvailable: {
    type: Boolean,
    default: true
  },
  isFeatured: {
    type: Boolean,
    default: false
  },
  orderNote: {
    type: String,
    default: ''
  },
  advanceHours: {
    type: Number,
    default: 24
  },
  requiresDeposit: {
    type: Boolean,
    default: false
  },
  depositPercentage: {
    type: Number,
    default: 50
  },
  order: {
    type: Number,
    default: 0
  }
}, {
  timestamps: true
});

module.exports = mongoose.model('Product', productSchema);
