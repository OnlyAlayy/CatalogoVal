require('dotenv').config();
const mongoose = require('mongoose');
const bcrypt = require('bcryptjs');
const connectDB = require('../config/db');
const Category = require('../models/Category.model');
const Product = require('../models/Product.model');
const Admin = require('../models/Admin.model');

const categoriesData = [
  { name: 'Postres Individuales', slug: 'postres-individuales', emoji: '🍮', order: 1 },
  { name: 'Shots', slug: 'shots', emoji: '🥃', order: 2 },
  { name: 'Cookies', slug: 'cookies', emoji: '🍪', order: 3 },
  { name: 'Mini Donas', slug: 'mini-donas', emoji: '🍩', order: 4 },
  { name: 'Alfajores de Maicena', slug: 'alfajores-maicena', emoji: '🥮', order: 5 },
  { name: 'Alfajores Chocochips', slug: 'alfajores-chocochips', emoji: '🍪', order: 6 }
];

const seedData = async () => {
  try {
    await connectDB();
    console.log('Clearing old data...');
    await Category.deleteMany();
    await Product.deleteMany();
    await Admin.deleteMany();

    console.log('Creating admin...');
    const adminPassword = process.env.ADMIN_PASSWORD || 'password123';
    await Admin.create({
      username: process.env.ADMIN_USERNAME || 'val',
      password: adminPassword,
      email: process.env.ADMIN_EMAIL || 'admin@valpostress.com'
    });

    console.log('Creating categories...');
    const createdCategories = await Category.insertMany(categoriesData);
    
    const getCatId = (slug) => createdCategories.find(c => c.slug === slug)._id;

    console.log('Creating products...');
    const productsData = [
      {
        name: 'Frutilla', slug: 'postre-frutilla', category: getCatId('postres-individuales'), price: 130, isAvailable: false
      },
      {
        name: 'Durazno', slug: 'postre-durazno', category: getCatId('postres-individuales'), price: 130
      },
      {
        name: 'Cheesecake', slug: 'postre-cheesecake', category: getCatId('postres-individuales'), price: 155
      },
      {
        name: 'Chocotorta', slug: 'postre-chocotorta', category: getCatId('postres-individuales'), price: 155, isFeatured: true
      },
      {
        name: 'Oreo', slug: 'postre-oreo', category: getCatId('postres-individuales'), price: 130
      },
      {
        name: 'Dulce de leche', slug: 'postre-dulce-de-leche', category: getCatId('postres-individuales'), price: 130
      },
      {
        name: '12 unidades a elección', slug: 'shots-12-unidades', category: getCatId('shots'), price: 1000,
        description: 'Elegí los sabores que más te gusten para tu cajita de 12 shots.'
      },
      {
        name: 'Cookies', slug: 'cookies', category: getCatId('cookies'),
        variants: [
          { name: 'Bandeja de 4', price: 180, isAvailable: true },
          { name: 'Bandeja de 6', price: 260, isAvailable: true }
        ]
      },
      {
        name: 'Mini Donas', slug: 'mini-donas', category: getCatId('mini-donas'),
        variants: [
          { name: 'Bandeja de 6', price: 150, isAvailable: true },
          { name: 'Bandeja de 9', price: 180, isAvailable: true },
          { name: 'Bandeja de 12', price: 220, isAvailable: true }
        ]
      },
      {
        name: 'Alfajores de Maicena', slug: 'alfajores-maicena', category: getCatId('alfajores-maicena'),
        variants: [
          { name: 'Bandeja de 6', price: 150, isAvailable: true },
          { name: 'Bandeja de 12', price: 280, isAvailable: true }
        ]
      },
      {
        name: 'Alfajores Chocochips', slug: 'alfajores-chocochips', category: getCatId('alfajores-chocochips'),
        variants: [
          { name: 'Bandeja de 6', price: 180, isAvailable: true },
          { name: 'Bandeja de 12', price: 300, isAvailable: true }
        ]
      }
    ];

    await Product.insertMany(productsData);

    console.log('Data imported successfully!');
    process.exit();
  } catch (error) {
    console.error('Error importing data:', error);
    process.exit(1);
  }
};

seedData();
