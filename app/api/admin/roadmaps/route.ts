import { NextRequest, NextResponse } from 'next/server';
import { CareerRoadmapService } from '@/lib/models/CareerRoadmap';

export async function GET(request: NextRequest) {
  try {
    const searchParams = request.nextUrl.searchParams;
    const limit = parseInt(searchParams.get('limit') || '100');
    const skip = parseInt(searchParams.get('skip') || '0');

    // We use getAllActive but we might want to include inactive ones too for admin
    // For now, let's just use getAllActive as it's available
    const roadmaps = await CareerRoadmapService.getAllActive(limit, skip);

    return NextResponse.json({
      success: true,
      roadmaps
    });
  } catch (error) {
    console.error('Error fetching roadmaps:', error);
    return NextResponse.json({ success: false, error: 'Failed to fetch roadmaps' }, { status: 500 });
  }
}

export async function DELETE(request: NextRequest) {
  try {
    const searchParams = request.nextUrl.searchParams;
    const id = searchParams.get('id');

    if (!id) {
      return NextResponse.json({ success: false, error: 'ID is required' }, { status: 400 });
    }

    await CareerRoadmapService.delete(id);

    return NextResponse.json({ success: true });
  } catch (error) {
    console.error('Error deleting roadmap:', error);
    return NextResponse.json({ success: false, error: 'Failed to delete roadmap' }, { status: 500 });
  }
}
