import { useState, useEffect } from 'react';
import { useAuth } from '../../contexts/AuthContext';
import { UserStatsService } from '../../services/userStatsService';

interface UserStats {
  quizzesTaken: number;
  roadmapsSaved: number;
  totalCareerExplorations: number;
  accountAge: number; // in days
  lastQuizDate?: Date;
  favoriteCategory?: string;
  completionRate: number;
}

export const useUserStats = () => {
  const { currentUser } = useAuth();
  const [stats, setStats] = useState<UserStats>({
    quizzesTaken: 0,
    roadmapsSaved: 0,
    totalCareerExplorations: 0,
    accountAge: 0,
    completionRate: 0
  });
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    const fetchUserStats = async () => {
      if (!currentUser) {
        setIsLoading(false);
        return;
      }

      try {
        setIsLoading(true);
        setError(null);
        
        // Use the UserStatsService to fetch statistics
        const userStats = await UserStatsService.getUserStatistics(currentUser.uid);
        
        // Calculate account age using user metadata
        const accountAge = UserStatsService.calculateAccountAge(
          currentUser.metadata.creationTime || Date.now()
        );
        
        const stats: UserStats = {
          ...userStats,
          accountAge
        };

        setStats(stats);
      } catch (err) {
        console.error('Error fetching user stats:', err);
        const errorMessage = err instanceof Error ? err.message : 'Failed to load user statistics';
        setError(errorMessage);
        
        // Set default stats on error to prevent UI breaks
        setStats({
          quizzesTaken: 0,
          roadmapsSaved: 0,
          totalCareerExplorations: 0,
          accountAge: 0,
          completionRate: 0
        });
      } finally {
        setIsLoading(false);
      }
    };

    fetchUserStats();
  }, [currentUser]);

  return { 
    stats, 
    isLoading, 
    error,
    // Utility function for formatting account age
    formatAccountAge: (days: number) => UserStatsService.formatAccountAge(days)
  };
};