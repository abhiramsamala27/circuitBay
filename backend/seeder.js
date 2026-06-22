import mongoose from 'mongoose';
import dotenv from 'dotenv';
import bcrypt from 'bcryptjs';
import User from './models/User.js';
import Product from './models/Product.js';
import Order from './models/Order.js';
import connectDB from './config/db.js';

dotenv.config();

connectDB();

const users = [
  {
    name: 'Admin User',
    email: 'admin@example.com',
    password: 'password123', // Will be hashed by userSchema pre-save hook
    isAdmin: true,
  },
  {
    name: 'John Doe',
    email: 'john@example.com',
    password: 'password123',
    isAdmin: false,
  },
];

const products = [
  {
    name: 'Pro Wireless Headphones',
    image: 'https://images.unsplash.com/photo-1505740420928-5e560c06d30e?w=500&auto=format&fit=crop&q=60&ixlib=rb-4.0.3',
    description: 'Experience premium sound quality with active noise cancellation, 40-hour battery life, and comfortable memory foam ear cushions.',
    category: 'Electronics',
    price: 199.99,
    countInStock: 10,
  },
  {
    name: 'Minimalist Mechanical Keyboard',
    image: 'https://images.unsplash.com/photo-1587829741301-dc798b83add3?w=500&auto=format&fit=crop&q=60&ixlib=rb-4.0.3',
    description: 'Compact 65% mechanical keyboard with tactile brown switches, RGB backlighting, and durable PBT keycaps.',
    category: 'Accessories',
    price: 89.99,
    countInStock: 15,
  },
  {
    name: 'Ergonomic Gaming Mouse',
    image: 'https://images.unsplash.com/photo-1615663245857-ac93bb7c39e7?w=500&auto=format&fit=crop&q=60&ixlib=rb-4.0.3',
    description: 'Precision gaming mouse featuring a 25K DPI optical sensor, ultra-lightweight design, and customizable side buttons.',
    category: 'Accessories',
    price: 59.99,
    countInStock: 20,
  },
  {
    name: 'Ultra-Wide Curved Monitor',
    image: 'https://images.unsplash.com/photo-1527443224154-c4a3942d3acf?w=500&auto=format&fit=crop&q=60&ixlib=rb-4.0.3',
    description: '34-inch curved gaming monitor with 144Hz refresh rate, 1ms response time, and HDR400 support for immersive visuals.',
    category: 'Electronics',
    price: 499.99,
    countInStock: 5,
  },
  {
    name: 'Portable SSD 1TB',
    image: 'https://images.unsplash.com/photo-1601524909162-be87252be298?w=500&auto=format&fit=crop&q=60&ixlib=rb-4.0.3',
    description: 'High-speed external solid-state drive with read speeds up to 1050MB/s, durable aluminum body, and USB-C connectivity.',
    category: 'Electronics',
    price: 119.99,
    countInStock: 12,
  },
  {
    name: 'Smart Fitness Watch',
    image: 'https://images.unsplash.com/photo-1508685096489-7aacd43bd3b1?w=500&auto=format&fit=crop&q=60&ixlib=rb-4.0.3',
    description: 'Sleek smartwatch with heart rate monitoring, sleep tracking, built-in GPS, and up to 7 days of battery life.',
    category: 'Electronics',
    price: 149.99,
    countInStock: 8,
  },
];

const importData = async () => {
  try {
    await Order.deleteMany();
    await Product.deleteMany();
    await User.deleteMany();

    // Hash passwords manually since insertMany bypasses mongoose pre-save hooks
    const hashedUsers = await Promise.all(
      users.map(async (u) => ({
        ...u,
        password: await bcrypt.hash(u.password, 10),
      }))
    );

    const createdUsers = await User.insertMany(hashedUsers);
    const adminUser = createdUsers[0]._id;

    // Associate admin user with each seeded product
    const sampleProducts = products.map((product) => {
      return { ...product, user: adminUser };
    });

    await Product.insertMany(sampleProducts);

    console.log('Data Imported Successfully!');
    process.exit();
  } catch (error) {
    console.error(`Error with importing data: ${error.message}`);
    process.exit(1);
  }
};

const destroyData = async () => {
  try {
    await Order.deleteMany();
    await Product.deleteMany();
    await User.deleteMany();

    console.log('Data Destroyed Successfully!');
    process.exit();
  } catch (error) {
    console.error(`Error with destroying data: ${error.message}`);
    process.exit(1);
  }
};

if (process.argv[2] === '-destroy') {
  destroyData();
} else {
  importData();
}
