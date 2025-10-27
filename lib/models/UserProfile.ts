import { Db, ObjectId, InsertOneResult, UpdateResult, DeleteResult } from 'mongodb';
import connectToDatabase from '../mongodb';
import { UserProfile, BaseDocument } from './types';

export class UserProfileService {
  private static COLLECTION_NAME = 'userProfiles';

  // Create a new user profile
  static async create(userProfile: Omit<UserProfile, '_id' | 'createdAt' | 'updatedAt'>): Promise<InsertOneResult<UserProfile>> {
    const { db } = await connectToDatabase();
    
    const newProfile: UserProfile = {
      ...userProfile,
      createdAt: new Date(),
      updatedAt: new Date(),
    };

    return await db.collection<UserProfile>(this.COLLECTION_NAME).insertOne(newProfile);
  }

  // Get user profile by Firebase UID
  static async getByUserId(userId: string): Promise<UserProfile | null> {
    const { db } = await connectToDatabase();
    
    return await db.collection<UserProfile>(this.COLLECTION_NAME).findOne({ userId });
  }

  // Get user profile by email
  static async getByEmail(email: string): Promise<UserProfile | null> {
    const { db } = await connectToDatabase();
    
    return await db.collection<UserProfile>(this.COLLECTION_NAME).findOne({ email });
  }

  // Update user profile
  static async update(userId: string, updates: Partial<UserProfile>): Promise<UpdateResult> {
    const { db } = await connectToDatabase();
    
    const updateDoc = {
      ...updates,
      updatedAt: new Date(),
    };

    return await db.collection<UserProfile>(this.COLLECTION_NAME).updateOne(
      { userId },
      { $set: updateDoc }
    );
  }

  // Update user preferences
  static async updatePreferences(userId: string, preferences: UserProfile['preferences']): Promise<UpdateResult> {
    const { db } = await connectToDatabase();
    
    return await db.collection<UserProfile>(this.COLLECTION_NAME).updateOne(
      { userId },
      { 
        $set: { 
          preferences,
          updatedAt: new Date()
        }
      }
    );
  }

  // Add quiz result to user profile
  static async addQuizResult(userId: string, quizType: 'quickQuiz' | 'longQuiz', results: any): Promise<UpdateResult> {
    const { db } = await connectToDatabase();
    
    const updateField = `completedQuizzes.${quizType}`;
    
    return await db.collection<UserProfile>(this.COLLECTION_NAME).updateOne(
      { userId },
      { 
        $set: { 
          [updateField]: {
            completedAt: new Date(),
            results
          },
          updatedAt: new Date()
        }
      }
    );
  }

  // Delete user profile
  static async delete(userId: string): Promise<DeleteResult> {
    const { db } = await connectToDatabase();
    
    return await db.collection<UserProfile>(this.COLLECTION_NAME).deleteOne({ userId });
  }

  // Get all user profiles (admin function)
  static async getAll(limit: number = 50, skip: number = 0): Promise<UserProfile[]> {
    const { db } = await connectToDatabase();
    
    return await db.collection<UserProfile>(this.COLLECTION_NAME)
      .find({})
      .sort({ createdAt: -1 })
      .limit(limit)
      .skip(skip)
      .toArray();
  }

  // Count total users
  static async count(): Promise<number> {
    const { db } = await connectToDatabase();
    
    return await db.collection<UserProfile>(this.COLLECTION_NAME).countDocuments();
  }

  // Create or update user profile (upsert)
  static async upsert(userProfile: Omit<UserProfile, '_id' | 'createdAt' | 'updatedAt'>): Promise<UpdateResult> {
    const { db } = await connectToDatabase();
    
    const now = new Date();
    
    return await db.collection<UserProfile>(this.COLLECTION_NAME).updateOne(
      { userId: userProfile.userId },
      { 
        $set: {
          ...userProfile,
          updatedAt: now,
        },
        $setOnInsert: {
          createdAt: now,
        }
      },
      { upsert: true }
    );
  }
}