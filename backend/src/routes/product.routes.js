const express = require('express');
const router = express.Router();
const {
  getProducts,
  getProductBySlug,
  createProduct,
  updateProduct,
  toggleAvailability,
  changePrice,
  deleteProduct,
  uploadImage,
  deleteImage
} = require('../controllers/product.controller');
const { protect } = require('../middleware/auth.middleware');
const upload = require('../middleware/upload.middleware');
const { validate } = require('../middleware/validate.middleware');
const { productValidator } = require('../validators/product.validator');

// Rutas Públicas
router.get('/', getProducts);
router.get('/:slug', getProductBySlug);

// Rutas Protegidas (Admin)
router.post('/', protect, productValidator, validate, createProduct);
router.put('/:id', protect, productValidator, validate, updateProduct);
router.patch('/:id/availability', protect, toggleAvailability);
router.patch('/:id/price', protect, changePrice);
router.delete('/:id', protect, deleteProduct);

// Upload/Delete de imagen
router.post('/upload-image', protect, upload.single('image'), uploadImage);
router.post('/delete-image', protect, deleteImage);

module.exports = router;
