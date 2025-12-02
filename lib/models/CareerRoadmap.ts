import { Db, ObjectId, InsertOneResult, UpdateResult, DeleteResult } from 'mongodb';
import connectToDatabase from '../mongodb';
import { CareerRoadmap } from './types';

export class CareerRoadmapService {
  private static COLLECTION_NAME = 'careerRoadmaps';

  // Create a new career roadmap
  static async create(roadmap: Omit<CareerRoadmap, '_id' | 'createdAt' | 'updatedAt'>): Promise<InsertOneResult<CareerRoadmap>> {
    const { db } = await connectToDatabase();
    
    const newRoadmap: CareerRoadmap = {
      ...roadmap,
      createdAt: new Date(),
      updatedAt: new Date(),
      views: 0,
    };

    return await db.collection<CareerRoadmap>(this.COLLECTION_NAME).insertOne(newRoadmap);
  }

  // Get roadmap by ID
  static async getById(id: string | ObjectId): Promise<CareerRoadmap | null> {
    const { db } = await connectToDatabase();
    
    return await db.collection<CareerRoadmap>(this.COLLECTION_NAME).findOne({ 
      _id: typeof id === 'string' ? new ObjectId(id) : id 
    });
  }

  // Get roadmap by slug
  static async getBySlug(slug: string): Promise<CareerRoadmap | null> {
    const { db } = await connectToDatabase();
    
    return await db.collection<CareerRoadmap>(this.COLLECTION_NAME).findOne({ slug });
  }

  // Get roadmaps by category
  static async getByCategory(category: string, limit: number = 20): Promise<CareerRoadmap[]> {
    const { db } = await connectToDatabase();
    
    return await db.collection<CareerRoadmap>(this.COLLECTION_NAME)
      .find({ category, isActive: true })
      .sort({ name: 1 })
      .limit(limit)
      .toArray();
  }

  // Search roadmaps
  static async search(query: string, limit: number = 10): Promise<CareerRoadmap[]> {
    const { db } = await connectToDatabase();
    
    return await db.collection<CareerRoadmap>(this.COLLECTION_NAME)
      .find({
        $and: [
          { isActive: true },
          {
            $or: [
              { name: { $regex: query, $options: 'i' } },
              { description: { $regex: query, $options: 'i' } },
              { tags: { $in: [new RegExp(query, 'i')] } },
              { 'steps.title': { $regex: query, $options: 'i' } },
              { 'steps.skills': { $in: [new RegExp(query, 'i')] } }
            ]
          }
        ]
      })
      .sort({ name: 1 })
      .limit(limit)
      .toArray();
  }

  // Get all active roadmaps
  static async getAllActive(limit: number = 100, skip: number = 0): Promise<CareerRoadmap[]> {
    const { db } = await connectToDatabase();
    
    return await db.collection<CareerRoadmap>(this.COLLECTION_NAME)
      .find({ isActive: true })
      .sort({ category: 1, name: 1 })
      .limit(limit)
      .skip(skip)
      .toArray();
  }

  // Update roadmap
  static async update(id: string | ObjectId, updates: Partial<CareerRoadmap>): Promise<UpdateResult> {
    const { db } = await connectToDatabase();
    
    const updateDoc = {
      ...updates,
      updatedAt: new Date(),
    };

    return await db.collection<CareerRoadmap>(this.COLLECTION_NAME).updateOne(
      { _id: typeof id === 'string' ? new ObjectId(id) : id },
      { $set: updateDoc }
    );
  }

  // Update roadmap steps
  static async updateSteps(id: string | ObjectId, steps: CareerRoadmap['steps']): Promise<UpdateResult> {
    const { db } = await connectToDatabase();
    
    return await db.collection<CareerRoadmap>(this.COLLECTION_NAME).updateOne(
      { _id: typeof id === 'string' ? new ObjectId(id) : id },
      { 
        $set: { 
          steps,
          updatedAt: new Date()
        }
      }
    );
  }

