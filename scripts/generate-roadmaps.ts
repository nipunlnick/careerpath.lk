import { MongoClient } from 'mongodb';
import dotenv from 'dotenv';
import fs from 'fs';
import path from 'path';
import { generateRoadmap } from '../services/geminiService';

dotenv.config({ path: '.env' });

const MONGODB_URI = process.env.MONGODB_URI || 'mongodb://localhost:27017';
const MONGODB_DB = process.env.MONGODB_DB || 'careerpath_lk';

// Mock data generator for when API is unavailable
const generateMockRoadmap = (careerName: string) => {
  return {
    roadmap: [
      {
        step: 1,
        title: `Introduction to ${careerName}`,
        description: `Learn the basics of ${careerName} and foundational concepts.`,
        duration: '1-3 months',
        qualifications: ['High School Diploma'],
        skills: ['Basic Skills', 'Communication'],
        salaryRangeLKR: '30,000 - 50,000',
        institutes: ['Online Courses', 'Local Institutes']
      },
      {
        step: 2,
        title: 'Advanced Training',
        description: 'Deep dive into specialized topics and practical applications.',
        duration: '6-12 months',
        qualifications: ['Certificate/Diploma'],
        skills: ['Advanced Skills', 'Problem Solving'],
        salaryRangeLKR: '50,000 - 80,000',
        institutes: ['Universities', 'Vocational Training']
      },
      {
        step: 3,
        title: 'Professional Experience',
        description: 'Gain real-world experience through internships or entry-level jobs.',
        duration: '1-2 years',
        qualifications: ['Degree/Professional Qualification'],
        skills: ['Industry Tools', 'Teamwork'],
        salaryRangeLKR: '80,000 - 150,000+',
        institutes: ['Companies', 'Freelancing']
      }
    ],
    insights: {
      salary: 'Average entry-level salary is LKR 45,000/month',
      demand: 'High demand in Sri Lanka and globally',
      growth: 'Strong career growth potential with experience'
    }
  };
};

async function generateRoadmaps() {
  const useMock = process.argv.includes('--mock');
  console.log(`🚀 Starting Roadmap Generation ${useMock ? '(MOCK MODE)' : '(API MODE)'}...`);

  const client = new MongoClient(MONGODB_URI);
  await client.connect();
  const db = client.db(MONGODB_DB);
  const collection = db.collection('careerRoadmaps');

  // Load quiz mappings
  const mappingsPath = path.join(process.cwd(), 'data', 'quiz-mappings.json');
  const mappingsData = JSON.parse(fs.readFileSync(mappingsPath, 'utf8'));

  // Extract unique careers
  const careers = new Set<string>();
  
  // Helper to add careers from patterns
  const addCareers = (type: string) => {
    if (mappingsData[type]?.patterns) {
      mappingsData[type].patterns.forEach((p: any) => {
        if (p.suggestions) {
          p.suggestions.forEach((s: any) => careers.add(s.career));
        }
      });
    }
    if (mappingsData[type]?.fallback) {
      mappingsData[type].fallback.forEach((s: any) => careers.add(s.career));
    }
  };

  addCareers('standard');
  addCareers('long');

  console.log(`📋 Found ${careers.size} unique careers to process.`);

  let createdCount = 0;
  let skippedCount = 0;
  let errorCount = 0;

  for (const careerName of careers) {
    const slug = careerName.toLowerCase()
      .replace(/[^a-z0-9]+/g, '-')
      .replace(/(^-|-$)/g, '');

    // Check if exists
    const existing = await collection.findOne({ slug });
    if (existing) {
      console.log(`⏭️  Skipping ${careerName} (already exists)`);
      skippedCount++;
      continue;
    }

    console.log(`✨ Generating roadmap for: ${careerName}...`);

    try {
      let roadmapData;
      
      if (useMock) {
        roadmapData = generateMockRoadmap(careerName);
        await new Promise(resolve => setTimeout(resolve, 100)); // Simulate delay
      } else {
        // Call Gemini API
        roadmapData = await generateRoadmap(careerName);
        // Add delay to avoid rate limits
        await new Promise(resolve => setTimeout(resolve, 2000));
      }

      await collection.insertOne({
        name: careerName,
        slug,
        category: 'Quiz Generated',
        description: `Career roadmap for ${careerName}`,
        steps: roadmapData.roadmap,
        marketInsights: roadmapData.insights,
        difficulty: 'intermediate',
        estimatedDuration: '2-4 years',
        tags: [careerName, 'quiz-generated', useMock ? 'mock-data' : 'ai-generated'],
        isActive: true,
        createdAt: new Date(),
        updatedAt: new Date()
      });

      console.log(`✅ Created roadmap for ${careerName}`);
      createdCount++;

    } catch (error: any) {
      console.error(`❌ Failed to generate for ${careerName}:`, error.message);
      errorCount++;
    }
  }

  console.log('\n🎉 Generation Complete!');
  console.log(`✅ Created: ${createdCount}`);
  console.log(`⏭️  Skipped: ${skippedCount}`);
  console.log(`❌ Errors:  ${errorCount}`);

  await client.close();
}

generateRoadmaps();
