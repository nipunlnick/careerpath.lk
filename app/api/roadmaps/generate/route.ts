import { NextRequest, NextResponse } from 'next/server';
import { CareerRoadmapService } from '@/lib/models/CareerRoadmap';
import { generateRoadmap } from '@/services/geminiService';

import { EXPLORE_CAREERS } from '@/constants/careers';

export async function POST(request: NextRequest) {
  try {
    const body = await request.json();
    const { careerPath, name, slug: providedSlug } = body;
    const careerName = careerPath || name;

    if (!careerName) {
      return NextResponse.json({
        success: false,
        error: 'Career path or name is required'
      }, { status: 400 });
    }

    const slug = providedSlug || careerName.toLowerCase()
      .replace(/[^a-z0-9]+/g, '-')
      .replace(/(^-|-$)/g, '');

    const existingRoadmap = await CareerRoadmapService.getBySlug(slug);

    if (existingRoadmap) {
      return NextResponse.json({
        success: true,
        data: existingRoadmap,
        cached: true
      });
    }

    const categories = EXPLORE_CAREERS.map(c => c.name);
    const roadmapData = await generateRoadmap(careerName, categories);

    // Use AI-determined category, fallback to 'Community Generated' if invalid
    let category = roadmapData.category;
    
    // Validate against known categories or remap invalid ones
    if (!categories.includes(category)) {
        // Leave it as is, or default to something generic. 
        // The GET route will now handle categorization intelligence.
        // We'll just save it as 'Community Generated' for now if it's completely unknown, 
        // but ideally we should try to infer here too.
        // For simplicity, let's just default to 'Community Generated' if strictly not in list,
        // but we won't force-rename specific legacy tags here anymore as the GET route handles them.
        category = 'Community Generated';
    }

    const savedRoadmap = await CareerRoadmapService.create({
      name: careerName,
      slug,
      category: category,
      description: `Career roadmap for ${careerName} generated from search`,
      steps: roadmapData.roadmap,
      marketInsights: roadmapData.insights,
      alternativeCareers: roadmapData.alternativeCareers,
      difficulty: 'intermediate',
      estimatedDuration: '2-4 years',
      tags: [careerName, 'search-generated'],
      isActive: true
    });

    return NextResponse.json({
      success: true,
      data: savedRoadmap,
      cached: false
    });

  } catch (error) {
    console.error('Error generating roadmap:', error);
    return NextResponse.json({
      success: false,
      error: 'Failed to generate roadmap'
    }, { status: 500 });
  }
}
