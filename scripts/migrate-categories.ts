import 'dotenv/config';
import { CareerRoadmapService } from '../lib/models/CareerRoadmap';
import { EXPLORE_CAREERS } from '../constants/careers';
import connectToDatabase from '../lib/mongodb';

async function migrateCategories() {
  console.log('Starting category migration...');
  
  try {
    await connectToDatabase();
    
    // 1. Build Lookup Maps
    const slugToCategoryMap = new Map<string, string>();
    const nameToCategoryMap = new Map<string, string>();
    
    // Explicit variations map
    const variationMap = new Map<string, string>([
      ['software engineering', 'Information Technology & Digital Careers'],
      ['data science', 'Information Technology & Digital Careers'],
      ['ui/ux design', 'Information Technology & Digital Careers'],
      ['financial analysis', 'Business, Management & Finance'],
      ['investment banking', 'Business, Management & Finance'],
      ['quantitative finance', 'Business, Management & Finance'],
      ['social worker', 'Healthcare & Medical Fields'],
      ['actuarial science', 'Business, Management & Finance'],
      ['software engineering management', 'Information Technology & Digital Careers'],
      ['engineering project management', 'Engineering & Technical'],
      ['it project management', 'Information Technology & Digital Careers'],
      ['content creation', 'Media, Communication & Design'],
      ['digital marketing specialist', 'Freelance, Remote & Creative Economy'],
      ['business intelligence analyst', 'Business, Management & Finance'],
      ['administrative manager', 'Business, Management & Finance'],
      ['healthcare administrator', 'Healthcare & Medical Fields'],
      ['training coordinator', 'Education & Training'],
      ['quantitative analysis', 'Business, Management & Finance'],
      ['financial quantitative analyst', 'Business, Management & Finance'],
      ['freelance consultant', 'Freelance, Remote & Creative Economy'],
    ]);
    
    EXPLORE_CAREERS.forEach(category => {
      category.careers.forEach(career => {
        if (career.path) {
          slugToCategoryMap.set(career.path, category.name);
        }
        nameToCategoryMap.set(career.name.toLowerCase(), category.name);
        
        if (career.name.includes('/')) {
          const parts = career.name.split('/').map(p => p.trim().toLowerCase());
          parts.forEach(part => {
             if (part) nameToCategoryMap.set(part, category.name);
          });
        }
      });
    });

    // 2. Fetch all roadmaps
    const roadmaps = await CareerRoadmapService.getAllActive(10000); // Fetch all
    console.log(`Found ${roadmaps.length} active roadmaps.`);
    
    let updatedCount = 0;
    
    for (const roadmap of roadmaps) {
      let newCategory = roadmap.category;
      let shouldUpdate = false;
      
      // console.log(`Checking "${roadmap.name}": category="${roadmap.category}"`);

      // Logic to determine if we should update
      // If current category is missing, "Community Generated", or "Other", try to find a better one
      if (!newCategory || newCategory === 'Community Generated' || newCategory === 'Other') {
         // Try lookup
         if (roadmap.slug && slugToCategoryMap.has(roadmap.slug)) {
            newCategory = slugToCategoryMap.get(roadmap.slug);
            shouldUpdate = true;
         } else if (roadmap.name && nameToCategoryMap.has(roadmap.name.toLowerCase())) {
            newCategory = nameToCategoryMap.get(roadmap.name.toLowerCase());
            shouldUpdate = true;
            console.log(`Matched "${roadmap.name}" to "${newCategory}" via name`);
         } else if (roadmap.name && variationMap.has(roadmap.name.toLowerCase())) {
            newCategory = variationMap.get(roadmap.name.toLowerCase());
            shouldUpdate = true;
            console.log(`Matched "${roadmap.name}" to "${newCategory}" via variation`);
         } else {
            console.log(`Could not match "${roadmap.name}" (slug: ${roadmap.slug})`);
         }
      }
      
      if (shouldUpdate && newCategory && newCategory !== roadmap.category) {
        console.log(`Updating "${roadmap.name}" from "${roadmap.category}" to "${newCategory}"`);
        await CareerRoadmapService.update(roadmap._id!, { category: newCategory });
        updatedCount++;
      }
    }
    
    console.log(`Migration complete. Updated ${updatedCount} roadmaps.`);
    process.exit(0);
    
  } catch (error) {
    console.error('Migration failed:', error);
    process.exit(1);
  }
}

migrateCategories();
