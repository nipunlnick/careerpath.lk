import { MongoClient, Db } from 'mongodb';

// MongoDB connection configuration
// Note: Environment variables are validated at runtime in connectToDatabase function

// Global connection cache to prevent multiple connections
interface GlobalWithMongoose {
  mongoose: {
    conn: MongoClient | null;
    promise: Promise<MongoClient> | null;
  };
}

declare const global: GlobalWithMongoose;

let cached = global.mongoose;

if (!cached) {
  cached = global.mongoose = { conn: null, promise: null };
}

export async function connectToDatabase(): Promise<{ client: MongoClient; db: Db }> {
  // Get environment variables at runtime
  const MONGODB_URI = process.env.MONGODB_URI;
  const MONGODB_DB = process.env.MONGODB_DB;

  // Validate required environment variables
  if (!MONGODB_URI) {
    throw new Error('MONGODB_URI environment variable is not defined');
  }

  if (!MONGODB_DB) {
    throw new Error('MONGODB_DB environment variable is not defined');
  }

  if (cached.conn) {
    return { client: cached.conn, db: cached.conn.db(MONGODB_DB) };
  }

  if (!cached.promise) {
    console.log('Connecting to MongoDB with URI:', MONGODB_URI.replace(/:[^:@]*@/, ':***@')); // Log with masked password
    
    const opts = {
      maxPoolSize: 10,
      serverSelectionTimeoutMS: 5000,
      socketTimeoutMS: 45000,
    };

    cached.promise = MongoClient.connect(MONGODB_URI, opts);
  }

  try {
    cached.conn = await cached.promise;
  } catch (e) {
    cached.promise = null;
    throw e;
  }

  return { client: cached.conn, db: cached.conn.db(MONGODB_DB) };
}

export default connectToDatabase;