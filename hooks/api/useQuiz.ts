import { useState } from 'react';
import { QuizResult } from '../../lib/models/types';
import * as QuizAPI from '../../api/quiz';

// Hook for managing quiz results
export const useQuiz = () => {
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  // Save quiz result
  const saveQuizResult = async (quizData: {
    userId?: string;
    sessionId: string;
    quizType: 'quick' | 'long';
    answers: any[];
    results: any;
  }) => {
    setLoading(true);
    setError(null);
    
    try {
      const result = await QuizAPI.saveQuizResult(quizData);
      if (result.success) {
        return { success: true, data: result.data };
      } else {
        setError(result.error || 'Failed to save quiz result');
        return { success: false, error: result.error };
      }
    } catch (err) {
      const errorMsg = 'Failed to save quiz result';
      setError(errorMsg);
      return { success: false, error: errorMsg };
    } finally {
      setLoading(false);
    }
  };

  // Get quiz result by session ID
  const getQuizResultBySession = async (sessionId: string) => {
    setLoading(true);
    setError(null);
    
    try {
      const result = await QuizAPI.getQuizResultBySession(sessionId);
      if (result.success) {
        return { success: true, data: result.data };
      } else {
        setError(result.error || 'Failed to get quiz result');
        return { success: false, error: result.error };
      }
    } catch (err) {
      const errorMsg = 'Failed to get quiz result';
      setError(errorMsg);
      return { success: false, error: errorMsg };
    } finally {
      setLoading(false);
    }
  };

  // Get user's quiz results
  const getUserQuizResults = async (userId: string, limit: number = 10) => {
    setLoading(true);
    setError(null);
    
    try {
      const result = await QuizAPI.getUserQuizResults(userId, limit);
      if (result.success) {
        return { success: true, data: result.data };
      } else {
        setError(result.error || 'Failed to get quiz results');
        return { success: false, error: result.error };
      }
    } catch (err) {
      const errorMsg = 'Failed to get quiz results';
      setError(errorMsg);
      return { success: false, error: errorMsg };
    } finally {
      setLoading(false);
    }
  };

  // Get latest quiz result for user
  const getLatestUserQuizResult = async (userId: string, quizType: 'quick' | 'long') => {
    setLoading(true);
    setError(null);
    
    try {
      const result = await QuizAPI.getLatestUserQuizResult(userId, quizType);
      if (result.success) {
        return { success: true, data: result.data };
      } else {
        setError(result.error || 'Failed to get latest quiz result');
        return { success: false, error: result.error };
      }
    } catch (err) {
      const errorMsg = 'Failed to get latest quiz result';
      setError(errorMsg);
      return { success: false, error: errorMsg };
    } finally {
      setLoading(false);
    }
  };

  return {
    loading,
    error,
    saveQuizResult,
    getQuizResultBySession,
    getUserQuizResults,
    getLatestUserQuizResult
  };
};

// Hook for quiz statistics
export const useQuizStats = () => {
  const [stats, setStats] = useState<any>(null);
  const [popularCareers, setPopularCareers] = useState<{ career: string; count: number }[]>([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  // Fetch quiz statistics
  const fetchStats = async () => {
    setLoading(true);
    setError(null);
    
    try {
      const result = await QuizAPI.getQuizStats();
      if (result.success) {
        setStats(result.data);
      } else {
        setError(result.error || 'Failed to fetch quiz stats');
      }
    } catch (err) {
      setError('Failed to fetch quiz stats');
    } finally {
      setLoading(false);
    }
  };

  // Fetch popular careers
  const fetchPopularCareers = async (limit: number = 10) => {
    setLoading(true);
    setError(null);
    
    try {
      const result = await QuizAPI.getPopularCareers(limit);
      if (result.success) {
        setPopularCareers(result.data);
      } else {
        setError(result.error || 'Failed to fetch popular careers');
      }
    } catch (err) {
      setError('Failed to fetch popular careers');
    } finally {
      setLoading(false);
    }
  };

  return {
    stats,
    popularCareers,
    loading,
    error,
    fetchStats,
    fetchPopularCareers
  };
};