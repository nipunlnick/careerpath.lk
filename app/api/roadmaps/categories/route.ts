import { NextResponse } from 'next/server';
import { CareerRoadmapService } from '@/lib/models/CareerRoadmap';
import { EXPLORE_CAREERS, KEYWORD_MAPPINGS } from '@/constants/careers';
import type { CareerCategory, Career } from '@/types';

export async function GET() {
  try {
    // Fetch all active roadmaps from the database
    const activeRoadmaps = await CareerRoadmapService.getAllActive(1000); // Fetch a reasonable limit

    // Create a map of the static categories for easy lookup and merging
    const categoryMap = new Map<string, CareerCategory>();
    const slugToCategoryMap = new Map<string, string>();
    const nameToCategoryMap = new Map<string, string>();
    
    // Initialize with static data and build lookup maps
    EXPLORE_CAREERS.forEach(category => {
      categoryMap.set(category.name, { ...category, careers: [...category.careers] });
      
      category.careers.forEach(career => {
        if (career.path) {
          slugToCategoryMap.set(career.path, category.name);
        }
        // Map the exact name
        nameToCategoryMap.set(career.name.toLowerCase(), category.name);
        
        // Also map individual parts if the name contains slashes (e.g. "Software Engineer / Developer")
        if (career.name.includes('/')) {
          const parts = career.name.split('/').map(p => p.trim().toLowerCase());
          parts.forEach(part => {
             if (part) nameToCategoryMap.set(part, category.name);
          });
        }
      });
    });

    // Merge dynamic roadmaps
    activeRoadmaps.forEach(roadmap => {
      let categoryName = roadmap.category;
      
      // If the explicit category is missing or doesn't exist in our static map, try to infer it
      if (!categoryName || !categoryMap.has(categoryName)) {
        // 1. Try to find by slug (most reliable)
        if (roadmap.slug && slugToCategoryMap.has(roadmap.slug)) {
          categoryName = slugToCategoryMap.get(roadmap.slug);
        }
        // 2. Try to find by name
        else if (roadmap.name && nameToCategoryMap.has(roadmap.name.toLowerCase())) {
          categoryName = nameToCategoryMap.get(roadmap.name.toLowerCase());
        }
        // 3. Fallback to Community Generated
        else {
          categoryName = 'Community Generated';
        }
      }

      // Explicitly remap known invalid/legacy categories OR try to infer from name
      if (
        !categoryName ||
        categoryName === 'Quiz Generated' || 
        categoryName === 'Search Generated' || 
        categoryName === 'Quiz genarated' ||
        categoryName === 'Community Generated'
      ) {
         // Try to infer from name using keywords
         let found = false;
         const nameLower = roadmap.name.toLowerCase();
         
         for (const [catName, keywords] of Object.entries(KEYWORD_MAPPINGS)) {
           if (keywords.some(k => nameLower.includes(k))) {
             categoryName = catName;
             found = true;
             break;
           }
         }
         
         if (!found) {
            categoryName = 'Community Generated';
         }
      }
      
      // Ensure the target category exists (for Community Generated)
      if (categoryName === 'Community Generated' && !categoryMap.has(categoryName)) {
         categoryMap.set(categoryName, {
           name: 'Community Generated',
           icon: 'Globe', // Default icon
           careers: []
         });
      }

      // Get the category (it should exist now, either standard or Community Generated)
      const category = categoryMap.get(categoryName!);
      
      if (category) {
        // Check if this career is already in the list (by path or name) to avoid duplicates
        const exists = category.careers.some(c => c.path === roadmap.slug || c.name === roadmap.name);
        
        if (!exists) {
          category.careers.push({
            name: roadmap.name,
            path: roadmap.slug
          });
        }
      }
    });

    // Convert map back to array
    const mergedCategories = Array.from(categoryMap.values());

    return NextResponse.json({
      success: true,
      data: mergedCategories
    });

  } catch (error) {
    console.error('Error fetching categories:', error);
    return NextResponse.json({
      success: false,
      error: 'Failed to fetch categories'
    }, { status: 500 });
  }
}
