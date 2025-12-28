import { NextRequest, NextResponse } from 'next/server';
import { SoftSkillRoadmapService } from '@/lib/models/SoftSkillRoadmap';
import { generateSoftSkillRoadmap } from '@/services/geminiService';

export async function POST(request: NextRequest) {
  try {
    const { skillName } = await request.json();

    if (!skillName) {
      return NextResponse.json({ success: false, error: 'Skill name is required' }, { status: 400 });
    }

    const slug = skillName.toLowerCase().replace(/[^a-z0-9]+/g, '-').replace(/(^-|-$)/g, '');
    
    // Check if exists first (double-check pattern)
    const existing = await SoftSkillRoadmapService.getBySlug(slug);
    if (existing) {
        return NextResponse.json({ success: true, data: existing, cached: true });
    }

    // Generate
    const generatedRoadmap = await generateSoftSkillRoadmap(skillName);

    // Save
    const saved = await SoftSkillRoadmapService.create({
        ...generatedRoadmap,
        isActive: true,
        tags: [skillName, 'soft-skill', 'ai-generated']
    });

    if (saved.acknowledged) {
        return NextResponse.json({ success: true, data: { ...generatedRoadmap, _id: saved.insertedId }, cached: false });
    }

    throw new Error('Failed to save generated roadmap');

  } catch (error) {
    console.error('Error generating soft skill roadmap:', error);
    return NextResponse.json({ success: false, error: 'Failed to generate roadmap' }, { status: 500 });
  }
}
