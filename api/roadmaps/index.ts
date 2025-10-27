import { CareerRoadmapService } from '../../lib/models';

// API endpoints for career roadmap operations
export async function createRoadmap(roadmapData: any) {
  try {
    const result = await CareerRoadmapService.create(roadmapData);
    return { success: true, data: result };
  } catch (error) {
    console.error('Error creating roadmap:', error);
    return { success: false, error: 'Failed to create roadmap' };
  }
}

export async function getRoadmap(id: string) {
  try {
    const roadmap = await CareerRoadmapService.getById(id);
    return { success: true, data: roadmap };
  } catch (error) {
    console.error('Error getting roadmap:', error);
    return { success: false, error: 'Failed to get roadmap' };
  }
}

export async function getRoadmapBySlug(slug: string) {
  try {
    const roadmap = await CareerRoadmapService.getBySlug(slug);
    return { success: true, data: roadmap };
  } catch (error) {
    console.error('Error getting roadmap by slug:', error);
    return { success: false, error: 'Failed to get roadmap' };
  }
}

export async function searchRoadmaps(query: string, limit: number = 10) {
  try {
    const roadmaps = await CareerRoadmapService.search(query, limit);
    return { success: true, data: roadmaps };
  } catch (error) {
    console.error('Error searching roadmaps:', error);
    return { success: false, error: 'Failed to search roadmaps' };
  }
}

export async function getRoadmapsByCategory(category: string, limit: number = 20) {
  try {
    const roadmaps = await CareerRoadmapService.getByCategory(category, limit);
    return { success: true, data: roadmaps };
  } catch (error) {
    console.error('Error getting roadmaps by category:', error);
    return { success: false, error: 'Failed to get roadmaps by category' };
  }
}

export async function getAllActiveRoadmaps(limit: number = 100, skip: number = 0) {
  try {
    const roadmaps = await CareerRoadmapService.getAllActive(limit, skip);
    return { success: true, data: roadmaps };
  } catch (error) {
    console.error('Error getting all active roadmaps:', error);
    return { success: false, error: 'Failed to get roadmaps' };
  }
}

export async function updateRoadmap(id: string, updates: any) {
  try {
    const result = await CareerRoadmapService.update(id, updates);
    return { success: true, data: result };
  } catch (error) {
    console.error('Error updating roadmap:', error);
    return { success: false, error: 'Failed to update roadmap' };
  }
}

export async function updateRoadmapSteps(id: string, steps: any[]) {
  try {
    const result = await CareerRoadmapService.updateSteps(id, steps);
    return { success: true, data: result };
  } catch (error) {
    console.error('Error updating roadmap steps:', error);
    return { success: false, error: 'Failed to update roadmap steps' };
  }
}

export async function updateMarketInsights(id: string, insights: any) {
  try {
    const result = await CareerRoadmapService.updateMarketInsights(id, insights);
    return { success: true, data: result };
  } catch (error) {
    console.error('Error updating market insights:', error);
    return { success: false, error: 'Failed to update market insights' };
  }
}

export async function deleteRoadmap(id: string) {
  try {
    const result = await CareerRoadmapService.delete(id);
    return { success: true, data: result };
  } catch (error) {
    console.error('Error deleting roadmap:', error);
    return { success: false, error: 'Failed to delete roadmap' };
  }
}

export async function toggleRoadmapActive(id: string) {
  try {
    const result = await CareerRoadmapService.toggleActive(id);
    return { success: true, data: result };
  } catch (error) {
    console.error('Error toggling roadmap active status:', error);
    return { success: false, error: 'Failed to toggle roadmap status' };
  }
}

export async function getRoadmapCategories() {
  try {
    const categories = await CareerRoadmapService.getCategories();
    return { success: true, data: categories };
  } catch (error) {
    console.error('Error getting roadmap categories:', error);
    return { success: false, error: 'Failed to get categories' };
  }
}

export async function getRoadmapTags() {
  try {
    const tags = await CareerRoadmapService.getTags();
    return { success: true, data: tags };
  } catch (error) {
    console.error('Error getting roadmap tags:', error);
    return { success: false, error: 'Failed to get tags' };
  }
}