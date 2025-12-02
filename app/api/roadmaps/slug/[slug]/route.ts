import { NextRequest, NextResponse } from 'next/server';
import { CareerRoadmapService } from '@/lib/models/CareerRoadmap';

export async function GET(
  request: NextRequest,
  { params }: { params: Promise<{ slug: string }> }
) {
  try {
    const { slug } = await params;
    console.log(`Looking up roadmap with slug: ${slug}`);

    const existingRoadmap = await CareerRoadmapService.getBySlug(slug);

    if (existingRoadmap) {
      return NextResponse.json({
        success: true,
        data: existingRoadmap,
        cached: true
      });
    } else {
      return NextResponse.json({
        success: true,
        data: null,
        cached: false
      });
    }
  } catch (error) {
    console.error('Error looking up roadmap:', error);
    return NextResponse.json({
      success: false,
      error: 'Failed to lookup roadmap'
    }, { status: 500 });
  }
}
