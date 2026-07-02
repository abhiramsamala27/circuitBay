import express from 'express';
import dotenv from 'dotenv';
import cors from 'cors';
import bcrypt from 'bcryptjs';
import connectDB from './config/db.js';
import userRoutes from './routes/userRoutes.js';
import productRoutes from './routes/productRoutes.js';
import orderRoutes from './routes/orderRoutes.js';
import User from './models/User.js';
import Product from './models/Product.js';
import Order from './models/Order.js';

dotenv.config();

// Connect to Database
connectDB();

const app = express();

// Standard Middlewares
app.use(cors());
app.use(express.json());

// Handle OPTIONS preflight requests explicitly for all routes (important for Vercel)
app.options('*', cors());

// Basic welcome route
app.get('/', (req, res) => {
  res.send('API is running...');
});

// TEMPORARY: One-time seed route - DELETE AFTER USE
app.get('/api/seed', async (req, res) => {
  const secret = req.query.secret;
  if (secret !== 'circuitbay_seed_2024') {
    return res.status(401).json({ message: 'Unauthorized' });
  }
  try {
    await Order.deleteMany();
    await Product.deleteMany();
    await User.deleteMany();

    const hashedUsers = await Promise.all([
      { name: 'Admin User', email: 'admin@example.com', password: await bcrypt.hash('password123', 10), isAdmin: true },
      { name: 'John Doe', email: 'john@example.com', password: await bcrypt.hash('password123', 10), isAdmin: false },
    ]);
    const createdUsers = await User.insertMany(hashedUsers);
    const adminUser = createdUsers[0]._id;

    const sampleProducts = [
      { name: 'Pro Wireless Headphones', image: 'https://images.unsplash.com/photo-1505740420928-5e560c06d30e?w=500&auto=format&fit=crop&q=60', description: 'Experience premium sound quality with active noise cancellation, 40-hour battery life, and comfortable memory foam ear cushions.', category: 'Electronics', price: 199.99, countInStock: 10, user: adminUser },
      { name: 'Minimalist Mechanical Keyboard', image: 'https://images.unsplash.com/photo-1587829741301-dc798b83add3?w=500&auto=format&fit=crop&q=60', description: 'Compact 65% mechanical keyboard with tactile brown switches, RGB backlighting, and durable PBT keycaps.', category: 'Accessories', price: 89.99, countInStock: 15, user: adminUser },
      { name: 'Ergonomic Gaming Mouse', image: 'https://images.unsplash.com/photo-1615663245857-ac93bb7c39e7?w=500&auto=format&fit=crop&q=60', description: 'Precision gaming mouse featuring a 25K DPI optical sensor, ultra-lightweight design, and customizable side buttons.', category: 'Accessories', price: 59.99, countInStock: 20, user: adminUser },
      { name: 'Ultra-Wide Curved Monitor', image: 'https://images.unsplash.com/photo-1527443224154-c4a3942d3acf?w=500&auto=format&fit=crop&q=60', description: '34-inch curved gaming monitor with 144Hz refresh rate, 1ms response time, and HDR400 support for immersive visuals.', category: 'Electronics', price: 499.99, countInStock: 5, user: adminUser },
      { name: 'Portable SSD 1TB', image: 'https://images.unsplash.com/photo-1601524909162-be87252be298?w=500&auto=format&fit=crop&q=60', description: 'High-speed external solid-state drive with read speeds up to 1050MB/s, durable aluminum body, and USB-C connectivity.', category: 'Electronics', price: 119.99, countInStock: 12, user: adminUser },
      { name: 'Smart Fitness Watch', image: 'https://images.unsplash.com/photo-1508685096489-7aacd43bd3b1?w=500&auto=format&fit=crop&q=60', description: 'Sleek smartwatch with heart rate monitoring, sleep tracking, built-in GPS, and up to 7 days of battery life.', category: 'Electronics', price: 149.99, countInStock: 8, user: adminUser },
    ];

    await Product.insertMany(sampleProducts);
    res.json({ message: '✅ Data Imported Successfully! 6 products added.', count: sampleProducts.length });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
});

// Register API Routes
app.use('/api/users', userRoutes);
app.use('/api/products', productRoutes);
app.use('/api/orders', orderRoutes);

// 404 Route Not Found Error Handler
app.use((req, res, next) => {
  const error = new Error(`Not Found - ${req.originalUrl}`);
  res.status(404);
  next(error);
});

// General Error Handler
app.use((err, req, res, next) => {
  const statusCode = res.statusCode === 200 ? 500 : res.statusCode;
  res.status(statusCode).json({
    message: err.message,
    stack: process.env.NODE_ENV === 'production' ? null : err.stack,
  });
});

const PORT = process.env.PORT || 5000;

if (!process.env.VERCEL) {
  app.listen(PORT, () => {
    console.log(`Server running in ${process.env.NODE_ENV} mode on port ${PORT}`);
  });
}

export default app;
