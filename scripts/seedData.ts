import fs from 'fs';
import path from 'path';
import { connectToDatabase } from '../lib/mongodb';
import { CareerRoadmapService } from '../lib/models';
import { QuizPatternService } from '../lib/models/QuizPattern';
import dotenv from 'dotenv';

// Load environment variables
dotenv.config({ path: '.env' });

async function seedRoadmapsFromJson() {
  try {
    console.log('🌱 Starting roadmap data seeding...');

    const { db } = await connectToDatabase();
    
    // Path to roadmaps data directory
    const roadmapsDir = path.join(process.cwd(), 'data', 'roadmaps');
    
    if (!fs.existsSync(roadmapsDir)) {
      console.error('❌ Roadmaps data directory not found:', roadmapsDir);
      return;
    }

    const files = fs.readdirSync(roadmapsDir).filter(file => file.endsWith('.json'));
    console.log(`📁 Found ${files.length} roadmap files`);

    let seedCount = 0;
    let updateCount = 0;

    for (const file of files) {
      const filePath = path.join(roadmapsDir, file);
      const fileName = path.basename(file, '.json');
      
      try {
        const jsonData = JSON.parse(fs.readFileSync(filePath, 'utf8'));
        
        if (!Array.isArray(jsonData)) {
          console.warn(`⚠️  Skipping ${file}: Not an array of steps`);
          continue;
        }

        // Load corresponding insights data
        const insightsPath = path.join(process.cwd(), 'data', 'insights', `${fileName}.json`);
        let marketInsights = null;
        
        if (fs.existsSync(insightsPath)) {
          try {
            const insightsData = JSON.parse(fs.readFileSync(insightsPath, 'utf8'));
            marketInsights = {
              demand: insightsData.demand?.toLowerCase() || 'medium',
              salaryRange: parseSalaryRange(insightsData.salaryExpectations || ''),
              requiredSkills: insightsData.requiredSkills || [],
              futureOutlook: insightsData.futureOutlook || '',
              lastUpdated: new Date()
            };
            console.log(`💡 Loaded insights for ${fileName}`);
          } catch (error) {
            console.warn(`⚠️  Failed to load insights for ${fileName}:`, error);
          }
        }

        // Create roadmap object from JSON data
        const roadmapData = {
          name: fileName.split('-').map(word => 
            word.charAt(0).toUpperCase() + word.slice(1)
          ).join(' '),
          slug: fileName,
          category: inferCategory(fileName),
          description: `Step-by-step career roadmap for ${fileName.replace(/-/g, ' ')}`,
          steps: jsonData.map((step: any) => ({
            step: step.step || 1,
            title: step.title || '',
            description: step.description || '',
            duration: step.duration || '1-2 years',
            qualifications: step.qualifications || [],
            skills: step.skills || [],
            salaryRangeLKR: step.salaryRangeLKR || 'N/A',
            institutes: step.institutes || []
          })),
          marketInsights,
          difficulty: inferDifficulty(jsonData.length, fileName),
          estimatedDuration: inferDuration(jsonData.length),
          tags: generateTags(fileName),
          isActive: true,
          createdAt: new Date(),
          updatedAt: new Date()
        };

        // Check if roadmap already exists
        const existingRoadmap = await db.collection('careerRoadmaps').findOne({ slug: fileName });
        
        if (existingRoadmap) {
          // Update existing roadmap
          await db.collection('careerRoadmaps').updateOne(
            { slug: fileName },
            { 
              $set: {
                ...roadmapData,
                _id: existingRoadmap._id,
                createdAt: existingRoadmap.createdAt,
                updatedAt: new Date()
              }
            }
          );
          updateCount++;
          console.log(`🔄 Updated roadmap: ${roadmapData.name}`);
        } else {
          // Insert new roadmap
          await db.collection('careerRoadmaps').insertOne(roadmapData);
          seedCount++;
          console.log(`✅ Seeded roadmap: ${roadmapData.name}`);
        }

      } catch (error) {
        console.error(`❌ Error processing ${file}:`, error);
      }
    }

    console.log(`🎉 Seeding completed!`);
    console.log(`📊 Statistics:`);
    console.log(`   - New roadmaps: ${seedCount}`);
    console.log(`   - Updated roadmaps: ${updateCount}`);
    console.log(`   - Total processed: ${seedCount + updateCount}`);

  } catch (error) {
    console.error('❌ Seeding failed:', error);
    process.exit(1);
  }
}

