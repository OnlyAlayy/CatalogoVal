const Category = require('../models/Category.model');
const Product = require('../models/Product.model');
const { sendSuccess, sendError } = require('../utils/apiResponse');

const getCategories = async (req, res, next) => {
  try {
    const categories = await Category.find({ isActive: true }).sort('order');
    sendSuccess(res, categories);
  } catch (error) {
    next(error);
  }
};

const getCategoryBySlug = async (req, res, next) => {
  try {
    const category = await Category.findOne({ slug: req.params.slug, isActive: true });
    if (!category) return sendError(res, 'Categoría no encontrada', 404);

    const products = await Product.find({ category: category._id, isAvailable: true }).sort('order');
    sendSuccess(res, { category, products });
  } catch (error) {
    next(error);
  }
};

const createCategory = async (req, res, next) => {
  try {
    const { name, description, emoji, order } = req.body;
    let slug = name.toLowerCase().replace(/ /g, '-').replace(/[^\w-]+/g, '');

    const categoryExists = await Category.findOne({ slug });
    if (categoryExists) {
      slug = `${slug}-${Date.now()}`;
    }

    const category = await Category.create({ name, slug, description, emoji, order });
    sendSuccess(res, category, 'Categoría creada con éxito', 201);
  } catch (error) {
    next(error);
  }
};

const updateCategory = async (req, res, next) => {
  try {
    const category = await Category.findById(req.params.id);
    if (!category) return sendError(res, 'Categoría no encontrada', 404);

    const updatedCategory = await Category.findByIdAndUpdate(
      req.params.id,
      req.body,
      { new: true, runValidators: true }
    );
    sendSuccess(res, updatedCategory, 'Categoría actualizada');
  } catch (error) {
    next(error);
  }
};

const deleteCategory = async (req, res, next) => {
  try {
    const category = await Category.findById(req.params.id);
    if (!category) return sendError(res, 'Categoría no encontrada', 404);

    category.isActive = false;
    await category.save();
    sendSuccess(res, {}, 'Categoría eliminada (soft delete)');
  } catch (error) {
    next(error);
  }
};

const reorderCategories = async (req, res, next) => {
  try {
    const items = req.body; // Array of { id, order }
    if (!Array.isArray(items)) return sendError(res, 'Formato inválido', 400);

    const bulkOps = items.map(item => ({
      updateOne: {
        filter: { _id: item.id },
        update: { order: item.order }
      }
    }));

    await Category.bulkWrite(bulkOps);
    sendSuccess(res, null, 'Categorías reordenadas');
  } catch (error) {
    next(error);
  }
};

module.exports = {
  getCategories,
  getCategoryBySlug,
  createCategory,
  updateCategory,
  deleteCategory,
  reorderCategories
};
