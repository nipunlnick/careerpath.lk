import { Db, ObjectId, InsertOneResult, UpdateResult, DeleteResult } from 'mongodb';
import connectToDatabase from '../mongodb';
import { QuizResult } from './types';

export class QuizResultService {
  private static COLLECTION_NAME = 'quizResults';

  // Create a new quiz result
  static async create(quizResult: Omit<QuizResult, '_id' | 'createdAt' | 'updatedAt'>): Promise<InsertOneResult<QuizResult>> {
    const { db } = await connectToDatabase();
    
    const newQuizResult: QuizResult = {
      ...quizResult,
      createdAt: new Date(),
      updatedAt: new Date(),
    };

    return await db.collection<QuizResult>(this.COLLECTION_NAME).insertOne(newQuizResult);
  }

  // Get quiz result by ID
  static async getById(id: string | ObjectId): Promise<QuizResult | null> {
    const { db } = await connectToDatabase();
    
    return await db.collection<QuizResult>(this.COLLECTION_NAME).findOne({ 
      _id: typeof id === 'string' ? new ObjectId(id) : id 
    });
  }

  // Get quiz results by user ID
  static async findByUserId(userId: string): Promise<QuizResult[]> {
    const { db } = await connectToDatabase();
    const results = await db.collection<QuizResult>('quizResults')
      .find({ userId })
      .sort({ createdAt: -1 })
      .toArray();
    return results;
  }

  static async findByHash(answersHash: string, quizType?: string): Promise<QuizResult | null> {
    const { db } = await connectToDatabase();
    const filter: any = { answersHash };
    if (quizType) {
      filter.quizType = quizType;
    }
    const result = await db.collection<QuizResult>('quizResults')
      .findOne(filter);
    return result;
  }

  // Get quiz result by session ID
  static async getBySessionId(sessionId: string): Promise<QuizResult | null> {
    const { db } = await connectToDatabase();
    
    return await db.collection<QuizResult>(this.COLLECTION_NAME).findOne({ sessionId });
  }

  // Get latest quiz result for user by type
  static async getLatestByUserAndType(userId: string, quizType: 'quick' | 'long'): Promise<QuizResult | null> {
    const { db } = await connectToDatabase();
    
    return await db.collection<QuizResult>(this.COLLECTION_NAME)
      .findOne(
        { userId, quizType },
        { sort: { completedAt: -1 } }
      );
  }

  // Update quiz result
  static async update(id: string | ObjectId, updates: Partial<QuizResult>): Promise<UpdateResult> {
    const { db } = await connectToDatabase();
    
    const updateDoc = {
      ...updates,
      updatedAt: new Date(),
    };

    return await db.collection<QuizResult>(this.COLLECTION_NAME).updateOne(
      { _id: typeof id === 'string' ? new ObjectId(id) : id },
      { $set: updateDoc }
    );
  }

  // Delete quiz result
  static async delete(id: string | ObjectId): Promise<DeleteResult> {
    const { db } = await connectToDatabase();
    
    return await db.collection<QuizResult>(this.COLLECTION_NAME).deleteOne({ 
      _id: typeof id === 'string' ? new ObjectId(id) : id 
    });
  }

  // Get quiz results by type
  static async getByType(quizType: 'quick' | 'long', limit: number = 50, skip: number = 0): Promise<QuizResult[]> {
    const { db } = await connectToDatabase();
    
    return await db.collection<QuizResult>(this.COLLECTION_NAME)
      .find({ quizType })
      .sort({ completedAt: -1 })
      .limit(limit)
      .skip(skip)
      .toArray();
  }

  // Get quiz statistics
  static async getStats(): Promise<{
    totalQuizzes: number;
    quickQuizzes: number;
    longQuizzes: number;
    uniqueUsers: number;
    avgCompletionTime?: number;
  }> {
    const { db } = await connectToDatabase();
    
    const stats = await db.collection<QuizResult>(this.COLLECTION_NAME).aggregate([
      {
        $group: {
          _id: null,
          totalQuizzes: { $sum: 1 },
          quickQuizzes: { 
            $sum: { $cond: [{ $eq: ['$quizType', 'quick'] }, 1, 0] } 
          },
          longQuizzes: { 
            $sum: { $cond: [{ $eq: ['$quizType', 'long'] }, 1, 0] } 
          },
          uniqueUsers: { $addToSet: '$userId' }
        }
      },
      {
        $project: {
          _id: 0,
          totalQuizzes: 1,
          quickQuizzes: 1,
          longQuizzes: 1,
          uniqueUsers: { $size: { $ifNull: ['$uniqueUsers', []] } }
        }
      }
    ]).toArray();

    const result = stats[0] as any;
    return result || {
      totalQuizzes: 0,
      quickQuizzes: 0,
      longQuizzes: 0,
      uniqueUsers: 0
    };
  }

  // Get popular career suggestions from quiz results
  static async getPopularCareers(limit: number = 10): Promise<{ career: string; count: number }[]> {
    const { db } = await connectToDatabase();
    
    const careers = await db.collection<QuizResult>(this.COLLECTION_NAME).aggregate([
      { $unwind: '$results.topCareers' },
      {
        $group: {
          _id: '$results.topCareers.career',
          count: { $sum: 1 }
        }
      },
      {
        $project: {
          _id: 0,
          career: '$_id',
          count: 1
        }
      },
      { $sort: { count: -1 } },
      { $limit: limit }
    ]).toArray();

    return careers as { career: string; count: number }[];
  }

  // Count quiz results
  static async count(filter: Partial<QuizResult> = {}): Promise<number> {
    const { db } = await connectToDatabase();
    
    return await db.collection<QuizResult>(this.COLLECTION_NAME).countDocuments(filter);
  }

  // Get quiz results by date range
  static async getByDateRange(startDate: Date, endDate: Date, limit: number = 100): Promise<QuizResult[]> {
    const { db } = await connectToDatabase();
    
    return await db.collection<QuizResult>(this.COLLECTION_NAME)
      .find({
        completedAt: {
          $gte: startDate,
          $lte: endDate
        }
      })
      .sort({ completedAt: -1 })
      .limit(limit)
      .toArray();
  }

  // Delete old quiz results (cleanup)
  static async deleteOldResults(daysOld: number = 90): Promise<DeleteResult> {
    const { db } = await connectToDatabase();
    
    const cutoffDate = new Date();
    cutoffDate.setDate(cutoffDate.getDate() - daysOld);
    
    return await db.collection<QuizResult>(this.COLLECTION_NAME).deleteMany({
      completedAt: { $lt: cutoffDate },
      userId: { $exists: false } // Only delete anonymous results
    });
  }
}