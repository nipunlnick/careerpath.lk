import dotenv from 'dotenv';
import path from 'path';
import { fileURLToPath } from 'url';

// ES module equivalent of __dirname
const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

// Load from the project root
const result = dotenv.config({ path: path.join(__dirname, '../.env') });
console.log('Dotenv config result:', result);

console.log('Environment Variables Check:');
console.log('MONGODB_URI exists:', !!process.env.MONGODB_URI);
console.log('MONGODB_URI length:', process.env.MONGODB_URI?.length || 0);
console.log('MONGODB_DB:', process.env.MONGODB_DB);
console.log('NODE_ENV:', process.env.NODE_ENV);

// Try to connect to test the connection
import connectToDatabase from '../lib/mongodb';

async function testConnection() {
  try {
    console.log('Testing database connection...');
    const { client, db } = await connectToDatabase();
    console.log('✅ Database connection successful!');
    console.log('Database name:', db.databaseName);
    await client.close();
  } catch (error) {
    console.error('❌ Database connection failed:', error);
  }
}

testConnection();