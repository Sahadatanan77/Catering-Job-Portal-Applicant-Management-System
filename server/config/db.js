const mongoose = require('mongoose');

let mongodInstance = null;

const connectDB = async () => {
  if (mongoose.connection.readyState === 1) {
    return mongoose.connection;
  }
  try {
    let mongoUri = process.env.MONGODB_URI && process.env.MONGODB_URI.trim();

    if (!mongoUri) {
      console.log('No MONGODB_URI provided in .env. Initializing in-memory MongoDB server for local development...');
      try {
        const { MongoMemoryServer } = require('mongodb-memory-server');
        mongodInstance = await MongoMemoryServer.create();
        mongoUri = mongodInstance.getUri();
        console.log(`InMemory MongoDB successfully started at: ${mongoUri}`);
      } catch (err) {
        console.warn('mongodb-memory-server error, trying local standard mongodb://127.0.0.1:27017/catering_job_portal');
        mongoUri = 'mongodb://127.0.0.1:27017/catering_job_portal';
      }
    }

    const conn = await mongoose.connect(mongoUri, {
      serverSelectionTimeoutMS: 5000,
    });

    console.log(`MongoDB Connected: ${conn.connection.host} (DB: ${conn.connection.name})`);
    return conn;
  } catch (error) {
    console.error(`Database connection error: ${error.message}`);
    // If external URI failed, try fallback in-memory server
    if (!mongodInstance) {
      try {
        console.log('Falling back to MongoMemoryServer...');
        const { MongoMemoryServer } = require('mongodb-memory-server');
        mongodInstance = await MongoMemoryServer.create();
        const fallbackUri = mongodInstance.getUri();
        const conn = await mongoose.connect(fallbackUri);
        console.log(`Connected to Fallback InMemory MongoDB at: ${fallbackUri}`);
        return conn;
      } catch (fallbackErr) {
        console.error('Failed to start in-memory fallback:', fallbackErr.message);
      }
    }
    console.warn('Continuing without active MongoDB connection; requests requiring DB may fail.');
  }
};

const disconnectDB = async () => {
  try {
    await mongoose.disconnect();
    if (mongodInstance) {
      await mongodInstance.stop();
    }
  } catch (err) {
    console.error('Error disconnecting DB:', err.message);
  }
};

module.exports = { connectDB, disconnectDB };
