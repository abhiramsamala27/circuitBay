import express from 'express';
import dotenv from 'dotenv';
import cors from 'cors';
import mongoose from 'mongoose';
import connectDB from './config/db.js';
import userRoutes from './routes/userRoutes.js';
import productRoutes from './routes/productRoutes.js';
import orderRoutes from './routes/orderRoutes.js';

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

// DB Debug route to check environment variables on Vercel securely
app.get('/api/db-debug', async (req, res) => {
  const dbUri = process.env.MONGODB_URI || process.env.MONGO_URI || process.env.MONGO_URL || process.env.MONGODB_URL;
  if (!dbUri) {
    return res.json({ error: 'No MongoDB URI found in environment variables.' });
  }
  
  try {
    // Correctly mask only the password between : and @ after the protocol
    const maskedUri = dbUri.replace(/mongodb\+srv:\/\/([^:]+):([^@]+)@/, 'mongodb+srv://$1:****@');
    
    // Attempt a fresh connection to capture the exact error
    const tempConn = await mongoose.createConnection(dbUri, {
      serverSelectionTimeoutMS: 5000 // fail fast in 5 seconds
    }).asPromise();
    
    await tempConn.close();
    
    res.json({
      success: true,
      uriLength: dbUri.length,
      maskedUri: maskedUri,
      status: 'Successfully connected and authenticated!'
    });
  } catch (err) {
    res.json({
      success: false,
      uriLength: dbUri.length,
      errorName: err.name,
      errorMessage: err.message,
      errorStack: err.stack
    });
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
