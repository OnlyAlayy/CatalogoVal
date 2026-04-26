const express = require('express');
const router = express.Router();
const {
  getCategories,
  getCategoryBySlug,
  createCategory,
  updateCategory,
  deleteCategory,
  reorderCategories
} = require('../controllers/category.controller');
const { protect } = require('../middleware/auth.middleware');
const { validate } = require('../middleware/validate.middleware');
const { categoryValidator } = require('../validators/category.validator');

router.get('/', getCategories);
router.get('/:slug', getCategoryBySlug);

router.post('/', protect, categoryValidator, validate, createCategory);
router.patch('/reorder', protect, reorderCategories);
router.put('/:id', protect, categoryValidator, validate, updateCategory);
router.delete('/:id', protect, deleteCategory);

module.exports = router;
