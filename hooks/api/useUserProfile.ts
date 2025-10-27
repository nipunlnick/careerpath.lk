import { useState, useEffect } from 'react';
import { UserProfile } from '../../lib/models/types';
import * as UserAPI from '../../api/users/profile';

// Hook for managing user profile
export const useUserProfile = (userId: string | undefined) => {
  const [profile, setProfile] = useState<UserProfile | null>(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  // Fetch user profile
  const fetchProfile = async () => {
    if (!userId) return;
    
    setLoading(true);
    setError(null);
    
    try {
      const result = await UserAPI.getUserProfile(userId);
      if (result.success) {
        setProfile(result.data);
      } else {
        setError(result.error || 'Failed to fetch profile');
      }
    } catch (err) {
      setError('Failed to fetch profile');
    } finally {
      setLoading(false);
    }
  };

  // Update profile
  const updateProfile = async (updates: Partial<UserProfile>) => {
    if (!userId) return { success: false, error: 'No user ID' };
    
    setLoading(true);
    setError(null);
    
    try {
      const result = await UserAPI.updateUserProfile(userId, updates);
      if (result.success) {
        // Refresh profile data
        await fetchProfile();
        return { success: true };
      } else {
        setError(result.error || 'Failed to update profile');
        return { success: false, error: result.error };
      }
    } catch (err) {
      const errorMsg = 'Failed to update profile';
      setError(errorMsg);
      return { success: false, error: errorMsg };
    } finally {
      setLoading(false);
    }
  };

  // Update preferences
  const updatePreferences = async (preferences: UserProfile['preferences']) => {
    if (!userId) return { success: false, error: 'No user ID' };
    
    setLoading(true);
    setError(null);
    
    try {
      const result = await UserAPI.updateUserPreferences(userId, preferences);
      if (result.success) {
        // Update local state
        setProfile(prev => prev ? { ...prev, preferences } : null);
        return { success: true };
      } else {
        setError(result.error || 'Failed to update preferences');
        return { success: false, error: result.error };
      }
    } catch (err) {
      const errorMsg = 'Failed to update preferences';
      setError(errorMsg);
      return { success: false, error: errorMsg };
    } finally {
      setLoading(false);
    }
  };

  // Create or update profile (upsert)
  const upsertProfile = async (profileData: Omit<UserProfile, '_id' | 'createdAt' | 'updatedAt'>) => {
    setLoading(true);
    setError(null);
    
    try {
      const result = await UserAPI.upsertUserProfile(profileData);
      if (result.success) {
        await fetchProfile();
        return { success: true };
      } else {
        setError(result.error || 'Failed to save profile');
        return { success: false, error: result.error };
      }
    } catch (err) {
      const errorMsg = 'Failed to save profile';
      setError(errorMsg);
      return { success: false, error: errorMsg };
    } finally {
      setLoading(false);
    }
  };

  // Delete profile
  const deleteProfile = async () => {
    if (!userId) return { success: false, error: 'No user ID' };
    
    setLoading(true);
    setError(null);
    
    try {
      const result = await UserAPI.deleteUserProfile(userId);
      if (result.success) {
        setProfile(null);
        return { success: true };
      } else {
        setError(result.error || 'Failed to delete profile');
        return { success: false, error: result.error };
      }
    } catch (err) {
      const errorMsg = 'Failed to delete profile';
      setError(errorMsg);
      return { success: false, error: errorMsg };
    } finally {
      setLoading(false);
    }
  };

  // Fetch profile on mount and when userId changes
  useEffect(() => {
    if (userId) {
      fetchProfile();
    } else {
      setProfile(null);
    }
  }, [userId]);

  return {
    profile,
    loading,
    error,
    updateProfile,
    updatePreferences,
    upsertProfile,
    deleteProfile,
    refetch: fetchProfile
  };
};