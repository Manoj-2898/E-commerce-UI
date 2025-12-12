import mongoose from 'mongoose';

/**
 * Connect to MongoDB database
 */
const connectDB = async () => {
  try {
    const mongoURI = process.env.MONGODB_URI || 'mongodb://localhost:27017/ecommerce';
    const conn = await mongoose.connect(mongoURI, {
      retryWrites: false,
      serverSelectionTimeoutMS: 5000,
    });

    console.log(`✅ MongoDB Connected: ${conn.connection.host}`);
    return conn;
  } catch (error) {
    console.error(`❌ MongoDB Connection Error: ${error.message}`);
    console.log('⚠️  Continuing without database - using mock data only');
    
    // Create a mock connection state
    const mockConnection = {
      connection: {
        host: 'mock-local',
      },
    };
    return mockConnection;
  }
};

export default connectDB;

