import { NextRequest, NextResponse } from 'next/server';
import { CareerRoadmapService } from '@/lib/models/CareerRoadmap';

export async function GET(request: NextRequest) {
  try {
    // Basic stats
    const totalRoadmaps = await CareerRoadmapService.count();
    const categories = await CareerRoadmapService.getCategories();
    const totalCategories = categories.length;
    
    // You could add more complex stats here (e.g., roadmaps created today)

    return NextResponse.json({
      success: true,
      stats: {
        totalUsers: 0, // No users in DB yet
        totalRoadmaps,
        generatedRoadmaps: await CareerRoadmapService.countGenerated(),
        totalCategories,
        totalViews: await CareerRoadmapService.getTotalViews(), 
      }
    });
  } catch (error) {
    console.error('Error fetching admin stats:', error);
    return NextResponse.json({ success: false, error: 'Failed to fetch stats' }, { status: 500 });
  }
}
