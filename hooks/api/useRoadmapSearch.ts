import { useState, useCallback } from 'react';
import type { RoadmapStep, MarketInsights } from '../../types';

interface RoadmapSearchResponse {
  success: boolean;
  data: {
    _id?: string;
    name: string;
    slug: string;
    description: string;
    steps: RoadmapStep[];
    marketInsights?: MarketInsights;
    category: string;
    difficulty: string;
    estimatedDuration: string;
    tags: string[];
    isActive: boolean;
    createdAt?: string;
    updatedAt?: string;
  } | null;
  cached: boolean;
  searchTerm: string;
  slug: string;
  generated?: boolean;
  similarResults?: any[];
  error?: string;
}

interface UseRoadmapSearchReturn {
  searchRoadmap: (searchTerm: string, userId?: string) => Promise<RoadmapSearchResponse>;
  isLoading: boolean;
  error: string | null;
  wasGenerated: boolean;
  wasCached: boolean;
}

const API_BASE_URL = process.env.NODE_ENV === 'production' 
  ? '' // Use relative URLs in production
  : 'http://localhost:3001'; // Use localhost in development

export const useRoadmapSearch = (): UseRoadmapSearchReturn => {
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [wasGenerated, setWasGenerated] = useState(false);
  const [wasCached, setWasCached] = useState(false);

  const searchRoadmap = useCallback(async (
    searchTerm: string,
    userId?: string
  ): Promise<RoadmapSearchResponse> => {
    setIsLoading(true);
    setError(null);
    setWasGenerated(false);
    setWasCached(false);

    try {
      console.log('Searching for roadmap:', searchTerm);
      
      const response = await fetch(`${API_BASE_URL}/api/roadmaps/search`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          searchTerm,
          userId,
        }),
      });

      if (!response.ok) {
        throw new Error(`HTTP error! status: ${response.status}`);
      }

      const data: RoadmapSearchResponse = await response.json();
      
      if (!data.success) {
        throw new Error(data.error || 'Failed to search roadmap');
      }

      setWasCached(data.cached);
      setWasGenerated(data.generated || false);
      
      if (data.cached) {
        console.log('Roadmap retrieved from cache');
      } else if (data.generated) {
        console.log('New roadmap generated and cached');
      }

      return data;
    } catch (err) {
      const errorMessage = err instanceof Error ? err.message : 'An unexpected error occurred';
      setError(errorMessage);
      console.error('Roadmap search error:', err);
      throw err;
    } finally {
      setIsLoading(false);
    }
  }, []);

  return {
    searchRoadmap,
    isLoading,
    error,
    wasGenerated,
    wasCached,
  };
};

export default useRoadmapSearch;