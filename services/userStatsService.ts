interface UserStatistics {
  quizzesTaken: number;
  roadmapsSaved: number;
  totalCareerExplorations: number;
  accountAgeInDays: number;
  lastQuizDate?: Date;
  completionRate: number;
  favoriteCategory?: string;
}

interface UserActivity {
  type: 'quiz' | 'roadmap_save' | 'roadmap_view';
  title: string;
  description: string;
  date: Date;
  icon: string;
  metadata?: any;
}

export class UserStatsService {
  private static readonly BASE_URL = '/api/user-stats';

  /**
   * Fetch comprehensive user statistics
   */
  static async getUserStatistics(userId: string): Promise<UserStatistics> {
    try {
      // Fetch quiz history
      const quizResponse = await fetch(`${this.BASE_URL}/${userId}/quiz-history`);
      if (!quizResponse.ok) {
        throw new Error(`Failed to fetch quiz history: ${quizResponse.status}`);
      }
      const quizData = await quizResponse.json();

      // Fetch saved roadmaps
      const roadmapsResponse = await fetch(`/api/saved-roadmaps/${userId}`);
      if (!roadmapsResponse.ok) {
        throw new Error(`Failed to fetch saved roadmaps: ${roadmapsResponse.status}`);
      }
      const roadmapsData = await roadmapsResponse.json();

      // Validate response structure
      if (!quizData.success || !roadmapsData.success) {
        throw new Error('Invalid response format from server');
      }

      const quizHistory = Array.isArray(quizData.data) ? quizData.data : [];
      const savedRoadmaps = Array.isArray(roadmapsData.data) ? roadmapsData.data : [];

      // Calculate statistics
      const stats: UserStatistics = {
        quizzesTaken: quizHistory.length,
        roadmapsSaved: savedRoadmaps.length,
        totalCareerExplorations: quizHistory.length + savedRoadmaps.length,
        accountAgeInDays: 0, // Will be calculated by the hook with user creation time
        lastQuizDate: this.getLastQuizDate(quizHistory),
        completionRate: this.calculateEngagementRate(savedRoadmaps),
        favoriteCategory: this.calculateFavoriteCategory(quizHistory, savedRoadmaps)
      };

      return stats;
    } catch (error) {
      console.error('Error fetching user statistics:', error);
      throw error;
    }
  }

  /**
   * Fetch recent user activity
   */
  static async getRecentActivity(userId: string, limit: number = 10): Promise<UserActivity[]> {
    try {
      const response = await fetch(`${this.BASE_URL}/${userId}/recent-activity?limit=${limit}`);
      
      if (!response.ok) {
        throw new Error(`Failed to fetch recent activity: ${response.status}`);
      }

      const data = await response.json();
      
      if (!data.success) {
        throw new Error('Invalid response format for recent activity');
      }

      // Transform and validate activity data
      const activities = Array.isArray(data.data) ? data.data : [];
      
      return activities.map(activity => ({
        type: activity.type || 'unknown',
        title: activity.title || 'Unknown Activity',
        description: activity.description || '',
        date: new Date(activity.date),
        icon: activity.icon || 'Activity',
        metadata: activity.metadata
      }));
    } catch (error) {
      console.error('Error fetching recent activity:', error);
      throw error;
    }
  }

  /**
   * Calculate account age in days
   */
  static calculateAccountAge(creationTime: string | number): number {
    const accountCreationDate = new Date(creationTime);
    const ageInDays = Math.floor((Date.now() - accountCreationDate.getTime()) / (1000 * 60 * 60 * 24));
    return Math.max(0, ageInDays);
  }

  /**
   * Get the most recent quiz completion date
   */
  private static getLastQuizDate(quizHistory: any[]): Date | undefined {
    if (quizHistory.length === 0) return undefined;
    
    const sortedHistory = quizHistory
      .filter(quiz => quiz.createdAt)
      .sort((a, b) => new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime());
    
    return sortedHistory.length > 0 ? new Date(sortedHistory[0].createdAt) : undefined;
  }

  /**
   * Calculate engagement rate based on roadmaps with notes
   */
  private static calculateEngagementRate(savedRoadmaps: any[]): number {
    if (savedRoadmaps.length === 0) return 0;
    
    const engagedRoadmaps = savedRoadmaps.filter(roadmap => 
      roadmap.notes && roadmap.notes.trim().length > 0
    );
    
    return Math.round((engagedRoadmaps.length / savedRoadmaps.length) * 100);
  }

  /**
   * Determine user's favorite career category
   */
  private static calculateFavoriteCategory(quizHistory: any[], savedRoadmaps: any[]): string | undefined {
    const categoryCount: Record<string, number> = {};
    
    // Count categories from quiz results
    quizHistory.forEach(quiz => {
      if (quiz.result && Array.isArray(quiz.result)) {
        quiz.result.forEach((career: any) => {
          if (career.category) {
            categoryCount[career.category] = (categoryCount[career.category] || 0) + 1;
          }
        });
      }
    });
    
    // Count categories from saved roadmaps (if category data is available)
    savedRoadmaps.forEach(roadmap => {
      if (roadmap.category) {
        categoryCount[roadmap.category] = (categoryCount[roadmap.category] || 0) + 1;
      }
    });
    
    // Return the most frequent category
    const entries = Object.entries(categoryCount);
    if (entries.length === 0) return undefined;
    
    const [favoriteCategory] = entries.reduce((a, b) => a[1] > b[1] ? a : b);
    return favoriteCategory;
  }

  /**
   * Format account age for display
   */
  static formatAccountAge(days: number): string {
    if (days < 1) return 'Today';
    if (days === 1) return '1 day';
    if (days < 7) return `${days} days`;
    if (days < 30) {
      const weeks = Math.floor(days / 7);
      return weeks === 1 ? '1 week' : `${weeks} weeks`;
    }
    if (days < 365) {
      const months = Math.floor(days / 30);
      return months === 1 ? '1 month' : `${months} months`;
    }
    const years = Math.floor(days / 365);
    return years === 1 ? '1 year' : `${years} years`;
  }
}