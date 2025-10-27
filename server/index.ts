import dotenv from 'dotenv';
// Load environment variables FIRST before importing other modules
dotenv.config();

import express from 'express';
import cors from 'cors';
import connectToDatabase from '../lib/mongodb';
import { CareerRoadmapService } from '../lib/models/CareerRoadmap';
import { QuizResultService } from '../lib/models/QuizResult';
import { generateRoadmap, suggestCareers, suggestCareersLong } from '../services/geminiService';
import crypto from 'crypto';

const app = express();

// Middleware
app.use(cors());
app.use(express.json());

// Health check endpoint
app.get('/health', (req, res) => {
  res.json({ status: 'ok', timestamp: new Date().toISOString() });
});

// Helper function to generate quiz answers hash
function generateAnswersHash(answers: any): string {
  const normalizedAnswers = Array.isArray(answers) 
    ? answers.map(answer => 
        typeof answer === 'string' ? answer.toLowerCase().trim() : JSON.stringify(answer)
      ).sort()
    : Object.entries(answers)
        .sort(([a], [b]) => a.localeCompare(b))
        .map(([key, value]) => `${key}:${typeof value === 'string' ? value.toLowerCase().trim() : JSON.stringify(value)}`);
  
  return crypto.createHash('md5').update(JSON.stringify(normalizedAnswers)).digest('hex');
}

// Roadmap endpoints
app.get('/api/roadmaps/slug/:slug', async (req, res) => {
  try {
    const { slug } = req.params;
    console.log(`Looking up roadmap with slug: ${slug}`);
    
    // First, try to find the roadmap in the database
    const existingRoadmap = await CareerRoadmapService.getBySlug(slug);
    
    if (existingRoadmap) {
      console.log('Found existing roadmap in database');
      res.json({
        success: true,
        data: existingRoadmap,
        cached: true
      });
    } else {
      console.log('No existing roadmap found');
      res.json({
        success: true,
        data: null,
        cached: false
      });
    }
  } catch (error) {
    console.error('Error looking up roadmap:', error);
    res.status(500).json({ 
      success: false, 
      error: 'Failed to lookup roadmap' 
    });
  }
});

app.post('/api/roadmaps/generate', async (req, res) => {
  try {
    // Support both formats: { careerPath } from quiz and { name, slug } from RoadmapExplorer
    const { careerPath, name, slug: providedSlug } = req.body;
    const careerName = careerPath || name;
    
    console.log(`Generating roadmap for: ${careerName}`);
    
    if (!careerName) {
      return res.status(400).json({ 
        success: false, 
        error: 'Career path or name is required' 
      });
    }

    // Check if roadmap already exists using provided slug or generated slug
    const slug = providedSlug || careerName.toLowerCase()
      .replace(/[^a-z0-9]+/g, '-')
      .replace(/(^-|-$)/g, '');
      
    console.log(`Checking for existing roadmap with slug: ${slug}`);
    const existingRoadmap = await CareerRoadmapService.getBySlug(slug);
    
    if (existingRoadmap) {
      console.log('Found existing roadmap in database');
      return res.json({
        success: true,
        data: existingRoadmap,
        cached: true
      });
    }

    // Generate the roadmap using Gemini
    const roadmapData = await generateRoadmap(careerName);
    
    // Store the roadmap in database
    const savedRoadmap = await CareerRoadmapService.create({
      name: careerName,
      slug,
      category: 'Search Generated',
      description: `Career roadmap for ${careerName} generated from search`,
      steps: roadmapData.roadmap,
      marketInsights: undefined, // TODO: Fix type mismatch
      difficulty: 'intermediate',
      estimatedDuration: '2-4 years',
      tags: [careerName, 'search-generated'],
      isActive: true
    });
    
    console.log('Generated and stored new roadmap');
    res.json({
      success: true,
      data: savedRoadmap,
      cached: false
    });
    
  } catch (error) {
    console.error('Error generating roadmap:', error);
    res.status(500).json({ 
      success: false, 
      error: 'Failed to generate roadmap' 
    });
  }
});

