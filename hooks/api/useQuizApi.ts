import { useState, useCallback } from 'react';
import type { CareerSuggestion } from '../../types';

interface QuizApiResponse {
  success: boolean;
  cached: boolean;
  result: CareerSuggestion[] | null;
  hash?: string;
  timestamp?: string;
  error?: string;
}

interface UseQuizApiReturn {
  getSuggestions: (answers: Record<string, string>, quizType?: 'standard' | 'long', userId?: string) => Promise<CareerSuggestion[]>;
  isLoading: boolean;
  error: string | null;
  wasCached: boolean;
}

const API_BASE_URL = process.env.NODE_ENV === 'production' 
  ? '' // Use relative URLs in production
  : 'http://localhost:3001'; // Use localhost in development

export const useQuizApi = (): UseQuizApiReturn => {
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [wasCached, setWasCached] = useState(false);

  const getSuggestions = useCallback(async (
    answers: Record<string, string>,
    quizType: 'standard' | 'long' = 'standard',
    userId?: string
  ): Promise<CareerSuggestion[]> => {
    setIsLoading(true);
    setError(null);
    setWasCached(false);

    try {
      console.log('Calling quiz API with:', { answers, quizType, userId });
      
      const response = await fetch(`${API_BASE_URL}/api/quiz/generate`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          answers,
          quizType,
          userId,
        }),
      });

      if (!response.ok) {
        throw new Error(`HTTP error! status: ${response.status}`);
      }

      const data: QuizApiResponse = await response.json();
      
      if (!data.success) {
        throw new Error(data.error || 'Failed to get quiz suggestions');
      }

      setWasCached(data.cached);
      
      if (data.cached) {
        console.log('Quiz result retrieved from cache');
      } else {
        console.log('New quiz result generated and cached');
      }

      return data.result || [];
    } catch (err) {
      const errorMessage = err instanceof Error ? err.message : 'An unexpected error occurred';
      setError(errorMessage);
      console.error('Quiz API error:', err);
      throw err;
    } finally {
      setIsLoading(false);
    }
  }, []);

  return {
    getSuggestions,
    isLoading,
    error,
    wasCached,
  };
};

export default useQuizApi;