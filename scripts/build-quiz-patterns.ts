import fs from 'fs';
import path from 'path';
import { fileURLToPath } from 'url';

// Helper to handle __dirname in ES modules
const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

interface RoadmapData {
  slug: string;
  name: string;
  category: string;
  description: string;
  tags: string[];
}

interface QuizPattern {
  id: string;
  pattern: Record<string, string>;
  suggestions: {
    career: string;
    description: string;
    reasoning: string;
    roadmapPath: string;
  }[];
}

interface QuizMappings {
  standard: {
    patterns: QuizPattern[];
    fallback: any[];
  };
  long: {
    patterns: QuizPattern[];
    fallback: any[];
  };
}

async function buildQuizPatterns() {
  console.log('🏗️  Building quiz patterns...');

  const roadmapsDir = path.join(process.cwd(), 'data', 'roadmaps');
  const mappingsPath = path.join(process.cwd(), 'data', 'quiz-mappings.json');

  if (!fs.existsSync(roadmapsDir)) {
    console.error('❌ Roadmaps directory not found');
    return;
  }

  // Load existing mappings or initialize default structure
  let mappings: QuizMappings = {
    standard: { patterns: [], fallback: [] },
    long: { patterns: [], fallback: [] }
  };

  if (fs.existsSync(mappingsPath)) {
    try {
      mappings = JSON.parse(fs.readFileSync(mappingsPath, 'utf8'));
    } catch (error) {
      console.warn('⚠️  Could not parse existing mappings, starting fresh.');
    }
  }

  // Read all roadmaps
  const files = fs.readdirSync(roadmapsDir).filter(file => file.endsWith('.json'));
  console.log(`📁 Found ${files.length} roadmaps to check`);

  let addedCount = 0;

  for (const file of files) {
    const filePath = path.join(roadmapsDir, file);
    const fileName = path.basename(file, '.json');
    const roadmapJson = JSON.parse(fs.readFileSync(filePath, 'utf8'));
    
    // Ensure slug exists
    const roadmap: RoadmapData = {
      ...roadmapJson,
      slug: roadmapJson.slug || fileName
    };

    const existsInStandard = mappings.standard.patterns.some(p => 
      p.suggestions.some(s => s.roadmapPath === roadmap.slug)
    );

    const existsInLong = mappings.long.patterns.some(p => 
        p.suggestions.some(s => s.roadmapPath === roadmap.slug)
    );

    if (!existsInStandard) {
      // Generate new pattern
      console.log(`➕ Generating standard pattern for: ${roadmap.name}`);
      
      const newPattern = generatePattern(roadmap);
      mappings.standard.patterns.push(newPattern);
      addedCount++;
    }

    if (!existsInLong) {
        // Generate new long pattern
        console.log(`➕ Generating long pattern for: ${roadmap.name}`);
        
        const newLongPattern = generateLongPattern(roadmap);
        mappings.long.patterns.push(newLongPattern);
        addedCount++;
      }
  }

  // Save updated mappings
  fs.writeFileSync(mappingsPath, JSON.stringify(mappings, null, 2));
  console.log(`✅ Quiz patterns build complete! Added ${addedCount} new patterns.`);
}

function generatePattern(roadmap: RoadmapData): QuizPattern {
  const category = (roadmap.category || 'Other').toLowerCase();
  
  // Basic pattern generation logic based on category/tags
  // This is a simplified fallback to ensure coverage
  
  let pattern: Record<string, string> = {};
  
  const tags = roadmap.tags || [];
  
  if (category.includes('tech') || tags.includes('engineering')) {
    pattern = {
      role: "The analyst, focusing on data and logic.",
      subject: "Mathematics or Physics"
    };
  } else if (category.includes('creative') || tags.includes('design')) {
    pattern = {
      role: "The creative one, coming up with new ideas.",
      subject: "Art, Music, or Literature"
    };
  } else if (category.includes('business') || tags.includes('management')) {
    pattern = {
      role: "The leader, making decisions and delegating tasks.",
      subject: "Business Studies or Economics"
    };
  } else if (category.includes('health') || tags.includes('medical')) {
    pattern = {
      role: "The supporter, ensuring everyone is working well together.",
      subject: "Biology or Chemistry"
    };
  } else {
    // Default/General
    pattern = {
      priority: "Continuous learning and intellectual challenges."
    };
  }

  return {
    id: `generated_${roadmap.slug.replace(/-/g, '_')}`,
    pattern: pattern,
    suggestions: [
      {
        career: roadmap.name,
        description: roadmap.description,
        reasoning: `Based on your interest in ${category} and ${(roadmap.tags || [])[0] || 'diverse fields'}, this career offers excellent growth.`,
        roadmapPath: roadmap.slug
      }
    ]
  };
}

function generateLongPattern(roadmap: RoadmapData): QuizPattern {
    const category = (roadmap.category || 'Other').toLowerCase();
    const tags = roadmap.tags || [];
    
    let pattern: Record<string, string> = {};
  
    // Default values
    pattern.problemSolving = "Break it down logically and find a solution.";
    pattern.workStyle = "Flexible and adaptable.";
    pattern.ambition = "To become an expert in my field.";
    pattern.workWith = "Ideas and concepts.";
    
    // Tailored logic
    if (category.includes('tech') || tags.includes('engineering')) {
      pattern.problemSolving = "Analyze data and use logic to solve complex problems.";
      pattern.workStyle = "Independent and focused.";
      pattern.workWith = "Code, data, and technology.";
    } else if (category.includes('business') || tags.includes('management')) {
      pattern.problemSolving = "Collaborate with teams to find strategic solutions.";
      pattern.workStyle = "Collaborative and leadership-oriented.";
      pattern.workWith = "People and business strategy.";
      pattern.ambition = "To lead a team or organization.";
    } else if (category.includes('creative') || tags.includes('design')) {
      pattern.problemSolving = "Think outside the box and brainstorm innovative ideas.";
      pattern.workStyle = "Creative and free-flowing.";
      pattern.workWith = "Visuals, stories, and artistic concepts.";
    } else if (category.includes('health') || tags.includes('medical')) {
        pattern.problemSolving = "Use empathy and knowledge to help others.";
        pattern.workStyle = "Compassionate and service-oriented.";
        pattern.workWith = "Patients and healthcare teams.";
        pattern.impact = "Directly improving people's lives.";
    }
  
    return {
      id: `generated_long_${roadmap.slug.replace(/-/g, '_')}`,
      pattern: pattern,
      suggestions: [
        {
          career: roadmap.name,
          description: roadmap.description,
          reasoning: `Your ${pattern.workStyle} style and interest in working with ${pattern.workWith} make this career a perfect match.`,
          roadmapPath: roadmap.slug
        }
      ]
    };
  }

// Run if executed directly
if (import.meta.url === `file://${process.argv[1]}`) {
  buildQuizPatterns();
}

export { buildQuizPatterns };
