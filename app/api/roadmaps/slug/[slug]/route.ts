import { NextRequest, NextResponse } from 'next/server';
import { CareerRoadmapService } from '@/lib/models/CareerRoadmap';

export async function GET(
  request: NextRequest,
  { params }: { params: Promise<{ slug: string }> }
) {
  try {
    const { slug } = await params;
    console.log(`[API] Fetching roadmap for slug: ${slug}`);

    const existingRoadmap = await CareerRoadmapService.getBySlug(slug);
    console.log(`[API] Found roadmap in DB:`, existingRoadmap ? 'YES' : 'NO');

    if (existingRoadmap) {
      // Check if marketInsights lacks newer fields (e.g. at least one of the detailed skill arrays)
      const insights = existingRoadmap.marketInsights;
      const isMissingDetailedSkills = 
        !insights?.technicalSkills || 
        !insights?.softSkills ||
        !insights?.toolsAndSoftware ||
        !insights?.certifications;

      if (isMissingDetailedSkills) {
        console.log(`[API] Missing detailed skills for ${slug}, attempting regeneration...`);
        try {
           // We need the categories for generation
           const { EXPLORE_CAREERS } = await import('@/constants/careers');
           const { generateRoadmap } = await import('@/services/geminiService');
           
           const categories = EXPLORE_CAREERS.map(c => c.name);
           const roadmapData = await generateRoadmap(existingRoadmap.name, categories);
           
           if (existingRoadmap._id) {
             const updateResult = await CareerRoadmapService.update(existingRoadmap._id, {
                steps: roadmapData.roadmap,
                marketInsights: roadmapData.insights,
                alternativeCareers: roadmapData.alternativeCareers
             });

             if (updateResult.acknowledged) {
                // Return the updated data
                return NextResponse.json({
                  success: true,
                  data: {
                    ...existingRoadmap,
                    steps: roadmapData.roadmap,
                    marketInsights: roadmapData.insights,
                    alternativeCareers: roadmapData.alternativeCareers
                  },
                  cached: false, // It was regenerated
                  regenerated: true
                });
             }
           }
        } catch (genError) {
           console.error("Failed to regenerate roadmap on the fly", genError);
           // Fallback to existing if regeneration fails
        }
      }

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
