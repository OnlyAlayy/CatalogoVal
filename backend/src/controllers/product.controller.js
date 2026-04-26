const Product = require('../models/Product.model');
const { sendSuccess, sendError } = require('../utils/apiResponse');
const { cloudinary } = require('../config/cloudinary');
const fs = require('fs');

const getProducts = async (req, res, next) => {
  try {
    const { category, featured, available } = req.query;
    let filter = {};

    // Populated category helps filtering if we want to filter by category slug
    // But typically we pass categoryId or do a lookup. 
    // If the frontend sends category slug, we'd need to find the category first.
    // Assuming frontend sends category ID for simplicity, or we can handle it.
    if (category) filter.category = category;
    if (featured === 'true') filter.isFeatured = true;
    if (available === 'true') filter.isAvailable = true;

    const products = await Product.find(filter)
      .populate('category', 'name slug')
      .sort('order');

    sendSuccess(res, products);
  } catch (error) {
    next(error);
  }
};

const getProductBySlug = async (req, res, next) => {
  try {
    const product = await Product.findOne({ slug: req.params.slug })
      .populate('category', 'name slug');
      
    if (!product) return sendError(res, 'Producto no encontrado', 404);

    sendSuccess(res, product);
  } catch (error) {
    next(error);
  }
};

const createProduct = async (req, res, next) => {
  try {
    let slug = req.body.name.toLowerCase().replace(/ /g, '-').replace(/[^\w-]+/g, '');
    const productExists = await Product.findOne({ slug });
    if (productExists) {
      slug = `${slug}-${Date.now()}`;
    }

    const newProduct = await Product.create({ ...req.body, slug });
    sendSuccess(res, newProduct, 'Producto creado con éxito', 201);
  } catch (error) {
    next(error);
  }
};

const updateProduct = async (req, res, next) => {
  try {
    const product = await Product.findByIdAndUpdate(
      req.params.id,
      req.body,
      { new: true, runValidators: true }
    );
    if (!product) return sendError(res, 'Producto no encontrado', 404);

    sendSuccess(res, product, 'Producto actualizado');
  } catch (error) {
    next(error);
  }
};

const toggleAvailability = async (req, res, next) => {
  try {
    const { isAvailable } = req.body;
    const product = await Product.findByIdAndUpdate(
      req.params.id,
      { isAvailable },
      { new: true }
    );
    if (!product) return sendError(res, 'Producto no encontrado', 404);

    sendSuccess(res, product, `Disponibilidad cambiada a ${isAvailable}`);
  } catch (error) {
    next(error);
  }
};

const changePrice = async (req, res, next) => {
  try {
    const { price, variants } = req.body;
    const updateData = {};
    if (price !== undefined) updateData.price = price;
    if (variants !== undefined) updateData.variants = variants;

    const product = await Product.findByIdAndUpdate(
      req.params.id,
      updateData,
      { new: true }
    );
    if (!product) return sendError(res, 'Producto no encontrado', 404);

    sendSuccess(res, product, 'Precio actualizado');
  } catch (error) {
    next(error);
  }
};

const deleteProduct = async (req, res, next) => {
  try {
    const product = await Product.findById(req.params.id);
    if (!product) return sendError(res, 'Producto no encontrado', 404);

    if (product.images && product.images.length > 0) {
      for (const img of product.images) {
        if (img.publicId) {
          try {
            await cloudinary.uploader.destroy(img.publicId);
          } catch (err) {
            console.error('Error eliminando imagen de Cloudinary:', err);
          }
        }
      }
    }

    await Product.findByIdAndDelete(req.params.id);
    sendSuccess(res, {}, 'Producto eliminado');
  } catch (error) {
    next(error);
  }
};

const uploadImage = async (req, res, next) => {
  try {
    if (!req.file) {
      return sendError(res, 'No se proporcionó ninguna imagen', 400);
    }
    
    const result = await cloudinary.uploader.upload(req.file.path, {
      folder: 'val_postress_catalog'
    });
    
    // Eliminar archivo local
    if (fs.existsSync(req.file.path)) {
      fs.unlinkSync(req.file.path);
    }

    sendSuccess(res, {
      url: result.secure_url,
      publicId: result.public_id
    }, 'Imagen subida con éxito');
  } catch (error) {
    if (req.file && fs.existsSync(req.file.path)) {
      fs.unlinkSync(req.file.path);
    }
    next(error);
  }
};

const deleteImage = async (req, res, next) => {
  try {
    const { publicId } = req.body;
    if (!publicId) return sendError(res, 'Falta el publicId de la imagen', 400);

    // Validación básica de seguridad: asegurar que solo intenten borrar de nuestra carpeta
    if (typeof publicId !== 'string' || !publicId.startsWith('val_postress_catalog/')) {
      return sendError(res, 'ID de imagen no válido', 400);
    }

    await cloudinary.uploader.destroy(publicId);
    sendSuccess(res, {}, 'Imagen eliminada de Cloudinary');
  } catch (error) {
    next(error);
  }
};

module.exports = {
  getProducts,
  getProductBySlug,
  createProduct,
  updateProduct,
  toggleAvailability,
  changePrice,
  deleteProduct,
  uploadImage,
  deleteImage
};
