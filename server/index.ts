import dotenv from 'dotenv';
// Load environment variables FIRST before importing other modules
dotenv.config();

import express from 'express';
import cors from 'cors';
import connectToDatabase from '../lib/mongodb';
import { CareerRoadmapService } from '../lib/models/CareerRoadmap';
import { QuizResultService } from '../lib/models/QuizResult';
import { generateRoadmap, suggestCareers, suggestCareersLong } from '../services/geminiService';
import { localQuizService } from '../services/localQuizService';
import { AnalyticsService } from '../services/analyticsService';
import crypto from 'crypto';

const app = express();

// CORS Configuration
const corsOptions = {
  origin: function (origin: string | undefined, callback: Function) {
    // Allow requests with no origin (mobile apps, Postman, etc.)
    if (!origin) return callback(null, true);
    
    const allowedOrigins = process.env.CORS_ORIGIN 
      ? process.env.CORS_ORIGIN.split(',')
      : ['http://localhost:3000', 'http://localhost:5173', 'http://localhost:3001'];
    
    if (allowedOrigins.includes(origin)) {
      callback(null, true);
    } else {
      console.warn(`CORS blocked origin: ${origin}`);
      callback(new Error('Not allowed by CORS'));
    }
  },
  credentials: true,
  optionsSuccessStatus: 200
};

// Middleware
app.use(cors(corsOptions));
app.use(express.json({ limit: '10mb' }));
app.use(express.urlencoded({ extended: true, limit: '10mb' }));

// Security headers middleware
app.use((req, res, next) => {
  res.header('X-Content-Type-Options', 'nosniff');
  res.header('X-Frame-Options', 'DENY');
  res.header('X-XSS-Protection', '1; mode=block');
  res.header('Referrer-Policy', 'strict-origin-when-cross-origin');
  next();
});

// Health check endpoint
app.get('/health', (req, res) => {
  res.json({ 
    status: 'ok', 
    timestamp: new Date().toISOString(),
    environment: process.env.NODE_ENV || 'development',
    version: '1.0.0'
  });
});

// Admin middleware to check if user is admin
const isAdmin = (req: any, res: any, next: any) => {
  // In a real implementation, you'd verify JWT token and check admin status
  // For now, we'll implement a simple header-based check
  const adminKey = req.headers['x-admin-key'];
  const validAdminKey = process.env.ADMIN_KEY || 'dev-admin-key-2024';
  
  if (adminKey !== validAdminKey) {
    return res.status(403).json({ 
      success: false, 
      error: 'Admin access required' 
    });
  }
  
  next();
};

// Analytics endpoints (admin only)
app.get('/api/analytics/quiz-stats', isAdmin, async (req, res) => {
  try {
    const { range = '7d' } = req.query;
    const analytics = await AnalyticsService.getQuizAnalytics(range as any);
    
    res.json({
      success: true,
      data: analytics
    });
  } catch (error) {
    console.error('Error fetching quiz analytics:', error);
    res.status(500).json({
      success: false,
      error: 'Failed to fetch quiz analytics'
    });
  }
});

app.get('/api/analytics/system-metrics', isAdmin, async (req, res) => {
  try {
    const metrics = await AnalyticsService.getSystemMetrics();
    
    res.json({
      success: true,
      data: metrics
    });
  } catch (error) {
    console.error('Error fetching system metrics:', error);
    res.status(500).json({
      success: false,
      error: 'Failed to fetch system metrics'
    });
  }
});

app.get('/api/analytics/patterns', isAdmin, async (req, res) => {
  try {
    const stats = await AnalyticsService.getQuizPatternStats();
    
    res.json({
      success: true,
      data: stats
    });
  } catch (error) {
    console.error('Error fetching pattern stats:', error);
    res.status(500).json({
      success: false,
      error: 'Failed to fetch pattern statistics'
    });
  }
});