// Helper functions
function inferCategory(fileName: string): string {
  const techKeywords = ['software', 'developer', 'engineer', 'programmer', 'data', 'ai', 'ml', 'web', 'mobile', 'cyber', 'cloud', 'blockchain'];
  const healthKeywords = ['doctor', 'nurse', 'medical', 'health', 'physiotherapist'];
  const businessKeywords = ['manager', 'analyst', 'entrepreneur', 'marketing', 'hr', 'business'];
  const creativeKeywords = ['designer', 'artist', 'writer', 'photographer', 'animator', 'content'];
  const educationKeywords = ['teacher', 'tutor', 'education', 'curriculum'];
  const serviceKeywords = ['chef', 'beautician', 'tour', 'hotel'];

  const name = fileName.toLowerCase();

  if (techKeywords.some(keyword => name.includes(keyword))) return 'Technology';
  if (healthKeywords.some(keyword => name.includes(keyword))) return 'Healthcare';
  if (businessKeywords.some(keyword => name.includes(keyword))) return 'Business';
  if (creativeKeywords.some(keyword => name.includes(keyword))) return 'Creative';
  if (educationKeywords.some(keyword => name.includes(keyword))) return 'Education';
  if (serviceKeywords.some(keyword => name.includes(keyword))) return 'Service';

  return 'Other';
}

function inferDifficulty(stepCount: number, fileName: string): 'beginner' | 'intermediate' | 'advanced' {
  const advancedKeywords = ['doctor', 'engineer', 'scientist', 'researcher', 'architect'];
  const name = fileName.toLowerCase();

  if (advancedKeywords.some(keyword => name.includes(keyword)) || stepCount > 6) {
    return 'advanced';
  } else if (stepCount > 4) {
    return 'intermediate';
  } else {
    return 'beginner';
  }
}

function inferDuration(stepCount: number): string {
  if (stepCount <= 3) return '1-2 years';
  if (stepCount <= 5) return '2-4 years';
  return '4-6 years';
}

function generateTags(fileName: string): string[] {
  const words = fileName.split('-');
  const tags = [...words];
  
  // Add category-based tags
  const name = fileName.toLowerCase();
  if (name.includes('engineer') || name.includes('developer')) tags.push('engineering', 'technical');
  if (name.includes('manager')) tags.push('management', 'leadership');
  if (name.includes('designer')) tags.push('design', 'creative');
  if (name.includes('data')) tags.push('analytics', 'statistics');
  
  return [...new Set(tags)]; // Remove duplicates
}

function parseSalaryRange(salaryExpectations: string): { min: number; max: number; currency: string } {
  // Parse salary ranges like "LKR 80,000 (Trainee) to LKR 600,000+ (Senior/Lead) per month."
  const lkrMatch = salaryExpectations.match(/LKR\s*([\d,]+)(?:.*?to.*?LKR\s*([\d,]+))?/i);
  
  if (lkrMatch) {
    const min = parseInt(lkrMatch[1].replace(/,/g, ''));
    const max = lkrMatch[2] ? parseInt(lkrMatch[2].replace(/[,+]/g, '')) : min * 2;
    return { min, max, currency: 'LKR' };
  }
  
  // Default values if parsing fails
  return { min: 50000, max: 200000, currency: 'LKR' };
}

async function seedQuizPatternsFromJson() {
  try {
    console.log('🧠 Starting quiz patterns seeding...');

    const { db } = await connectToDatabase();
    
    // Path to quiz mappings file
    const quizMappingsPath = path.join(process.cwd(), 'data', 'quiz-mappings.json');
    
    if (!fs.existsSync(quizMappingsPath)) {
      console.error('❌ Quiz mappings file not found:', quizMappingsPath);
      return;
    }

    const mappingsData = JSON.parse(fs.readFileSync(quizMappingsPath, 'utf8'));
    console.log('📁 Loaded quiz mappings data');

    // Seed the quiz patterns using the service
    const result = await QuizPatternService.seedFromJson(mappingsData);
    
    console.log('🎉 Quiz patterns seeding completed!');
    console.log('📊 Statistics:');
    console.log(`   - New patterns: ${result.created}`);
    console.log(`   - Updated patterns: ${result.updated}`);
    console.log(`   - Errors: ${result.errors}`);
    console.log(`   - Total processed: ${result.created + result.updated}`);

  } catch (error) {
    console.error('❌ Quiz patterns seeding failed:', error);
    process.exit(1);
  }
}

async function seedAll() {
  console.log('🌱 Starting complete data seeding...');
  
  try {
    await seedRoadmapsFromJson();
    await seedQuizPatternsFromJson();
    console.log('✅ All seeding completed successfully!');
  } catch (error) {
    console.error('❌ Seeding failed:', error);
    process.exit(1);
  }
}

// Run the seeding if this script is executed directly
if (import.meta.url === `file://${process.argv[1]}`) {
  seedAll();
}

export default seedAll;
export { seedRoadmapsFromJson, seedQuizPatternsFromJson };