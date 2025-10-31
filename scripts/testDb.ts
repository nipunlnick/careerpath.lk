import { connectToDatabase } from '../lib/mongodb';
import dotenv from 'dotenv';

// Load environment variables
dotenv.config({ path: '.env' });

async function testDatabase() {
  try {
    console.log('🔍 Testing database connection and content...');
    
    const { db } = await connectToDatabase();
    console.log('✅ Connected to MongoDB');
    
    // Test collections
    const collections = await db.listCollections().toArray();
    console.log(`📋 Found ${collections.length} collections:`, collections.map(c => c.name));
    
    // Test roadmaps count
    const roadmapsCount = await db.collection('careerRoadmaps').countDocuments();
    console.log(`🗺️  Career roadmaps count: ${roadmapsCount}`);
    
    // Test quiz patterns count
    const patternsCount = await db.collection('quizPatterns').countDocuments();
    console.log(`🧠 Quiz patterns count: ${patternsCount}`);
    
    // Sample roadmap
    const sampleRoadmap = await db.collection('careerRoadmaps').findOne();
    if (sampleRoadmap) {
      console.log(`📝 Sample roadmap: ${sampleRoadmap.name} (${sampleRoadmap.slug})`);
      console.log(`   Steps: ${sampleRoadmap.steps?.length || 0}`);
      console.log(`   Category: ${sampleRoadmap.category}`);
    }
    
    // Sample quiz pattern
    const samplePattern = await db.collection('quizPatterns').findOne();
    if (samplePattern) {
      console.log(`🎯 Sample pattern: ${samplePattern.patternName}`);
      console.log(`   Careers: ${samplePattern.suggestedCareers?.length || 0}`);
    }
    
    console.log('✅ Database test completed successfully!');
    
  } catch (error) {
    console.error('❌ Database test failed:', error);
  }
  
  process.exit(0);
}

testDatabase();