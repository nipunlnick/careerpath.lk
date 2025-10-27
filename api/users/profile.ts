import { UserProfileService } from '../../lib/models';

// API endpoint for user profile operations
export async function createUserProfile(userData: {
  userId: string;
  email: string;
  displayName?: string;
  photoURL?: string;
}) {
  try {
    const result = await UserProfileService.create(userData);
    return { success: true, data: result };
  } catch (error) {
    console.error('Error creating user profile:', error);
    return { success: false, error: 'Failed to create user profile' };
  }
}

export async function getUserProfile(userId: string) {
  try {
    const profile = await UserProfileService.getByUserId(userId);
    return { success: true, data: profile };
  } catch (error) {
    console.error('Error getting user profile:', error);
    return { success: false, error: 'Failed to get user profile' };
  }
}

export async function updateUserProfile(userId: string, updates: any) {
  try {
    const result = await UserProfileService.update(userId, updates);
    return { success: true, data: result };
  } catch (error) {
    console.error('Error updating user profile:', error);
    return { success: false, error: 'Failed to update user profile' };
  }
}

export async function updateUserPreferences(userId: string, preferences: any) {
  try {
    const result = await UserProfileService.updatePreferences(userId, preferences);
    return { success: true, data: result };
  } catch (error) {
    console.error('Error updating user preferences:', error);
    return { success: false, error: 'Failed to update user preferences' };
  }
}

export async function deleteUserProfile(userId: string) {
  try {
    const result = await UserProfileService.delete(userId);
    return { success: true, data: result };
  } catch (error) {
    console.error('Error deleting user profile:', error);
    return { success: false, error: 'Failed to delete user profile' };
  }
}

export async function upsertUserProfile(userData: any) {
  try {
    const result = await UserProfileService.upsert(userData);
    return { success: true, data: result };
  } catch (error) {
    console.error('Error upserting user profile:', error);
    return { success: false, error: 'Failed to upsert user profile' };
  }
}