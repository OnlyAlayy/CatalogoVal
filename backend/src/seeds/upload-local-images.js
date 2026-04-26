require('dotenv').config();
const mongoose = require('mongoose');
const path = require('path');
const connectDB = require('../config/db');
const Product = require('../models/Product.model');
const { cloudinary } = require('../config/cloudinary');

const imageMap = {
  'postre-frutilla': ['Frutilla130BasedebizcochuelodevainillaFrutillaycrema2capas.png'],
  'postre-durazno': ['duraznoBasedebizcochuelodevainillaFrutillaycrema.png'],
  'postre-cheesecake': ['CheesecakeGalletasdevainillaCremaparacheesecakeMermeladadefrutosrojosPOstresindividuales155.png'],
  'postre-chocotorta': ['Chocotorta155BasedechocolinasMezcladedulcedelecheyquesocrema.png'],
  'postre-oreo': ['Oreo130BasedebizcochuelodechocolateDulcedelecheycrema.png'],
  'postre-dulce-de-leche': ['DulcedelecheBasedechocolinasPostredulcedelecheChocolatesemiamargoPOstresindividuales130.png'],
  'shots-12-unidades': ['shotsaeleccióndesabor1000Consultarpormascantidadyvariedaddesaboresyaqueelpreciovaria.png'],
  'cookies': ['Cookies.png', 'CookiesConChipsDeChocolate.png'],
  'mini-donas': ['Minidonas.png', 'Minidonasx12.png'],
  'alfajores-maicena': ['Alfajores de Maicena.png', 'AlfajoresMaicena2.png'],
  'alfajores-chocochips': ['Alfajores ChocoChips.png']
};

const IMAGES_DIR = path.join(__dirname, '../../../frontend/src/assets/images');

const uploadLocalImages = async () => {
  try {
    await connectDB();
    console.log('Conectado a MongoDB. Iniciando subida a Cloudinary...');

    const products = await Product.find();

    for (const product of products) {
      const filesToUpload = imageMap[product.slug];
      
      if (!filesToUpload || filesToUpload.length === 0) {
        console.log(`[SKIP] ${product.name} (Sin imágenes asignadas)`);
        continue;
      }

      console.log(`Subiendo imágenes para: ${product.name}...`);
      const uploadedImages = [];

      for (const filename of filesToUpload) {
        const filePath = path.join(IMAGES_DIR, filename);
        try {
          const result = await cloudinary.uploader.upload(filePath, {
            folder: 'val_postress_catalog'
          });
          
          uploadedImages.push({
            url: result.secure_url,
            publicId: result.public_id
          });
          console.log(`  ✓ Subida con éxito: ${filename}`);
        } catch (uploadError) {
          console.error(`  X Error subiendo ${filename}:`, uploadError.message);
        }
      }

      if (uploadedImages.length > 0) {
        product.images = uploadedImages;
        await product.save();
        console.log(`[OK] ${product.name} actualizado en DB con ${uploadedImages.length} imágenes.`);
      }
    }

    console.log('\n--- ¡Proceso completado! ---');
    process.exit(0);
  } catch (error) {
    console.error('Error fatal:', error);
    process.exit(1);
  }
};

uploadLocalImages();
