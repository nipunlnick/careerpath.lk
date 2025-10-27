import { Db, ObjectId, InsertOneResult, UpdateResult, DeleteResult } from 'mongodb';
import connectToDatabase from '../mongodb';
import { UserActivity } from './types';

export class UserActivityService {
  private static COLLECTION_NAME = 'userActivities';

  // Log user activity
  static async log(activity: Omit<UserActivity, '_id' | 'createdAt' | 'updatedAt' | 'timestamp'>): Promise<InsertOneResult<UserActivity>> {
    const { db } = await connectToDatabase();
    
    const newActivity: UserActivity = {
      ...activity,
      timestamp: new Date(),
      createdAt: new Date(),
      updatedAt: new Date(),
    };

    return await db.collection<UserActivity>(this.COLLECTION_NAME).insertOne(newActivity);
  }

  // Get activities by user ID
  static async getByUserId(userId: string, limit: number = 50): Promise<UserActivity[]> {
    const { db } = await connectToDatabase();
    
    return await db.collection<UserActivity>(this.COLLECTION_NAME)
      .find({ userId })
      .sort({ timestamp: -1 })
      .limit(limit)
      .toArray();
  }

  // Get activities by session ID
  static async getBySessionId(sessionId: string, limit: number = 100): Promise<UserActivity[]> {
    const { db } = await connectToDatabase();
    
    return await db.collection<UserActivity>(this.COLLECTION_NAME)
      .find({ sessionId })
      .sort({ timestamp: -1 })
      .limit(limit)
      .toArray();
  }

  // Get activities by action type
  static async getByAction(action: string, limit: number = 100, skip: number = 0): Promise<UserActivity[]> {
    const { db } = await connectToDatabase();
    
    return await db.collection<UserActivity>(this.COLLECTION_NAME)
      .find({ action })
      .sort({ timestamp: -1 })
      .limit(limit)
      .skip(skip)
      .toArray();
  }

  // Get activities by date range
  static async getByDateRange(startDate: Date, endDate: Date, limit: number = 1000): Promise<UserActivity[]> {
    const { db } = await connectToDatabase();
    
    return await db.collection<UserActivity>(this.COLLECTION_NAME)
      .find({
        timestamp: {
          $gte: startDate,
          $lte: endDate
        }
      })
      .sort({ timestamp: -1 })
      .limit(limit)
      .toArray();
  }

  // Get activity statistics
  static async getStats(startDate?: Date, endDate?: Date): Promise<{
    totalActivities: number;
    uniqueUsers: number;
    uniqueSessions: number;
    topActions: { action: string; count: number }[];
    topResources: { resource: string; count: number }[];
  }> {
    const { db } = await connectToDatabase();
    
    const matchFilter: any = {};
    if (startDate && endDate) {
      matchFilter.timestamp = { $gte: startDate, $lte: endDate };
    }

    const stats = await db.collection<UserActivity>(this.COLLECTION_NAME).aggregate([
      ...(Object.keys(matchFilter).length > 0 ? [{ $match: matchFilter }] : []),
      {
        $group: {
          _id: null,
          totalActivities: { $sum: 1 },
          uniqueUsers: { $addToSet: '$userId' },
          uniqueSessions: { $addToSet: '$sessionId' },
          actions: { $push: '$action' },
          resources: { $push: '$resource' }
        }
      },
      {
        $project: {
          _id: 0,
          totalActivities: 1,
          uniqueUsers: { $size: { $ifNull: ['$uniqueUsers', []] } },
          uniqueSessions: { $size: { $ifNull: ['$uniqueSessions', []] } },
          actions: 1,
          resources: 1
        }
      }
    ]).toArray();

    const result = stats[0] as any;
    
    if (!result) {
      return {
        totalActivities: 0,
        uniqueUsers: 0,
        uniqueSessions: 0,
        topActions: [],
        topResources: []
      };
    }

    // Get top actions
    const actionCounts: { [key: string]: number } = {};
    result.actions.forEach((action: string) => {
      actionCounts[action] = (actionCounts[action] || 0) + 1;
    });
    
    const topActions = Object.entries(actionCounts)
      .map(([action, count]) => ({ action, count: count as number }))
      .sort((a, b) => b.count - a.count)
      .slice(0, 10);

    // Get top resources
    const resourceCounts: { [key: string]: number } = {};
    result.resources.forEach((resource: string) => {
      resourceCounts[resource] = (resourceCounts[resource] || 0) + 1;
    });
    
    const topResources = Object.entries(resourceCounts)
      .map(([resource, count]) => ({ resource, count: count as number }))
      .sort((a, b) => b.count - a.count)
      .slice(0, 10);

    return {
      totalActivities: result.totalActivities,
      uniqueUsers: result.uniqueUsers,
      uniqueSessions: result.uniqueSessions,
      topActions,
      topResources
    };
  }

