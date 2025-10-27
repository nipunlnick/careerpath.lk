import { Db, ObjectId, InsertOneResult, UpdateResult, DeleteResult } from 'mongodb';
import connectToDatabase from '../mongodb';
import { SavedRoadmap } from './types';

export class SavedRoadmapService {
  private static COLLECTION_NAME = 'savedRoadmaps';

  // Save a roadmap for a user
  static async create(savedRoadmap: Omit<SavedRoadmap, '_id' | 'createdAt' | 'updatedAt'>): Promise<InsertOneResult<SavedRoadmap>> {
    const { db } = await connectToDatabase();
    
    const newSavedRoadmap: SavedRoadmap = {
      ...savedRoadmap,
      createdAt: new Date(),
      updatedAt: new Date(),
    };

    return await db.collection<SavedRoadmap>(this.COLLECTION_NAME).insertOne(newSavedRoadmap);
  }

  // Get saved roadmaps by user ID
  static async getByUserId(userId: string, limit: number = 50): Promise<SavedRoadmap[]> {
    const { db } = await connectToDatabase();
    
    return await db.collection<SavedRoadmap>(this.COLLECTION_NAME)
      .find({ userId })
      .sort({ lastAccessedAt: -1 })
      .limit(limit)
      .toArray();
  }

  // Get specific saved roadmap
  static async getByUserAndRoadmap(userId: string, roadmapId: string | ObjectId): Promise<SavedRoadmap | null> {
    const { db } = await connectToDatabase();
    
    return await db.collection<SavedRoadmap>(this.COLLECTION_NAME).findOne({
      userId,
      roadmapId: typeof roadmapId === 'string' ? new ObjectId(roadmapId) : roadmapId
    });
  }

  // Update progress for a saved roadmap
  static async updateProgress(
    userId: string, 
    roadmapId: string | ObjectId, 
    progress: SavedRoadmap['progress']
  ): Promise<UpdateResult> {
    const { db } = await connectToDatabase();
    
    return await db.collection<SavedRoadmap>(this.COLLECTION_NAME).updateOne(
      {
        userId,
        roadmapId: typeof roadmapId === 'string' ? new ObjectId(roadmapId) : roadmapId
      },
      { 
        $set: { 
          progress,
          lastAccessedAt: new Date(),
          updatedAt: new Date()
        }
      }
    );
  }

  // Mark step as completed
  static async markStepCompleted(
    userId: string, 
    roadmapId: string | ObjectId, 
    stepNumber: number
  ): Promise<UpdateResult> {
    const { db } = await connectToDatabase();
    
    // First get the current saved roadmap
    const savedRoadmap = await this.getByUserAndRoadmap(userId, roadmapId);
    if (!savedRoadmap) {
      throw new Error('Saved roadmap not found');
    }

    const completedSteps = savedRoadmap.progress?.completedSteps || [];
    
    // Add step if not already completed
    if (!completedSteps.includes(stepNumber)) {
      completedSteps.push(stepNumber);
    }

    const totalSteps = savedRoadmap.progress?.progressPercentage ? 
      Math.ceil(completedSteps.length * 100 / savedRoadmap.progress.progressPercentage) : 10;
    
    const progressPercentage = Math.round((completedSteps.length / totalSteps) * 100);
    const currentStep = Math.max(...completedSteps) + 1;

    return await this.updateProgress(userId, roadmapId, {
      completedSteps,
      currentStep,
      progressPercentage
    });
  }

  // Update notes for saved roadmap
  static async updateNotes(
    userId: string, 
    roadmapId: string | ObjectId, 
    notes: string
  ): Promise<UpdateResult> {
    const { db } = await connectToDatabase();
    
    return await db.collection<SavedRoadmap>(this.COLLECTION_NAME).updateOne(
      {
        userId,
        roadmapId: typeof roadmapId === 'string' ? new ObjectId(roadmapId) : roadmapId
      },
      { 
        $set: { 
          notes,
          updatedAt: new Date()
        }
      }
    );
  }

