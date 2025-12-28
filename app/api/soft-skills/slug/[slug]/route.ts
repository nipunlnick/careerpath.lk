import { NextRequest, NextResponse } from 'next/server';
import { SoftSkillRoadmapService } from '@/lib/models/SoftSkillRoadmap';

export async function GET(
  request: NextRequest,
  { params }: { params: Promise<{ slug: string }> }
) {
  try {
    const { slug } = await params;
    const roadmap = await SoftSkillRoadmapService.getBySlug(slug);

    if (roadmap) {
        await SoftSkillRoadmapService.incrementViews(roadmap._id!);
        return NextResponse.json({ success: true, data: roadmap });
    }
    
    return NextResponse.json({ success: true, data: null });
  } catch (error) {
    console.error('Error fetching soft skill roadmap:', error);
    return NextResponse.json({ success: false, error: 'Failed to fetch roadmap' }, { status: 500 });
  }
}
