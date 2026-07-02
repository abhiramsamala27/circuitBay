import mongoose from 'mongoose';

const connectDB = async () => {
  try {
    const dbUri = process.env.MONGODB_URI || process.env.MONGO_URI || process.env.MONGO_URL || process.env.MONGODB_URL;
    if (!dbUri) {
      throw new Error('MONGODB_URI environment variable is not defined.');
    }
    const conn = await mongoose.connect(dbUri);
    console.log(`MongoDB Connected: ${conn.connection.host}`);
  } catch (error) {
    console.error(`Error Connecting to MongoDB: ${error.message}`);
    process.exit(1);
  }
};

export default connectDB;
