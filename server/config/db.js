import mongoose from 'mongoose';
import { MongoMemoryServer } from 'mongodb-memory-server';

let mongoServer = null;

const connectDB = async () => {
  const customUri = process.env.MONGO_URI;

  try {
    // Attempt connecting to specified MONGO_URI with a 2.5s server selection timeout
    const conn = await mongoose.connect(customUri || 'mongodb://127.0.0.1:27017/bookcart', {
      serverSelectionTimeoutMS: 2500
    });
    console.log(`✅ MongoDB Connected: ${conn.connection.host}`);
    return conn;
  } catch (error) {
    console.warn(`⚠️ Could not reach external MongoDB (${error.message}). Starting embedded high-performance MongoDB instance...`);
    try {
      mongoServer = await MongoMemoryServer.create();
      const memUri = mongoServer.getUri();
      const conn = await mongoose.connect(memUri);
      console.log(`✅ Embedded MongoDB Engine Online at: ${memUri}`);

      // Automatically seed data if using embedded instance so user has 20+ books immediately
      import('../seeder.js').then((module) => {
        if (module.seedDataDirect) {
          module.seedDataDirect();
        }
      }).catch((e) => console.log('Seeder loader note:', e.message));

      return conn;
    } catch (memErr) {
      console.error(`❌ Embedded MongoDB Error: ${memErr.message}`);
    }
  }
};

export default connectDB;