  // Update last accessed time
  static async updateLastAccessed(
    userId: string, 
    roadmapId: string | ObjectId
  ): Promise<UpdateResult> {
    const { db } = await connectToDatabase();
    
    return await db.collection<SavedRoadmap>(this.COLLECTION_NAME).updateOne(
      {
        userId,
        roadmapId: typeof roadmapId === 'string' ? new ObjectId(roadmapId) : roadmapId
      },
      { 
        $set: { 
          lastAccessedAt: new Date(),
          updatedAt: new Date()
        }
      }
    );
  }

  // Remove saved roadmap
  static async remove(userId: string, roadmapId: string | ObjectId): Promise<DeleteResult> {
    const { db } = await connectToDatabase();
    
    return await db.collection<SavedRoadmap>(this.COLLECTION_NAME).deleteOne({
      userId,
      roadmapId: typeof roadmapId === 'string' ? new ObjectId(roadmapId) : roadmapId
    });
  }

  // Check if roadmap is saved by user
  static async isSaved(userId: string, roadmapId: string | ObjectId): Promise<boolean> {
    const { db } = await connectToDatabase();
    
    const count = await db.collection<SavedRoadmap>(this.COLLECTION_NAME).countDocuments({
      userId,
      roadmapId: typeof roadmapId === 'string' ? new ObjectId(roadmapId) : roadmapId
    });
    
    return count > 0;
  }

  // Get user's progress statistics
  static async getUserProgressStats(userId: string): Promise<{
    totalSaved: number;
    totalCompleted: number;
    averageProgress: number;
    recentActivity: SavedRoadmap[];
  }> {
    const { db } = await connectToDatabase();
    
    const savedRoadmaps = await this.getByUserId(userId);
    
    const totalSaved = savedRoadmaps.length;
    const totalCompleted = savedRoadmaps.filter(sr => 
      sr.progress && sr.progress.progressPercentage >= 100
    ).length;
    
    const averageProgress = savedRoadmaps.length > 0 
      ? savedRoadmaps.reduce((sum, sr) => sum + (sr.progress?.progressPercentage || 0), 0) / savedRoadmaps.length
      : 0;
    
    const recentActivity = savedRoadmaps
      .sort((a, b) => b.lastAccessedAt.getTime() - a.lastAccessedAt.getTime())
      .slice(0, 5);

    return {
      totalSaved,
      totalCompleted,
      averageProgress: Math.round(averageProgress),
      recentActivity
    };
  }

  // Get most popular saved roadmaps
  static async getPopularRoadmaps(limit: number = 10): Promise<{ roadmapId: ObjectId; count: number; roadmapName: string }[]> {
    const { db } = await connectToDatabase();
    
    const popular = await db.collection<SavedRoadmap>(this.COLLECTION_NAME).aggregate([
      {
        $group: {
          _id: '$roadmapId',
          count: { $sum: 1 },
          roadmapName: { $first: '$roadmapName' }
        }
      },
      {
        $project: {
          _id: 0,
          roadmapId: '$_id',
          count: 1,
          roadmapName: 1
        }
      },
      { $sort: { count: -1 } },
      { $limit: limit }
    ]).toArray();

    return popular as { roadmapId: ObjectId; count: number; roadmapName: string }[];
  }

  // Delete all saved roadmaps for a user (cleanup)
  static async deleteAllForUser(userId: string): Promise<DeleteResult> {
    const { db } = await connectToDatabase();
    
    return await db.collection<SavedRoadmap>(this.COLLECTION_NAME).deleteMany({ userId });
  }

  // Count saved roadmaps
  static async count(filter: Partial<SavedRoadmap> = {}): Promise<number> {
    const { db } = await connectToDatabase();
    
    return await db.collection<SavedRoadmap>(this.COLLECTION_NAME).countDocuments(filter);
  }
}