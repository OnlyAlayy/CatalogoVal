require('dotenv').config();
const mongoose = require('mongoose');
const Category = require('../models/Category.model');

const MONGO_URI = process.env.MONGO_URI || 'mongodb://127.0.0.1:27017/val_postress';

const emojiToSvgMap = {
  '🍮': 'CakeSlice',
  '🧋': 'CupSoda',
  '🥤': 'CupSoda',
  '🍷': 'CupSoda',
  '🍪': 'Cookie',
  '🍩': 'Cake', // Usamos Cake o Candy para las donas
  '🥮': 'Cookie',
  '🍰': 'CakeSlice',
  '🧁': 'Cake',
  '🥐': 'Croissant',
  '🍦': 'IceCream',
  '🍨': 'IceCream',
  '🍧': 'IceCream',
  '☕': 'Coffee',
  '🍭': 'Candy',
  '🍬': 'Candy',
};

// Fallback por defecto si no mapea ninguno
const DEFAULT_ICON = 'Star';

async function updateEmojis() {
  try {
    console.log('⏳ Conectando a la base de datos...');
    await mongoose.connect(MONGO_URI);
    console.log('✅ Conectado a MongoDB');

    const categories = await Category.find({});
    console.log(`📦 Se encontraron ${categories.length} categorías.`);

    for (const cat of categories) {
      if (cat.emoji) {
        // Verificar si el emoji ya es un nombre de SVG válido (ej. "Cake", "Cookie")
        // Los emojis de verdad suelen medir 1 o 2 caracteres y no ser letras de la A a la Z
        const isStringIcon = /^[a-zA-Z]+$/.test(cat.emoji);
        
        if (!isStringIcon) {
          const oldEmoji = cat.emoji.trim();
          const newIcon = emojiToSvgMap[oldEmoji] || DEFAULT_ICON;
          
          console.log(`🔄 Actualizando: "${cat.name}" | De [${oldEmoji}] a [${newIcon}]`);
          cat.emoji = newIcon;
          await cat.save();
        } else {
          console.log(`⏭️ Ignorando: "${cat.name}" | Ya tiene un ícono SVG [${cat.emoji}]`);
        }
      }
    }

    console.log('🎉 Migración completada exitosamente.');
    process.exit(0);
  } catch (error) {
    console.error('❌ Error durante la migración:', error);
    process.exit(1);
  }
}

updateEmojis();