  // Get daily activity counts
  static async getDailyStats(days: number = 30): Promise<{ date: string; count: number }[]> {
    const { db } = await connectToDatabase();
    
    const startDate = new Date();
    startDate.setDate(startDate.getDate() - days);

    const dailyStats = await db.collection<UserActivity>(this.COLLECTION_NAME).aggregate([
      {
        $match: {
          timestamp: { $gte: startDate }
        }
      },
      {
        $group: {
          _id: {
            year: { $year: '$timestamp' },
            month: { $month: '$timestamp' },
            day: { $dayOfMonth: '$timestamp' }
          },
          count: { $sum: 1 }
        }
      },
      {
        $project: {
          _id: 0,
          date: {
            $dateToString: {
              format: '%Y-%m-%d',
              date: {
                $dateFromParts: {
                  year: '$_id.year',
                  month: '$_id.month',
                  day: '$_id.day'
                }
              }
            }
          },
          count: 1
        }
      },
      { $sort: { date: 1 } }
    ]).toArray();

    return dailyStats as { date: string; count: number }[];
  }

  // Track page view
  static async trackPageView(userId: string | undefined, sessionId: string, resource: string, metadata?: any): Promise<InsertOneResult<UserActivity>> {
    return await this.log({
      userId,
      sessionId,
      action: 'page_view',
      resource,
      metadata
    });
  }

  // Track quiz completion
  static async trackQuizCompletion(userId: string | undefined, sessionId: string, quizType: string, metadata?: any): Promise<InsertOneResult<UserActivity>> {
    return await this.log({
      userId,
      sessionId,
      action: 'quiz_completed',
      resource: `quiz_${quizType}`,
      metadata
    });
  }

  // Track roadmap view
  static async trackRoadmapView(userId: string | undefined, sessionId: string, roadmapSlug: string, metadata?: any): Promise<InsertOneResult<UserActivity>> {
    return await this.log({
      userId,
      sessionId,
      action: 'roadmap_view',
      resource: `roadmap_${roadmapSlug}`,
      metadata
    });
  }

  // Track roadmap save
  static async trackRoadmapSave(userId: string, sessionId: string, roadmapSlug: string, metadata?: any): Promise<InsertOneResult<UserActivity>> {
    return await this.log({
      userId,
      sessionId,
      action: 'roadmap_saved',
      resource: `roadmap_${roadmapSlug}`,
      metadata
    });
  }

  // Delete old activities (cleanup)
  static async deleteOldActivities(daysOld: number = 180): Promise<DeleteResult> {
    const { db } = await connectToDatabase();
    
    const cutoffDate = new Date();
    cutoffDate.setDate(cutoffDate.getDate() - daysOld);
    
    return await db.collection<UserActivity>(this.COLLECTION_NAME).deleteMany({
      timestamp: { $lt: cutoffDate }
    });
  }

  // Count activities
  static async count(filter: Partial<UserActivity> = {}): Promise<number> {
    const { db } = await connectToDatabase();
    
    return await db.collection<UserActivity>(this.COLLECTION_NAME).countDocuments(filter);
  }

  // Delete all activities for a user (GDPR compliance)
  static async deleteAllForUser(userId: string): Promise<DeleteResult> {
    const { db } = await connectToDatabase();
    
    return await db.collection<UserActivity>(this.COLLECTION_NAME).deleteMany({ userId });
  }
}