// Quiz result endpoints
app.get('/api/quiz/results/:hash', async (req, res) => {
  try {
    const { hash } = req.params;
    const { quizType } = req.query;
    
    console.log(`Looking up quiz result with hash: ${hash}, type: ${quizType}`);
    
    // Find cached result by hash and quiz type
    const cachedResult = await QuizResultService.findByHash(hash, quizType as string);
    
    if (cachedResult) {
      console.log('Found cached quiz result');
      res.json({
        success: true,
        cached: true,
        result: cachedResult.result,
        timestamp: cachedResult.createdAt
      });
    } else {
      console.log('No cached quiz result found');
      res.json({
        success: true,
        cached: false,
        result: null
      });
    }
  } catch (error) {
    console.error('Error looking up quiz result:', error);
    res.status(500).json({ 
      success: false, 
      error: 'Failed to lookup quiz result' 
    });
  }
});

app.post('/api/quiz/generate', async (req, res) => {
  try {
    const { answers, quizType, userId } = req.body;
    
    if (!answers) {
      return res.status(400).json({ 
        success: false, 
        error: 'Answers are required' 
      });
    }
    
    // Convert answers to consistent format for hashing and API calls
    let answersForHashing: any;
    let answersForAPI: Record<string, string>;
    
    if (Array.isArray(answers)) {
      // Convert array to object for API compatibility 
      answersForHashing = answers;
      answersForAPI = answers.reduce((acc, answer, index) => {
        acc[`q${index}`] = typeof answer === 'string' ? answer : JSON.stringify(answer);
        return acc;
      }, {} as Record<string, string>);
    } else {
      // Already in object format
      answersForHashing = answers;
      answersForAPI = answers as Record<string, string>;
    }
    
    // Generate hash for the answers
    const answersHash = generateAnswersHash(answersForHashing);
    console.log(`Generating quiz result for hash: ${answersHash}, type: ${quizType}`);
    
    // Check if we already have a cached result
    const existingResult = await QuizResultService.findByHash(answersHash, quizType);
    if (existingResult) {
      console.log('Returning existing cached result');
      return res.json({
        success: true,
        cached: true,
        result: existingResult.result,
        hash: answersHash
      });
    }
    
    // Generate new result using appropriate Gemini service
    let careerSuggestions;
    if (quizType === 'long') {
      careerSuggestions = await suggestCareersLong(answersForAPI);
    } else {
      careerSuggestions = await suggestCareers(answersForAPI);
    }
    
    // Generate and store roadmaps for each suggested career
    console.log('Generating roadmaps for suggested careers...');
    const enhancedSuggestions = await Promise.all(
      careerSuggestions.map(async (suggestion: any) => {
        try {
          const careerName = suggestion.roadmapPath || suggestion.career;
          const slug = careerName.toLowerCase()
            .replace(/[^a-z0-9]+/g, '-')
            .replace(/(^-|-$)/g, '');
          
          // Check if roadmap already exists
          let existingRoadmap = await CareerRoadmapService.getBySlug(slug);
          
          if (!existingRoadmap) {
            console.log(`Generating roadmap for: ${careerName}`);
            
            // Generate the roadmap using Gemini
            const roadmapData = await generateRoadmap(careerName);
            
            // Store the roadmap in database
            const roadmapResult = await CareerRoadmapService.create({
              name: careerName,
              slug,
              category: 'Quiz Generated',
              description: `Career roadmap for ${careerName} generated from quiz results`,
              steps: roadmapData.roadmap,
              marketInsights: undefined, // TODO: Fix type mismatch
              difficulty: 'intermediate',
              estimatedDuration: '2-4 years',
              tags: [careerName, 'quiz-generated'],
              isActive: true
            });
            
            console.log(`Roadmap created for ${careerName} with slug: ${slug}`);
          } else {
            console.log(`Roadmap already exists for ${careerName}`);
          }
          
          // Return enhanced suggestion with slug for roadmap navigation
          return {
            ...suggestion,
            roadmapSlug: slug
          };
        } catch (error) {
          console.error(`Error generating roadmap for ${suggestion.career}:`, error);
          // Return original suggestion if roadmap generation fails
          return suggestion;
        }
      })
    );
    
    // Store the quiz result with enhanced suggestions
    const quizResult = await QuizResultService.create({
      userId,
      answersHash,
      answers: answersForHashing,
      result: enhancedSuggestions,
      quizType: quizType || 'standard',
      completedAt: new Date()
    });
    
    console.log('Generated and cached new quiz result with roadmaps');
    res.json({
      success: true,
      cached: false,
      result: enhancedSuggestions,
      hash: answersHash,
      roadmapsGenerated: enhancedSuggestions.length
    });
    
  } catch (error) {
    console.error('Error generating quiz result:', error);
    res.status(500).json({ 
      success: false, 
      error: 'Failed to generate quiz result' 
    });
  }
});

