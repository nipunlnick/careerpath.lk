import { useState, useCallback } from 'react';
import type { CareerSuggestion } from '../../types';

interface QuizApiResponse {
  success: boolean;
  cached: boolean;
  result: CareerSuggestion[] | null;
  hash?: string;
  timestamp?: string;
  error?: string;
  source?: 'database' | 'local-patterns' | 'fallback' | 'api';
}

interface UseLocalQuizApiReturn {
  getSuggestions: (answers: Record<string, string>, quizType?: 'standard' | 'long', userId?: string) => Promise<CareerSuggestion[]>;
  isLoading: boolean;
  error: string | null;
  wasCached: boolean;
  source: 'database' | 'local-patterns' | 'fallback' | 'api' | null;
}

const API_BASE_URL = process.env.NODE_ENV === 'production' 
  ? '' // Use relative URLs in production
  : 'http://localhost:3001'; // Use localhost in development

export const useLocalQuizApi = (): UseLocalQuizApiReturn => {
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [wasCached, setWasCached] = useState(false);
  const [source, setSource] = useState<'database' | 'local-patterns' | 'fallback' | 'api' | null>(null);

  const getSuggestions = useCallback(async (
    answers: Record<string, string>,
    quizType: 'standard' | 'long' = 'standard',
    userId?: string
  ): Promise<CareerSuggestion[]> => {
    setIsLoading(true);
    setError(null);
    setWasCached(false);
    setSource(null);

    try {
      console.log('Calling local quiz API with:', { answers, quizType, userId });
      
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
      setSource(data.source || 'api');
      
      if (data.cached) {
        console.log('Quiz result retrieved from cache');
      } else {
        console.log(`New quiz result generated using ${data.source || 'unknown source'}`);
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
    source,
  };
};

export default useLocalQuizApi;