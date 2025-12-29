import { NextRequest, NextResponse } from 'next/server';
import { SoftSkillRoadmapService } from '@/lib/models/SoftSkillRoadmap';

export async function GET(request: NextRequest) {
  try {
    const searchParams = request.nextUrl.searchParams;
    const id = searchParams.get('id');

    if (id) {
        // We need to ensure getById exists in service, which I'm adding concurrently
        const skill = await SoftSkillRoadmapService.getById(id);
        if (!skill) {
             return NextResponse.json({ success: false, error: 'Skill not found' }, { status: 404 });
        }
        return NextResponse.json({ success: true, skill });
    }

    const limit = parseInt(searchParams.get('limit') || '100');
    const query = searchParams.get('query') || '';

    let skills;
    if (query) {
        skills = await SoftSkillRoadmapService.search(query, limit);
    } else {
        skills = await SoftSkillRoadmapService.getAllActive(limit);
    }

    return NextResponse.json({
      success: true,
      skills
    });
  } catch (error) {
    console.error('Error fetching soft skills:', error);
    return NextResponse.json({ success: false, error: 'Failed to fetch soft skills' }, { status: 500 });
  }
}

export async function POST(request: NextRequest) {
  try {
    const body = await request.json();
    
    if (!body.name || !body.slug) {
      return NextResponse.json({ success: false, error: 'Missing required fields' }, { status: 400 });
    }

    // Check if slug exists
    const existing = await SoftSkillRoadmapService.getBySlug(body.slug);
    if (existing) {
      return NextResponse.json({ success: false, error: 'Slug already exists' }, { status: 409 });
    }

    const result = await SoftSkillRoadmapService.create(body);

    if (result.acknowledged) {
      return NextResponse.json({ success: true, id: result.insertedId });
    } else {
      return NextResponse.json({ success: false, error: 'Failed to create skill' }, { status: 500 });
    }
  } catch (error) {
    console.error('Error creating soft skill:', error);
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

    const result = await SoftSkillRoadmapService.update(_id, updates);

    if (result.acknowledged) {
      return NextResponse.json({ success: true });
    } else {
      return NextResponse.json({ success: false, error: 'Failed to update skill' }, { status: 500 });
    }
  } catch (error) {
    console.error('Error updating soft skill:', error);
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

    await SoftSkillRoadmapService.delete(id);

    return NextResponse.json({ success: true });
  } catch (error) {
    console.error('Error deleting soft skill:', error);
    return NextResponse.json({ success: false, error: 'Failed to delete skill' }, { status: 500 });
  }
}