app.get('/api/analytics/roadmaps', isAdmin, async (req, res) => {
  try {
    const stats = await AnalyticsService.getRoadmapStats();
    
    res.json({
      success: true,
      data: stats
    });
  } catch (error) {
    console.error('Error fetching roadmap stats:', error);
    res.status(500).json({
      success: false,
      error: 'Failed to fetch roadmap statistics'
    });
  }
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
        hash: answersHash,
        source: 'database'
      });
    }
    
    // Generate new result using local quiz service (faster, no API calls)
    console.log('Generating suggestions using local quiz service...');
    const careerSuggestions = await localQuizService.getSuggestionsWithPartialMatching(
      answersForAPI,
      quizType as 'standard' | 'long'
    );
    
    console.log(`Generated ${careerSuggestions.length} career suggestions locally`);
    
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
            career: suggestion.career,
            description: suggestion.description,
            reasoning: suggestion.reasoning,
            roadmapPath: suggestion.roadmapPath,
            roadmapSlug: slug
          };
        } catch (error) {
          console.error(`Error generating roadmap for ${suggestion.career}:`, error);
          // Return original suggestion if roadmap generation fails
          return {
            career: suggestion.career,
            description: suggestion.description,
            reasoning: suggestion.reasoning,
            roadmapPath: suggestion.roadmapPath
          };
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
      roadmapsGenerated: enhancedSuggestions.length,
      source: 'local-patterns'
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

// User Statistics endpoints
app.get('/api/user-stats/:userId/quiz-history', async (req, res) => {
  try {
    const { userId } = req.params;
    
    if (!userId) {
      return res.status(400).json({ 
        success: false, 
        error: 'userId is required' 
      });
    }

    const quizHistory = await QuizResultService.findByUserId(userId);
    
    res.json({
      success: true,
      data: quizHistory
    });
  } catch (error) {
    console.error('Error fetching quiz history:', error);
    res.status(500).json({
      success: false,
      error: 'Failed to fetch quiz history'
    });
  }
});

app.get('/api/user-stats/:userId/recent-activity', async (req, res) => {
  try {
    const { userId } = req.params;
    const { limit = 10 } = req.query;
    
    if (!userId) {
      return res.status(400).json({ 
        success: false, 
        error: 'userId is required' 
      });
    }

    // Get recent quiz results and saved roadmaps with proper error handling
    let recentQuizzes = [];
    let savedRoadmaps = [];
    
    try {
      [recentQuizzes, savedRoadmaps] = await Promise.all([
        QuizResultService.findByUserId(userId),
        (() => {
          const { SavedRoadmapService } = require('../services/savedRoadmapService');
          return SavedRoadmapService.getUserSavedRoadmaps(userId);
        })()
      ]);
    } catch (dataError) {
      console.error('Error fetching user data for activity:', dataError);
      // Continue with empty arrays if data fetch fails
    }

    // Validate data
    recentQuizzes = Array.isArray(recentQuizzes) ? recentQuizzes : [];
    savedRoadmaps = Array.isArray(savedRoadmaps) ? savedRoadmaps : [];

    // Combine and sort activities
    const activities = [
      ...recentQuizzes.map(quiz => ({
        type: 'quiz',
        title: `Completed ${quiz.quizType} career quiz`,
        description: `Generated ${quiz.result?.length || 0} career suggestions`,
        date: quiz.createdAt,
        icon: 'ClipboardList'
      })),
      ...savedRoadmaps.map(roadmap => ({
        type: 'roadmap_save',
        title: `Saved roadmap: ${roadmap.roadmapName}`,
        description: 'Added to your career collection',
        date: roadmap.savedAt,
        icon: 'Bookmark'
      }))
    ]
      .sort((a, b) => new Date(b.date).getTime() - new Date(a.date).getTime())
      .slice(0, Number(limit));

    res.json({
      success: true,
      data: activities
    });
  } catch (error) {
    console.error('Error fetching user activity:', error);
    res.status(500).json({
      success: false,
      error: 'Failed to fetch user activity'
    });
  }
});

// Saved Roadmaps endpoints
app.post('/api/saved-roadmaps', async (req, res) => {
  try {
    const { userId, roadmapSlug, roadmapName, roadmapData, notes } = req.body;
    
    if (!userId || !roadmapSlug || !roadmapName) {
      return res.status(400).json({ 
        success: false, 
        error: 'userId, roadmapSlug, and roadmapName are required' 
      });
    }

    const { SavedRoadmapService } = await import('../services/savedRoadmapService');
    const savedRoadmap = await SavedRoadmapService.saveRoadmap(
      userId, 
      roadmapSlug, 
      roadmapName, 
      roadmapData, 
      notes
    );
    
    res.json({
      success: true,
      data: savedRoadmap
    });
  } catch (error) {
    console.error('Error saving roadmap:', error);
    res.status(500).json({
      success: false,
      error: 'Failed to save roadmap'
    });
  }
});

app.delete('/api/saved-roadmaps', async (req, res) => {
  try {
    const { userId, roadmapSlug } = req.body;
    
    if (!userId || !roadmapSlug) {
      return res.status(400).json({ 
        success: false, 
        error: 'userId and roadmapSlug are required' 
      });
    }

    const { SavedRoadmapService } = await import('../services/savedRoadmapService');
    const success = await SavedRoadmapService.unsaveRoadmap(userId, roadmapSlug);
    
    res.json({
      success,
      message: success ? 'Roadmap unsaved successfully' : 'Roadmap not found'
    });
  } catch (error) {
    console.error('Error unsaving roadmap:', error);
    res.status(500).json({
      success: false,
      error: 'Failed to unsave roadmap'
    });
  }
});

app.get('/api/saved-roadmaps/:userId', async (req, res) => {
  try {
    const { userId } = req.params;
    
    if (!userId) {
      return res.status(400).json({ 
        success: false, 
        error: 'userId is required' 
      });
    }

    const { SavedRoadmapService } = await import('../services/savedRoadmapService');
    const savedRoadmaps = await SavedRoadmapService.getUserSavedRoadmaps(userId);
    
    res.json({
      success: true,
      data: savedRoadmaps
    });
  } catch (error) {
    console.error('Error fetching saved roadmaps:', error);
    res.status(500).json({
      success: false,
      error: 'Failed to fetch saved roadmaps'
    });
  }
});

app.get('/api/saved-roadmaps/:userId/:roadmapSlug', async (req, res) => {
  try {
    const { userId, roadmapSlug } = req.params;
    
    if (!userId || !roadmapSlug) {
      return res.status(400).json({ 
        success: false, 
        error: 'userId and roadmapSlug are required' 
      });
    }

    const { SavedRoadmapService } = await import('../services/savedRoadmapService');
    const isSaved = await SavedRoadmapService.isRoadmapSaved(userId, roadmapSlug);
    
    res.json({
      success: true,
      data: { isSaved }
    });
  } catch (error) {
    console.error('Error checking saved roadmap:', error);
    res.status(500).json({
      success: false,
      error: 'Failed to check saved roadmap'
    });
  }
});

app.patch('/api/saved-roadmaps/notes', async (req, res) => {
  try {
    const { userId, roadmapSlug, notes } = req.body;
    
    if (!userId || !roadmapSlug) {
      return res.status(400).json({ 
        success: false, 
        error: 'userId and roadmapSlug are required' 
      });
    }

    const { SavedRoadmapService } = await import('../services/savedRoadmapService');
    const success = await SavedRoadmapService.addNoteToSavedRoadmap(userId, roadmapSlug, notes);
    
    res.json({
      success,
      message: success ? 'Notes updated successfully' : 'Failed to update notes'
    });
  } catch (error) {
    console.error('Error updating notes:', error);
    res.status(500).json({
      success: false,
      error: 'Failed to update notes'
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