  // Update market insights
  static async updateMarketInsights(id: string | ObjectId, marketInsights: CareerRoadmap['marketInsights']): Promise<UpdateResult> {
    const { db } = await connectToDatabase();
    
    return await db.collection<CareerRoadmap>(this.COLLECTION_NAME).updateOne(
      { _id: typeof id === 'string' ? new ObjectId(id) : id },
      { 
        $set: { 
          marketInsights: {
            ...marketInsights,
            lastUpdated: new Date()
          },
          updatedAt: new Date()
        }
      }
    );
  }

  // Toggle roadmap active status
  static async toggleActive(id: string | ObjectId): Promise<UpdateResult> {
    const { db } = await connectToDatabase();
    
    const roadmap = await this.getById(id);
    if (!roadmap) {
      throw new Error('Roadmap not found');
    }

    return await db.collection<CareerRoadmap>(this.COLLECTION_NAME).updateOne(
      { _id: typeof id === 'string' ? new ObjectId(id) : id },
      { 
        $set: { 
          isActive: !roadmap.isActive,
          updatedAt: new Date()
        }
      }
    );
  }

  // Delete roadmap
  static async delete(id: string | ObjectId): Promise<DeleteResult> {
    const { db } = await connectToDatabase();
    
    return await db.collection<CareerRoadmap>(this.COLLECTION_NAME).deleteOne({ 
      _id: typeof id === 'string' ? new ObjectId(id) : id 
    });
  }

  // Get roadmaps by difficulty
  static async getByDifficulty(difficulty: CareerRoadmap['difficulty'], limit: number = 20): Promise<CareerRoadmap[]> {
    const { db } = await connectToDatabase();
    
    return await db.collection<CareerRoadmap>(this.COLLECTION_NAME)
      .find({ difficulty, isActive: true })
      .sort({ name: 1 })
      .limit(limit)
      .toArray();
  }

  // Get roadmaps by tags
  static async getByTags(tags: string[], limit: number = 20): Promise<CareerRoadmap[]> {
    const { db } = await connectToDatabase();
    
    return await db.collection<CareerRoadmap>(this.COLLECTION_NAME)
      .find({ 
        tags: { $in: tags },
        isActive: true 
      })
      .sort({ name: 1 })
      .limit(limit)
      .toArray();
  }

  // Count roadmaps
  static async count(filter: Partial<CareerRoadmap> = {}): Promise<number> {
    const { db } = await connectToDatabase();
    
    return await db.collection<CareerRoadmap>(this.COLLECTION_NAME).countDocuments(filter);
  }

  // Count generated roadmaps
  static async countGenerated(): Promise<number> {
    const { db } = await connectToDatabase();
    
    return await db.collection<CareerRoadmap>(this.COLLECTION_NAME).countDocuments({
      tags: { $in: ['search-generated'] },
      isActive: true
    });
  }

  // Get distinct categories
  static async getCategories(): Promise<string[]> {
    const { db } = await connectToDatabase();
    
    return await db.collection<CareerRoadmap>(this.COLLECTION_NAME).distinct('category', { isActive: true });
  }

  // Get distinct tags
  static async getTags(): Promise<string[]> {
    const { db } = await connectToDatabase();
    
    return await db.collection<CareerRoadmap>(this.COLLECTION_NAME).distinct('tags', { isActive: true });
  }

  // Increment view count
  static async incrementViews(id: string | ObjectId): Promise<UpdateResult> {
    const { db } = await connectToDatabase();
    
    return await db.collection<CareerRoadmap>(this.COLLECTION_NAME).updateOne(
      { _id: typeof id === 'string' ? new ObjectId(id) : id },
      { $inc: { views: 1 } }
    );
  }

  // Get total views
  static async getTotalViews(): Promise<number> {
    const { db } = await connectToDatabase();
    
    const result = await db.collection<CareerRoadmap>(this.COLLECTION_NAME).aggregate([
      { $group: { _id: null, totalViews: { $sum: "$views" } } }
    ]).toArray();

    return result[0]?.totalViews || 0;
  }
}