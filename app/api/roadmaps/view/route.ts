import { NextRequest, NextResponse } from 'next/server';
import { CareerRoadmapService } from '@/lib/models/CareerRoadmap';

export async function POST(request: NextRequest) {
  try {
    const body = await request.json();
    const { id, slug } = body;

    if (!id && !slug) {
      return NextResponse.json({
        success: false,
        error: 'Roadmap ID or slug is required'
      }, { status: 400 });
    }

    let roadmapId = id;
    if (!roadmapId && slug) {
      const roadmap = await CareerRoadmapService.getBySlug(slug);
      if (roadmap) {
        roadmapId = roadmap._id;
      }
    }

    if (!roadmapId) {
      return NextResponse.json({
        success: false,
        error: 'Roadmap not found'
      }, { status: 404 });
    }

    await CareerRoadmapService.incrementViews(roadmapId);

    return NextResponse.json({
      success: true,
      message: 'View count incremented'
    });

  } catch (error) {
    console.error('Error incrementing view count:', error);
    return NextResponse.json({
      success: false,
      error: 'Failed to increment view count'
    }, { status: 500 });
  }
}
