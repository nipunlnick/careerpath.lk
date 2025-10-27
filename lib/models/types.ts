import { ObjectId } from 'mongodb';

// Base interface for MongoDB documents
export interface BaseDocument {
  _id?: ObjectId;
  createdAt?: Date;
  updatedAt?: Date;
}

// User profile model
export interface UserProfile extends BaseDocument {
  userId: string; // Firebase Auth UID
  email: string;
  displayName?: string;
  photoURL?: string;
  preferences?: {
    interests: string[];
    skillLevel?: string;
    careerStage?: string;
    preferredIndustries?: string[];
  };
  completedQuizzes?: {
    quickQuiz?: {
      completedAt: Date;
      results: any;
    };
    longQuiz?: {
      completedAt: Date;
      results: any;
    };
  };
}

// Career roadmap model
export interface CareerRoadmap extends BaseDocument {
  name: string;
  slug: string;
  category: string;
  description: string;
  steps: RoadmapStep[];
  marketInsights?: MarketInsights;
  difficulty: 'beginner' | 'intermediate' | 'advanced';
  estimatedDuration: string;
  tags: string[];
  isActive: boolean;
}

// Roadmap step model
export interface RoadmapStep {
  step: number;
  title: string;
  description: string;
  duration: string;
  qualifications: string[];
  skills: string[];
  salaryRangeLKR: string;
  institutes: string[];
  prerequisites?: string[];
  resources?: {
    title: string;
    url: string;
    type: 'article' | 'video' | 'course' | 'book';
  }[];
}

// Market insights model
export interface MarketInsights {
  demand: 'high' | 'medium' | 'low';
  salaryRange: {
    min: number;
    max: number;
    currency: string;
  };
  requiredSkills: string[];
  futureOutlook: string;
  jobGrowthRate?: string;
  topEmployers?: string[];
  lastUpdated: Date;
}

// Quiz result model
export interface QuizResult extends BaseDocument {
  userId?: string; // Optional for anonymous users
  answersHash: string; // Hash of answers for caching
  quizType: 'standard' | 'long';
  answers: Record<string, string> | any[]; // Raw answers from quiz components
  result: any; // Gemini API response
  completedAt: Date;
}

// Saved roadmap model
export interface SavedRoadmap extends BaseDocument {
  userId: string;
  roadmapId: ObjectId;
  roadmapName: string;
  progress?: {
    completedSteps: number[];
    currentStep: number;
    progressPercentage: number;
  };
  notes?: string;
  savedAt: Date;
  lastAccessedAt: Date;
}

// Career category model
export interface CareerCategory extends BaseDocument {
  name: string;
  slug: string;
  icon: string;
  description?: string;
  careers: {
    name: string;
    slug: string;
    roadmapId?: ObjectId;
  }[];
  displayOrder: number;
  isActive: boolean;
}

// User activity/analytics model
export interface UserActivity extends BaseDocument {
  userId?: string; // Optional for anonymous users
  sessionId: string;
  action: string;
  resource: string;
  metadata?: {
    [key: string]: any;
  };
  timestamp: Date;
  userAgent?: string;
  ipAddress?: string;
}

// Feedback model
export interface UserFeedback extends BaseDocument {
  userId?: string;
  email?: string;
  type: 'bug' | 'feature' | 'general' | 'roadmap';
  subject: string;
  message: string;
  rating?: number;
  status: 'open' | 'in-progress' | 'resolved' | 'closed';
  relatedResource?: string;
  submittedAt: Date;
}