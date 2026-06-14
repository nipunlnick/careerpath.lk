export const dynamic = 'force-dynamic';

import { NextRequest, NextResponse } from 'next/server';
import { CareerRoadmapService } from '@/lib/models/CareerRoadmap';

export async function GET(request: NextRequest) {
  try {
    const searchParams = request.nextUrl.searchParams;
    const id = searchParams.get('id');

    if (id) {
        const roadmap = await CareerRoadmapService.getById(id);
        if (!roadmap) {
            return NextResponse.json({ success: false, error: 'Roadmap not found' }, { status: 404 });
        }
        return NextResponse.json({ success: true, roadmap });
    }

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


export async function POST(request: NextRequest) {
  try {
    const body = await request.json();
    
    // Basic validation
    if (!body.name || !body.slug || !body.category) {
      return NextResponse.json({ success: false, error: 'Missing required fields' }, { status: 400 });
    }

    // Check if slug exists
    const existing = await CareerRoadmapService.getBySlug(body.slug);
    if (existing) {
      return NextResponse.json({ success: false, error: 'Slug already exists' }, { status: 409 });
    }

    const result = await CareerRoadmapService.create(body);

    if (result.acknowledged) {
      return NextResponse.json({ success: true, id: result.insertedId });
    } else {
      return NextResponse.json({ success: false, error: 'Failed to create roadmap' }, { status: 500 });
    }
  } catch (error) {
    console.error('Error creating roadmap:', error);
    return NextResponse.json({ success: false, error: 'Internal server error' }, { status: 500 });
  }
}

export async function PUT(request: NextRequest) {
  try {
    const body = await request.json();
    const { _id, ...updates } = body;

    if (!_id) {
        return NextResponse.json({ success: false, error: 'ID is required' }, { status: 400 });
    }

    const result = await CareerRoadmapService.update(_id, updates);

    if (result.acknowledged) {
      return NextResponse.json({ success: true });
    } else {
      return NextResponse.json({ success: false, error: 'Failed to update roadmap' }, { status: 500 });
    }
  } catch (error) {
    console.error('Error updating roadmap:', error);
    return NextResponse.json({ success: false, error: 'Internal server error' }, { status: 500 });
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
