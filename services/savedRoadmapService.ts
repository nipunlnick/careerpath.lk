import { connectToDatabase } from '../lib/mongodb';
import { ObjectId } from 'mongodb';

export interface SavedRoadmap {
  _id?: string;
  userId: string;
  roadmapSlug: string;
  roadmapName: string;
  roadmapData?: any;
  savedAt: Date;
  notes?: string;
  tags?: string[];
}

interface SavedRoadmapDocument {
  _id?: ObjectId;
  userId: string;
  roadmapSlug: string;
  roadmapName: string;
  roadmapData?: any;
  savedAt: Date;
  notes?: string;
  tags?: string[];
}

export class SavedRoadmapService {
  static async saveRoadmap(userId: string, roadmapSlug: string, roadmapName: string, roadmapData?: any, notes?: string): Promise<SavedRoadmap> {
    try {
      const { db } = await connectToDatabase();
      
      const savedRoadmap: SavedRoadmap = {
        userId,
        roadmapSlug,
        roadmapName,
        roadmapData,
        savedAt: new Date(),
        notes,
        tags: []
      };

      // Check if already saved
      const existing = await db.collection('savedRoadmaps').findOne({
        userId,
        roadmapSlug
      });

      if (existing) {
        // Update existing
        await db.collection('savedRoadmaps').updateOne(
          { userId, roadmapSlug },
          { 
            $set: {
              ...savedRoadmap,
              savedAt: new Date()
            }
          }
        );
        return { ...savedRoadmap, _id: existing._id.toString() };
      } else {
        // Create new
        const documentToSave: SavedRoadmapDocument = {
          userId,
          roadmapSlug,
          roadmapName,
          roadmapData,
          savedAt: new Date(),
          notes,
          tags: []
        };
        const result = await db.collection('savedRoadmaps').insertOne(documentToSave);
        return { ...savedRoadmap, _id: result.insertedId.toString() };
      }
    } catch (error) {
      console.error('Error saving roadmap:', error);
      throw new Error('Failed to save roadmap');
    }
  }

  static async unsaveRoadmap(userId: string, roadmapSlug: string): Promise<boolean> {
    try {
      const { db } = await connectToDatabase();
      
      const result = await db.collection('savedRoadmaps').deleteOne({
        userId,
        roadmapSlug
      });

      return result.deletedCount > 0;
    } catch (error) {
      console.error('Error unsaving roadmap:', error);
      throw new Error('Failed to unsave roadmap');
    }
  }

  static async getUserSavedRoadmaps(userId: string): Promise<SavedRoadmap[]> {
    try {
      const { db } = await connectToDatabase();
      
      const savedRoadmaps = await db.collection('savedRoadmaps')
        .find({ userId })
        .sort({ savedAt: -1 })
        .toArray();

      return savedRoadmaps.map(roadmap => ({
        _id: roadmap._id.toString(),
        userId: roadmap.userId,
        roadmapSlug: roadmap.roadmapSlug,
        roadmapName: roadmap.roadmapName,
        roadmapData: roadmap.roadmapData,
        savedAt: roadmap.savedAt,
        notes: roadmap.notes,
        tags: roadmap.tags || []
      }));
    } catch (error) {
      console.error('Error fetching saved roadmaps:', error);
      throw new Error('Failed to fetch saved roadmaps');
    }
  }

  static async isRoadmapSaved(userId: string, roadmapSlug: string): Promise<boolean> {
    try {
      const { db } = await connectToDatabase();
      
      const saved = await db.collection('savedRoadmaps').findOne({
        userId,
        roadmapSlug
      });

      return !!saved;
    } catch (error) {
      console.error('Error checking if roadmap is saved:', error);
      return false;
    }
  }

  static async addNoteToSavedRoadmap(userId: string, roadmapSlug: string, notes: string): Promise<boolean> {
    try {
      const { db } = await connectToDatabase();
      
      const result = await db.collection('savedRoadmaps').updateOne(
        { userId, roadmapSlug },
        { 
          $set: { 
            notes,
            updatedAt: new Date()
          }
        }
      );

      return result.modifiedCount > 0;
    } catch (error) {
      console.error('Error adding note to saved roadmap:', error);
      throw new Error('Failed to add note to saved roadmap');
    }
  }
}