require('dotenv').config();
const mongoose = require('mongoose');
const Category = require('../models/Category.model');
const Product = require('../models/Product.model');

const MONGO_URI = process.env.MONGO_URI || 'mongodb://127.0.0.1:27017/val_postress';

async function mergeAlfajores() {
  try {
    console.log('⏳ Conectando a la base de datos...');
    await mongoose.connect(MONGO_URI);
    console.log('✅ Conectado a MongoDB');

    // Find both alfajor categories
    const maicena = await Category.findOne({ slug: 'alfajores-maicena' });
    const chocochips = await Category.findOne({ slug: 'alfajores-chocochips' });

    if (!maicena && !chocochips) {
      console.log('❌ No se encontraron categorías de alfajores.');
      process.exit(1);
    }

    console.log(`📦 Encontrado: "${maicena?.name}" (${maicena?._id})`);
    console.log(`📦 Encontrado: "${chocochips?.name}" (${chocochips?._id})`);

    // We'll keep "maicena" as the base and rename it to "Alfajores"
    const keepCat = maicena || chocochips;
    const mergeCat = maicena ? chocochips : null;

    // Rename the kept category
    keepCat.name = 'Alfajores';
    keepCat.slug = 'alfajores';
    keepCat.emoji = 'Cookie';
    await keepCat.save();
    console.log(`✅ Categoría renombrada a "Alfajores" (${keepCat._id})`);

    if (mergeCat) {
      // Move all products from chocochips to the new "Alfajores" category
      const result = await Product.updateMany(
        { category: mergeCat._id },
        { $set: { category: keepCat._id } }
      );
      console.log(`🔄 ${result.modifiedCount} productos movidos de "${mergeCat.name}" a "Alfajores"`);

      // Soft-delete the old category
      mergeCat.isActive = false;
      await mergeCat.save();
      console.log(`🗑️ Categoría "${mergeCat.name}" desactivada.`);
    }

    console.log('🎉 ¡Merge completado exitosamente!');
    process.exit(0);
  } catch (error) {
    console.error('❌ Error:', error);
    process.exit(1);
  }
}

mergeAlfajores();
