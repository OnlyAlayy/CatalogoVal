require('dotenv').config();
const mongoose = require('mongoose');
const connectDB = require('../config/db');
const Product = require('../models/Product.model');
const Admin = require('../models/Admin.model');

// Real data from Val Postress catalog PDF + professional Unsplash images
const productData = {
  'postre-frutilla': {
    images: ['https://images.unsplash.com/photo-1488477181946-6428a0291777?w=800&h=600&fit=crop&q=80'],
    description: 'Base de bizcochuelo de vainilla con frutillas frescas y crema. Dos capas de pura delicia artesanal.',
    ingredients: ['Bizcochuelo de vainilla', 'Frutillas frescas', 'Crema', 'Azúcar'],
    price: 130,
    isAvailable: false,
  },
  'postre-durazno': {
    images: ['https://images.unsplash.com/photo-1565958011703-44f9829ba187?w=800&h=600&fit=crop&q=80'],
    description: 'Base de bizcochuelo de vainilla con duraznos en almíbar y crema. Dos capas suaves y frescas.',
    ingredients: ['Bizcochuelo de vainilla', 'Duraznos', 'Crema'],
    price: 130,
  },
  'postre-cheesecake': {
    images: ['https://images.unsplash.com/photo-1533134242443-d4fd215305ad?w=800&h=600&fit=crop&q=80'],
    description: 'Cheesecake individual con base de galletas de vainilla, crema para cheesecake y mermelada de frutos rojos.',
    ingredients: ['Galletas de vainilla', 'Crema para cheesecake', 'Mermelada de frutos rojos'],
    price: 155,
    isAvailable: false,
  },
  'postre-chocotorta': {
    images: ['https://images.unsplash.com/photo-1578985545062-69928b1d9587?w=800&h=600&fit=crop&q=80'],
    description: 'Clásica chocotorta argentina: base de chocolinas con mezcla de dulce de leche y queso crema. El favorito de siempre.',
    ingredients: ['Chocolinas', 'Dulce de leche', 'Queso crema'],
    price: 155,
    isFeatured: true,
  },
  'postre-oreo': {
    images: ['https://images.unsplash.com/photo-1551024506-0bccd828d307?w=800&h=600&fit=crop&q=80'],
    description: 'Base de bizcochuelo de chocolate con dulce de leche y crema. La combinación perfecta para los amantes del chocolate.',
    ingredients: ['Bizcochuelo de chocolate', 'Dulce de leche', 'Crema'],
    price: 130,
  },
  'postre-dulce-de-leche': {
    images: ['https://images.unsplash.com/photo-1571115177098-24ec42ed204d?w=800&h=600&fit=crop&q=80'],
    description: 'Postre de dulce de leche con base de chocolinas y chocolate semi amargo. Intenso y cremoso.',
    ingredients: ['Chocolinas', 'Dulce de leche', 'Chocolate semi amargo'],
    price: 130,
  },
  'shots-12-unidades': {
    images: ['https://images.unsplash.com/photo-1563729784474-d77dbb933a9e?w=800&h=600&fit=crop&q=80'],
    description: '12 shots a elección de sabor. Consultá por más cantidad y variedad de sabores ya que el precio varía.',
    ingredients: ['Variados según elección de sabor'],
    price: 1000,
    orderNote: 'Consultar por más cantidad y variedad de sabores',
  },
  'cookies': {
    images: ['https://images.unsplash.com/photo-1499636136210-6f4ee915583e?w=800&h=600&fit=crop&q=80'],
    description: 'Cookies artesanales con chips de chocolate. Crujientes por fuera, tiernas por dentro.',
    ingredients: ['Harina', 'Manteca', 'Chips de chocolate', 'Azúcar'],
  },
  'mini-donas': {
    images: ['https://images.unsplash.com/photo-1551106652-a5bcf4b29ab6?w=800&h=600&fit=crop&q=80'],
    description: 'Mini donas decoradas con distintos toppings. Ideales para mesas dulces, cumpleaños y eventos.',
    ingredients: ['Harina', 'Azúcar', 'Cobertura variada'],
  },
  'alfajores-maicena': {
    images: ['https://images.unsplash.com/photo-1558312657-b2dead03d494?w=800&h=600&fit=crop&q=80'],
    description: 'Alfajores de maicena caseros rellenos de dulce de leche y bañados en coco rallado. La receta clásica argentina.',
    ingredients: ['Maicena', 'Dulce de leche', 'Coco rallado', 'Manteca'],
  },
  'alfajores-chocochips': {
    images: ['https://images.unsplash.com/photo-1548848221-0c2e497ed557?w=800&h=600&fit=crop&q=80'],
    description: 'Alfajores con masa de chocolate y chips, rellenos de dulce de leche. Una versión moderna del clásico.',
    ingredients: ['Chocolate', 'Chips de chocolate', 'Dulce de leche', 'Harina'],
  },
};

const seedProductData = async () => {
  try {
    await connectDB();
    console.log('Connected to MongoDB\n');

    // 1. Re-seed admin
    console.log('--- Re-seeding admin ---');
    await Admin.deleteMany();
    await Admin.create({
      username: 'root',
      password: 'root',
      email: 'admin@valpostress.com',
    });
    console.log('Admin: root / root\n');

    // 2. Update all products with REAL catalog data
    console.log('--- Updating products with real catalog data ---');
    const products = await Product.find();

    for (const product of products) {
      const data = productData[product.slug];
      if (!data) {
        console.log(`  [SKIP] ${product.name} (${product.slug})`);
        continue;
      }

      const updateFields = {
        images: data.images,
        description: data.description,
        ingredients: data.ingredients,
      };

      // Update price if provided (for individual products)
      if (data.price !== undefined) {
        updateFields.price = data.price;
      }

      // Update availability
      if (data.isAvailable !== undefined) {
        updateFields.isAvailable = data.isAvailable;
      }

      // Update featured status
      if (data.isFeatured) {
        updateFields.isFeatured = true;
      }

      // Update order note
      if (data.orderNote) {
        updateFields.orderNote = data.orderNote;
      }

      await Product.findByIdAndUpdate(product._id, updateFields);
      console.log(`  [OK] ${product.name} — ${data.isAvailable === false ? '❌ NO DISPONIBLE' : '✅'}`);
    }

    console.log('\n--- Done! All products updated with real catalog data ---');
    process.exit(0);
  } catch (error) {
    console.error('Fatal error:', error);
    process.exit(1);
  }
};

seedProductData();