// Enhanced search endpoint - searches DB first, then generates if not found
app.post('/api/roadmaps/search', async (req, res) => {
  try {
    const { searchTerm, userId } = req.body;
    
    if (!searchTerm || !searchTerm.trim()) {
      return res.status(400).json({ 
        success: false, 
        error: 'Search term is required' 
      });
    }
    
    const cleanSearchTerm = searchTerm.trim();
    const slug = cleanSearchTerm.toLowerCase()
      .replace(/[^a-z0-9]+/g, '-')
      .replace(/(^-|-$)/g, '');
      
    console.log(`Enhanced search for: "${cleanSearchTerm}" (slug: ${slug})`);
    
    // 1. First check if roadmap exists in database
    let existingRoadmap = await CareerRoadmapService.getBySlug(slug);
    
    if (existingRoadmap) {
      console.log('Found existing roadmap in database');
      return res.json({
        success: true,
        data: existingRoadmap,
        cached: true,
        searchTerm: cleanSearchTerm,
        slug
      });
    }
    
    // 2. Search by similar names (fuzzy search)
    const searchResults = await CareerRoadmapService.search(cleanSearchTerm, 5);
    if (searchResults.length > 0) {
      console.log(`Found ${searchResults.length} similar roadmaps in database`);
      return res.json({
        success: true,
        data: searchResults[0], // Return the best match
        cached: true,
        searchTerm: cleanSearchTerm,
        slug: searchResults[0].slug,
        similarResults: searchResults.slice(1) // Other matches
      });
    }
    
    // 3. No existing roadmap found, generate new one
    console.log(`No existing roadmap found, generating new one for: ${cleanSearchTerm}`);
    
    // Generate the roadmap using Gemini
    const roadmapData = await generateRoadmap(cleanSearchTerm);
    
    // Store the roadmap in database
    const savedRoadmap = await CareerRoadmapService.create({
      name: cleanSearchTerm,
      slug,
      category: 'Search Generated',
      description: `Career roadmap for ${cleanSearchTerm} generated from user search`,
      steps: roadmapData.roadmap,
      marketInsights: undefined, // TODO: Fix type mismatch
      difficulty: 'intermediate',
      estimatedDuration: '2-4 years',
      tags: [cleanSearchTerm, 'search-generated', 'user-requested'],
      isActive: true
    });
    
    console.log(`Generated and stored new roadmap for: ${cleanSearchTerm}`);
    res.json({
      success: true,
      data: savedRoadmap,
      cached: false,
      searchTerm: cleanSearchTerm,
      slug,
      generated: true
    });
    
  } catch (error) {
    console.error('Error in enhanced roadmap search:', error);
    res.status(500).json({ 
      success: false, 
      error: 'Failed to search or generate roadmap',
      searchTerm: req.body.searchTerm
    });
  }
});

const PORT = process.env.PORT || 3001;

app.listen(PORT, () => {
  console.log(`Server running on port ${PORT}`);
  console.log(`Health check: http://localhost:${PORT}/health`);
  
  // Test database connection
  connectToDatabase()
    .then(() => console.log('✅ Database connection established'))
    .catch(err => console.error('❌ Database connection failed:', err));
});