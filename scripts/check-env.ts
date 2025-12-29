import * as dotenv from 'dotenv';
dotenv.config();

const apiKey = process.env.GEMINI_API_KEY;

if (apiKey) {
  console.log('✅ GEMINI_API_KEY is set.');
  console.log('Key length:', apiKey.length);
  console.log('Key starts with:', apiKey.substring(0, 4));
} else {
  console.error('❌ GEMINI_API_KEY is NOT set.');
}
