import { useState, useEffect } from 'react';
import { useAuth } from '../../contexts/AuthContext';

interface SavedRoadmap {
  _id?: string;
  userId: string;
  roadmapSlug: string;
  roadmapName: string;
  roadmapData?: any;
  savedAt: Date;
  notes?: string;
  tags?: string[];
}

export const useSavedRoadmaps = () => {
  const [savedRoadmaps, setSavedRoadmaps] = useState<SavedRoadmap[]>([]);
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const { currentUser } = useAuth();

  const apiUrl = process.env.NEXT_PUBLIC_API_URL || '';

  const fetchSavedRoadmaps = async () => {
    if (!currentUser) return;

    setIsLoading(true);
    setError(null);

    try {
      const response = await fetch(`${apiUrl}/api/saved-roadmaps/${currentUser.uid}`);
      const result = await response.json();

      if (result.success) {
        setSavedRoadmaps(result.data);
      } else {
        setError(result.error || 'Failed to fetch saved roadmaps');
      }
    } catch (err) {
      setError('Network error occurred');
      console.error('Error fetching saved roadmaps:', err);
    } finally {
      setIsLoading(false);
    }
  };

  const saveRoadmap = async (roadmapSlug: string, roadmapName: string, roadmapData?: any, notes?: string) => {
    if (!currentUser) {
      setError('You must be logged in to save roadmaps');
      return false;
    }

    try {
      const response = await fetch(`${apiUrl}/api/saved-roadmaps`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          userId: currentUser.uid,
          roadmapSlug,
          roadmapName,
          roadmapData,
          notes
        }),
      });

      const result = await response.json();

      if (result.success) {
        // Refresh the list
        await fetchSavedRoadmaps();
        return true;
      } else {
        setError(result.error || 'Failed to save roadmap');
        return false;
      }
    } catch (err) {
      setError('Network error occurred');
      console.error('Error saving roadmap:', err);
      return false;
    }
  };

  const unsaveRoadmap = async (roadmapSlug: string) => {
    if (!currentUser) {
      setError('You must be logged in to unsave roadmaps');
      return false;
    }

    try {
      const response = await fetch(`${apiUrl}/api/saved-roadmaps`, {
        method: 'DELETE',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          userId: currentUser.uid,
          roadmapSlug
        }),
      });

      const result = await response.json();

      if (result.success) {
        // Refresh the list
        await fetchSavedRoadmaps();
        return true;
      } else {
        setError(result.error || 'Failed to unsave roadmap');
        return false;
      }
    } catch (err) {
      setError('Network error occurred');
      console.error('Error unsaving roadmap:', err);
      return false;
    }
  };

  const checkIsRoadmapSaved = async (roadmapSlug: string): Promise<boolean> => {
    if (!currentUser) return false;

    try {
      const response = await fetch(`${apiUrl}/api/saved-roadmaps/${currentUser.uid}/${roadmapSlug}`);
      const result = await response.json();

      return result.success ? result.data.isSaved : false;
    } catch (err) {
      console.error('Error checking if roadmap is saved:', err);
      return false;
    }
  };

  const updateNotes = async (roadmapSlug: string, notes: string) => {
    if (!currentUser) {
      setError('You must be logged in to update notes');
      return false;
    }

    try {
      const response = await fetch(`${apiUrl}/api/saved-roadmaps/notes`, {
        method: 'PATCH',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          userId: currentUser.uid,
          roadmapSlug,
          notes
        }),
      });

      const result = await response.json();

      if (result.success) {
        // Refresh the list
        await fetchSavedRoadmaps();
        return true;
      } else {
        setError(result.error || 'Failed to update notes');
        return false;
      }
    } catch (err) {
      setError('Network error occurred');
      console.error('Error updating notes:', err);
      return false;
    }
  };

  useEffect(() => {
    if (currentUser) {
      fetchSavedRoadmaps();
    }
  }, [currentUser]);

  return {
    savedRoadmaps,
    isLoading,
    error,
    saveRoadmap,
    unsaveRoadmap,
    checkIsRoadmapSaved,
    updateNotes,
    refreshSavedRoadmaps: fetchSavedRoadmaps,
    clearError: () => setError(null)
  };
};