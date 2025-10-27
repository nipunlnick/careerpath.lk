import { useState, useEffect } from 'react';
import { CareerRoadmap } from '../../lib/models/types';
import * as RoadmapAPI from '../../api/roadmaps';

// Hook for managing roadmaps
export const useRoadmaps = () => {
  const [roadmaps, setRoadmaps] = useState<CareerRoadmap[]>([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  // Fetch all active roadmaps
  const fetchRoadmaps = async (limit: number = 100, skip: number = 0) => {
    setLoading(true);
    setError(null);
    
    try {
      const result = await RoadmapAPI.getAllActiveRoadmaps(limit, skip);
      if (result.success) {
        setRoadmaps(result.data);
      } else {
        setError(result.error || 'Failed to fetch roadmaps');
      }
    } catch (err) {
      setError('Failed to fetch roadmaps');
    } finally {
      setLoading(false);
    }
  };

  // Search roadmaps
  const searchRoadmaps = async (query: string, limit: number = 10) => {
    setLoading(true);
    setError(null);
    
    try {
      const result = await RoadmapAPI.searchRoadmaps(query, limit);
      if (result.success) {
        return result.data;
      } else {
        setError(result.error || 'Failed to search roadmaps');
        return [];
      }
    } catch (err) {
      setError('Failed to search roadmaps');
      return [];
    } finally {
      setLoading(false);
    }
  };

  // Get roadmaps by category  
  const getRoadmapsByCategory = async (category: string, limit: number = 20) => {
    setLoading(true);
    setError(null);
    
    try {
      const result = await RoadmapAPI.getRoadmapsByCategory(category, limit);
      if (result.success) {
        return result.data;
      } else {
        setError(result.error || 'Failed to fetch roadmaps by category');
        return [];
      }
    } catch (err) {
      setError('Failed to fetch roadmaps by category');
      return [];
    } finally {
      setLoading(false);
    }
  };

  // Fetch roadmaps on mount
  useEffect(() => {
    fetchRoadmaps();
  }, []);

  return {
    roadmaps,
    loading,
    error,
    searchRoadmaps,
    getRoadmapsByCategory,
    refetch: fetchRoadmaps
  };
};

// Hook for single roadmap
export const useRoadmap = (identifier: string, type: 'id' | 'slug' = 'slug') => {
  const [roadmap, setRoadmap] = useState<CareerRoadmap | null>(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  // Fetch roadmap
  const fetchRoadmap = async () => {
    if (!identifier) return;
    
    setLoading(true);
    setError(null);
    
    try {
      const result = type === 'id' 
        ? await RoadmapAPI.getRoadmap(identifier)
        : await RoadmapAPI.getRoadmapBySlug(identifier);
        
      if (result.success) {
        setRoadmap(result.data);
      } else {
        setError(result.error || 'Failed to fetch roadmap');
      }
    } catch (err) {
      setError('Failed to fetch roadmap');
    } finally {
      setLoading(false);
    }
  };

  // Fetch roadmap on mount and when identifier changes
  useEffect(() => {
    if (identifier) {
      fetchRoadmap();
    } else {
      setRoadmap(null);
    }
  }, [identifier, type]);

  return {
    roadmap,
    loading,
    error,
    refetch: fetchRoadmap
  };
};

// Hook for roadmap categories
export const useRoadmapCategories = () => {
  const [categories, setCategories] = useState<string[]>([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  // Fetch categories
  const fetchCategories = async () => {
    setLoading(true);
    setError(null);
    
    try {
      const result = await RoadmapAPI.getRoadmapCategories();
      if (result.success) {
        setCategories(result.data);
      } else {
        setError(result.error || 'Failed to fetch categories');
      }
    } catch (err) {
      setError('Failed to fetch categories');
    } finally {
      setLoading(false);
    }
  };

  // Fetch categories on mount
  useEffect(() => {
    fetchCategories();
  }, []);

  return {
    categories,
    loading,
    error,
    refetch: fetchCategories
  };
};