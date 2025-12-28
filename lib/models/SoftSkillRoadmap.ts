import { Db, ObjectId, InsertOneResult, UpdateResult, DeleteResult } from 'mongodb';
import connectToDatabase from '../mongodb';
import { SoftSkillRoadmap } from './types';

export class SoftSkillRoadmapService {
  private static COLLECTION_NAME = 'softSkillRoadmaps';

  // Create a new soft skill roadmap
  static async create(roadmap: Omit<SoftSkillRoadmap, '_id' | 'createdAt' | 'updatedAt'>): Promise<InsertOneResult<SoftSkillRoadmap>> {
    const { db } = await connectToDatabase();
    
    const newRoadmap: SoftSkillRoadmap = {
      ...roadmap,
      createdAt: new Date(),
      updatedAt: new Date(),
      views: 0,
    };

    return await db.collection<SoftSkillRoadmap>(this.COLLECTION_NAME).insertOne(newRoadmap);
  }

  // Get roadmap by slug
  static async getBySlug(slug: string): Promise<SoftSkillRoadmap | null> {
    const { db } = await connectToDatabase();
    
    return await db.collection<SoftSkillRoadmap>(this.COLLECTION_NAME).findOne({ slug });
  }

  // Search roadmaps
  static async search(query: string, limit: number = 10): Promise<SoftSkillRoadmap[]> {
    const { db } = await connectToDatabase();
    
    return await db.collection<SoftSkillRoadmap>(this.COLLECTION_NAME)
      .find({
        $and: [
          { isActive: true },
          {
            $or: [
              { name: { $regex: query, $options: 'i' } },
              { description: { $regex: query, $options: 'i' } },
              { tags: { $in: [new RegExp(query, 'i')] } }
            ]
          }
        ]
      })
      .sort({ name: 1 })
      .limit(limit)
      .toArray();
  }

  // Get all active roadmaps
  static async getAllActive(limit: number = 100): Promise<SoftSkillRoadmap[]> {
     const { db } = await connectToDatabase();
     
     return await db.collection<SoftSkillRoadmap>(this.COLLECTION_NAME)
       .find({ isActive: true })
       .sort({ name: 1 })
       .limit(limit)
       .toArray();
  }

  // Update roadmap
  static async update(id: string | ObjectId, updates: Partial<SoftSkillRoadmap>): Promise<UpdateResult> {
    const { db } = await connectToDatabase();
    
    return await db.collection<SoftSkillRoadmap>(this.COLLECTION_NAME).updateOne(
      { _id: typeof id === 'string' ? new ObjectId(id) : id },
      { 
        $set: {
            ...updates,
            updatedAt: new Date()
        } 
      }
    );
  }

  // Increment view count
  static async incrementViews(id: string | ObjectId): Promise<UpdateResult> {
    const { db } = await connectToDatabase();
    
    return await db.collection<SoftSkillRoadmap>(this.COLLECTION_NAME).updateOne(
      { _id: typeof id === 'string' ? new ObjectId(id) : id },
      { $inc: { views: 1 } }
    );
  }
}
