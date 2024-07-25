import mongoose from 'mongoose';
import dotenv from 'dotenv';

const connectToDatabase = async () => {
  try {
    const conn = await mongoose.connect(process.env.DB_CONNECTION_STRING || 'your_mongo_uri');
    console.log(`MongoDB Connected: ${conn.connection.host}`);
  } catch (err) {
    console.error(`Error: ${err}`);
    process.exit(1);
  }
};

export default connectToDatabase;
