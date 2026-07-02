import mongoose from 'mongoose';

let cachedConnection = null;
let cachedPromise = null;

const connectDB = async () => {
  const dbUri = process.env.MONGODB_URI || process.env.MONGO_URI || process.env.MONGO_URL || process.env.MONGODB_URL;
  if (!dbUri) {
    throw new Error('MONGODB_URI environment variable is not defined.');
  }

  // If we already have a connection, return it
  if (mongoose.connection.readyState === 1) {
    return mongoose.connection;
  }

  // If a connection is in progress, return the promise
  if (mongoose.connection.readyState === 2 && cachedPromise) {
    return cachedPromise;
  }

  // Otherwise, create a new connection promise
  cachedPromise = mongoose.connect(dbUri, {
    serverSelectionTimeoutMS: 5000, // Timeout queries after 5 seconds instead of 10
  }).then((conn) => {
    console.log(`MongoDB Connected: ${conn.connection.host}`);
    return conn;
  }).catch((error) => {
    console.error(`Error Connecting to MongoDB: ${error.message}`);
    cachedPromise = null; // Reset on failure
    throw error;
  });

  return cachedPromise;
};

export default connectDB;

