import mongoose from 'mongoose';

const DEFAULT_URI = 'mongodb+srv://svpshahi_db_user:wh6Q3zLZlovJUvQf@cluster0.bk8ltpa.mongodb.net/bookcart?retryWrites=true&w=majority&appName=Cluster0';

// Global cache for Serverless environments (Vercel / AWS Lambda)
let cached = global.mongoose;

if (!cached) {
  cached = global.mongoose = { conn: null, promise: null };
}

const connectDB = async () => {
  const uri = process.env.MONGODB_URI || process.env.MONGO_URI || DEFAULT_URI;

  if (cached.conn) {
    return cached.conn;
  }

  if (!cached.promise) {
    const opts = {
      bufferCommands: false,
      serverSelectionTimeoutMS: 8000,
    };

    cached.promise = mongoose.connect(uri, opts).then((mongooseInstance) => {
      console.log(`✅ MongoDB Connected: ${mongooseInstance.connection.host}`);
      return mongooseInstance;
    });
  }

  try {
    cached.conn = await cached.promise;
  } catch (e) {
    cached.promise = null;
    console.error(`❌ MongoDB Connection Error: ${e.message}`);
    throw e;
  }

  return cached.conn;
};

export default connectDB;
