import { CareerRoadmapService } from '../lib/models/CareerRoadmap';
import { connectToDatabase } from '../lib/mongodb';
import dotenv from 'dotenv';
import path from 'path';

dotenv.config({ path: path.join(process.cwd(), '.env') });

async function checkInsights() {
  try {
    console.log('🔍 Checking marketInsights for: full-stack-developer');
    
    await connectToDatabase();
    
    const roadmap = await CareerRoadmapService.getBySlug('full-stack-developer');
    
    if (roadmap) {
      console.log('✅ Roadmap found!');
      const insights = roadmap.marketInsights;
      
      if (!insights) {
        console.error('❌ marketInsights IS NULL/UNDEFINED');
        return;
      }

      console.log('📊 Market Insights Data:');
      console.log('Demand:', insights.demand);
      console.log('Salary:', insights.salaryRange);
      console.log('Tech Skills:', insights.technicalSkills ? `Array(${insights.technicalSkills.length})` : 'UNDEFINED');
      console.log('Soft Skills:', insights.softSkills ? `Array(${insights.softSkills.length})` : 'UNDEFINED');
      console.log('Tools:', insights.toolsAndSoftware ? `Array(${insights.toolsAndSoftware.length})` : 'UNDEFINED');
      console.log('Certifications:', insights.certifications ? `Array(${insights.certifications.length})` : 'UNDEFINED');
      
      const isMissingDetailedSkills = 
        !insights.technicalSkills || 
        !insights.softSkills ||
        !insights.toolsAndSoftware ||
        !insights.certifications;

      console.log('\n🛑 Is Missing Detailed Skills (Trigger for Regen):', isMissingDetailedSkills);
      
    } else {
      console.error('❌ Roadmap NOT found in DB');
    }
  } catch (error) {
    console.error('❌ Error during debug:', error);
  } finally {
    process.exit(0);
  }
}

if (import.meta.url === `file://${process.argv[1]}`) {
  checkInsights();
}
