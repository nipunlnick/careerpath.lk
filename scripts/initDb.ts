import { MongoClient, Db } from 'mongodb';
import dotenv from 'dotenv';

// Load environment variables
dotenv.config({ path: '.env.local' });

const MONGODB_URI = process.env.MONGODB_URI || 'mongodb://localhost:27017';
const MONGODB_DB = process.env.MONGODB_DB || 'careerpath_lk';

async function initializeDatabase() {
  let client: MongoClient;

  try {
    console.log('🚀 Connecting to MongoDB...');
    client = new MongoClient(MONGODB_URI);
    await client.connect();
    
    const db: Db = client.db(MONGODB_DB);
    console.log(`✅ Connected to database: ${MONGODB_DB}`);

    // Create collections with validation schemas
    console.log('📋 Creating collections and indexes...');

    // User Profiles Collection
    try {
      await db.createCollection('userProfiles', {
        validator: {
          $jsonSchema: {
            bsonType: 'object',
            required: ['userId', 'email'],
            properties: {
              userId: { bsonType: 'string' },
              email: { bsonType: 'string' },
              displayName: { bsonType: 'string' },
              photoURL: { bsonType: 'string' },
              createdAt: { bsonType: 'date' },
              updatedAt: { bsonType: 'date' }
            }
          }
        }
      });
      console.log('✅ Created userProfiles collection');
    } catch (error: any) {
      if (error.code === 48) {
        console.log('ℹ️  userProfiles collection already exists');
      } else {
        throw error;
      }
    }

    // Career Roadmaps Collection
    try {
      await db.createCollection('careerRoadmaps', {
        validator: {
          $jsonSchema: {
            bsonType: 'object',
            required: ['name', 'slug', 'category', 'steps', 'isActive'],
            properties: {
              name: { bsonType: 'string' },
              slug: { bsonType: 'string' },
              category: { bsonType: 'string' },
              description: { bsonType: 'string' },
              difficulty: { enum: ['beginner', 'intermediate', 'advanced'] },
              isActive: { bsonType: 'bool' },
              createdAt: { bsonType: 'date' },
              updatedAt: { bsonType: 'date' }
            }
          }
        }
      });
      console.log('✅ Created careerRoadmaps collection');
    } catch (error: any) {
      if (error.code === 48) {
        console.log('ℹ️  careerRoadmaps collection already exists');
      } else {
        throw error;
      }
    }

    // Quiz Results Collection
    try {
      await db.createCollection('quizResults', {
        validator: {
          $jsonSchema: {
            bsonType: 'object',
            required: ['sessionId', 'quizType', 'answers', 'results', 'completedAt'],
            properties: {
              userId: { bsonType: 'string' },
              sessionId: { bsonType: 'string' },
              quizType: { enum: ['quick', 'long'] },
              completedAt: { bsonType: 'date' },
              createdAt: { bsonType: 'date' },
              updatedAt: { bsonType: 'date' }
            }
          }
        }
      });
      console.log('✅ Created quizResults collection');
    } catch (error: any) {
      if (error.code === 48) {
        console.log('ℹ️  quizResults collection already exists');
      } else {
        throw error;
      }
    }

    // Saved Roadmaps Collection
    try {
      await db.createCollection('savedRoadmaps', {
        validator: {
          $jsonSchema: {
            bsonType: 'object',
            required: ['userId', 'roadmapId', 'roadmapName', 'savedAt', 'lastAccessedAt'],
            properties: {
              userId: { bsonType: 'string' },
              roadmapId: { bsonType: 'objectId' },
              roadmapName: { bsonType: 'string' },
              savedAt: { bsonType: 'date' },
              lastAccessedAt: { bsonType: 'date' },
              createdAt: { bsonType: 'date' },
              updatedAt: { bsonType: 'date' }
            }
          }
        }
      });
      console.log('✅ Created savedRoadmaps collection');
    } catch (error: any) {
      if (error.code === 48) {
        console.log('ℹ️  savedRoadmaps collection already exists');
      } else {
        throw error;
      }
    }

    // User Activities Collection
    try {
      await db.createCollection('userActivities', {
        validator: {
          $jsonSchema: {
            bsonType: 'object',
            required: ['sessionId', 'action', 'resource', 'timestamp'],
            properties: {
              userId: { bsonType: 'string' },
              sessionId: { bsonType: 'string' },
              action: { bsonType: 'string' },
              resource: { bsonType: 'string' },
              timestamp: { bsonType: 'date' },
              createdAt: { bsonType: 'date' },
              updatedAt: { bsonType: 'date' }
            }
          }
        }
      });
      console.log('✅ Created userActivities collection');
    } catch (error: any) {
      if (error.code === 48) {
        console.log('ℹ️  userActivities collection already exists');
      } else {
        throw error;
      }
    }

    // Create indexes for better performance
    console.log('🔍 Creating indexes...');

    // User Profiles indexes
    await db.collection('userProfiles').createIndex({ userId: 1 }, { unique: true });
    await db.collection('userProfiles').createIndex({ email: 1 }, { unique: true });
    await db.collection('userProfiles').createIndex({ createdAt: -1 });

    // Career Roadmaps indexes
    await db.collection('careerRoadmaps').createIndex({ slug: 1 }, { unique: true });
    await db.collection('careerRoadmaps').createIndex({ category: 1 });
    await db.collection('careerRoadmaps').createIndex({ isActive: 1 });
    await db.collection('careerRoadmaps').createIndex({ tags: 1 });
    await db.collection('careerRoadmaps').createIndex({ name: 'text', description: 'text' });

    // Quiz Results indexes
    await db.collection('quizResults').createIndex({ userId: 1 });
    await db.collection('quizResults').createIndex({ sessionId: 1 });
    await db.collection('quizResults').createIndex({ quizType: 1 });
    await db.collection('quizResults').createIndex({ completedAt: -1 });

    // Saved Roadmaps indexes
    await db.collection('savedRoadmaps').createIndex({ userId: 1 });
    await db.collection('savedRoadmaps').createIndex({ roadmapId: 1 });
    await db.collection('savedRoadmaps').createIndex({ userId: 1, roadmapId: 1 }, { unique: true });
    await db.collection('savedRoadmaps').createIndex({ lastAccessedAt: -1 });

    // User Activities indexes
    await db.collection('userActivities').createIndex({ userId: 1 });
    await db.collection('userActivities').createIndex({ sessionId: 1 });
    await db.collection('userActivities').createIndex({ action: 1 });
    await db.collection('userActivities').createIndex({ timestamp: -1 });
    await db.collection('userActivities').createIndex({ timestamp: 1 }, { expireAfterSeconds: 31536000 }); // Expire after 1 year

    console.log('✅ All indexes created successfully');

    // Seed some initial data
    console.log('🌱 Seeding initial data...');

    // Check if roadmaps exist, if not create some sample ones
    const roadmapCount = await db.collection('careerRoadmaps').countDocuments();
    if (roadmapCount === 0) {
      const sampleRoadmaps = [
        {
          name: 'Software Engineer',
          slug: 'software-engineer',
          category: 'Technology',
          description: 'Become a professional software engineer',
          steps: [
            {
              step: 1,
              title: 'Learn Programming Fundamentals',
              description: 'Start with programming basics',
              duration: '3-6 months',
              qualifications: ['High school diploma'],
              skills: ['Programming Logic', 'Problem Solving'],
              salaryRangeLKR: 'N/A',
              institutes: ['Online Courses', 'Self-study']
            }
          ],
          difficulty: 'intermediate',
          estimatedDuration: '2-4 years',
          tags: ['programming', 'software', 'technology'],
          isActive: true,
          createdAt: new Date(),
          updatedAt: new Date()
        },
        {
          name: 'Data Scientist',
          slug: 'data-scientist',
          category: 'Technology',
          description: 'Analyze data and extract insights',
          steps: [
            {
              step: 1,
              title: 'Learn Statistics and Mathematics',
              description: 'Build strong mathematical foundation',
              duration: '6-12 months',
              qualifications: ['A/L Mathematics'],
              skills: ['Statistics', 'Mathematics', 'Python'],
              salaryRangeLKR: 'N/A',
              institutes: ['Universities', 'Online Courses']
            }
          ],
          difficulty: 'advanced',
          estimatedDuration: '3-5 years',
          tags: ['data', 'analytics', 'machine-learning'],
          isActive: true,
          createdAt: new Date(),
          updatedAt: new Date()
        }
      ];

      await db.collection('careerRoadmaps').insertMany(sampleRoadmaps);
      console.log('✅ Sample roadmaps inserted');
    }

    console.log('🎉 Database initialization completed successfully!');
    console.log(`📊 Database: ${MONGODB_DB}`);
    console.log(`🔗 Connection: ${MONGODB_URI}`);

  } catch (error) {
    console.error('❌ Database initialization failed:', error);
    process.exit(1);
  } finally {
    if (client!) {
      await client.close();
      console.log('🔌 Database connection closed');
    }
  }
}

// Run the initialization if this script is executed directly
if (import.meta.url === `file://${process.argv[1]}`) {
  initializeDatabase();
}

export default initializeDatabase;