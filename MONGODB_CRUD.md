# MongoDB CRUD Operations for CareerPath.lk

This document provides comprehensive information about the MongoDB CRUD operations implemented for the CareerPath.lk website.

## 📋 Table of Contents

1. [Overview](#overview)
2. [Database Schema](#database-schema)
3. [Installation & Setup](#installation--setup)
4. [Database Models](#database-models)
5. [API Operations](#api-operations)
6. [React Hooks](#react-hooks)
7. [Usage Examples](#usage-examples)
8. [Scripts](#scripts)

## 🎯 Overview

The MongoDB integration provides a complete CRUD (Create, Read, Update, Delete) system for managing:

- **User Profiles** - User account information and preferences
- **Career Roadmaps** - Career path data with steps and insights
- **Quiz Results** - Career assessment results and analytics
- **Saved Roadmaps** - User's saved career paths with progress tracking
- **User Activities** - Analytics and user behavior tracking

## 🗄️ Database Schema

### Collections:

1. **userProfiles** - User account data
2. **careerRoadmaps** - Career roadmap information
3. **quizResults** - Quiz completion data
4. **savedRoadmaps** - User's saved roadmaps
5. **userActivities** - User activity logs

## 🚀 Installation & Setup

### 1. Install Dependencies

```bash
npm install mongodb mongoose @types/mongodb dotenv tsx
```

### 2. Environment Variables

Add to your `.env.local` file:

```bash
# MongoDB Configuration
MONGODB_URI=mongodb://localhost:27017
MONGODB_DB=careerpath_lk
```

### 3. Initialize Database

```bash
# Initialize database collections and indexes
npm run db:init

# Seed roadmap data from JSON files
npm run db:seed
```

## 🏗️ Database Models

### UserProfile

```typescript
interface UserProfile {
  _id?: ObjectId;
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
    quickQuiz?: { completedAt: Date; results: any };
    longQuiz?: { completedAt: Date; results: any };
  };
  createdAt?: Date;
  updatedAt?: Date;
}
```

### CareerRoadmap

```typescript
interface CareerRoadmap {
  _id?: ObjectId;
  name: string;
  slug: string;
  category: string;
  description: string;
  steps: RoadmapStep[];
  marketInsights?: MarketInsights;
  difficulty: "beginner" | "intermediate" | "advanced";
  estimatedDuration: string;
  tags: string[];
  isActive: boolean;
  createdAt?: Date;
  updatedAt?: Date;
}
```

### QuizResult

```typescript
interface QuizResult {
  _id?: ObjectId;
  userId?: string;
  sessionId: string;
  quizType: "quick" | "long";
  answers: { questionId: string; answer: string | string[] }[];
  results: {
    topCareers: { career: string; score: number; reasoning: string }[];
    personalityType?: string;
    recommendedSkills?: string[];
  };
  completedAt: Date;
  createdAt?: Date;
  updatedAt?: Date;
}
```

## 🔧 API Operations

### User Profile Operations

```typescript
import { UserProfileService } from "./lib/models";

// Create user profile
const result = await UserProfileService.create({
  userId: "firebase-uid",
  email: "user@example.com",
  displayName: "John Doe",
});

// Get user profile
const profile = await UserProfileService.getByUserId("firebase-uid");

// Update profile
await UserProfileService.update("firebase-uid", {
  displayName: "Updated Name",
});

// Update preferences
await UserProfileService.updatePreferences("firebase-uid", {
  interests: ["technology", "design"],
  skillLevel: "intermediate",
});
```

### Roadmap Operations

```typescript
import { CareerRoadmapService } from "./lib/models";

// Get roadmap by slug
const roadmap = await CareerRoadmapService.getBySlug("software-engineer");

// Search roadmaps
const results = await CareerRoadmapService.search("software", 10);

// Get roadmaps by category
const techRoadmaps = await CareerRoadmapService.getByCategory("Technology");

// Get all active roadmaps
const allRoadmaps = await CareerRoadmapService.getAllActive();
```

### Quiz Operations

```typescript
import { QuizResultService } from './lib/models';

// Save quiz result
const quizResult = await QuizResultService.create({
  userId: 'firebase-uid',
  sessionId: 'session-123',
  quizType: 'quick',
  answers: [...],
  results: {...},
  completedAt: new Date()
});

// Get user's quiz results
const userResults = await QuizResultService.getByUserId('firebase-uid');

// Get quiz statistics
const stats = await QuizResultService.getStats();
```

## ⚛️ React Hooks

### useUserProfile Hook

```typescript
import { useUserProfile } from "./hooks/api/useUserProfile";

function ProfileComponent({ userId }) {
  const { profile, loading, error, updateProfile, updatePreferences } =
    useUserProfile(userId);

  const handleUpdateProfile = async () => {
    await updateProfile({ displayName: "New Name" });
  };

  if (loading) return <div>Loading...</div>;
  if (error) return <div>Error: {error}</div>;

  return (
    <div>
      <h1>{profile?.displayName}</h1>
      <button onClick={handleUpdateProfile}>Update</button>
    </div>
  );
}
```

### useRoadmaps Hook

```typescript
import { useRoadmaps, useRoadmap } from "./hooks/api/useRoadmaps";

function RoadmapsPage() {
  const { roadmaps, loading, searchRoadmaps } = useRoadmaps();

  const handleSearch = async (query: string) => {
    const results = await searchRoadmaps(query);
    console.log(results);
  };

  return (
    <div>
      {roadmaps.map((roadmap) => (
        <div key={roadmap._id}>{roadmap.name}</div>
      ))}
    </div>
  );
}

function RoadmapDetailPage({ slug }) {
  const { roadmap, loading, error } = useRoadmap(slug, "slug");

  if (loading) return <div>Loading...</div>;
  if (!roadmap) return <div>Not found</div>;

  return (
    <div>
      <h1>{roadmap.name}</h1>
      <p>{roadmap.description}</p>
    </div>
  );
}
```

### useQuiz Hook

```typescript
import { useQuiz } from "./hooks/api/useQuiz";

function QuizComponent() {
  const { saveQuizResult, loading } = useQuiz();

  const handleSubmitQuiz = async (answers: any[]) => {
    const result = await saveQuizResult({
      sessionId: "session-123",
      quizType: "quick",
      answers,
      results: { topCareers: [] },
    });

    if (result.success) {
      console.log("Quiz saved!");
    }
  };

  return (
    <div>
      {/* Quiz UI */}
      <button onClick={() => handleSubmitQuiz([])} disabled={loading}>
        Submit Quiz
      </button>
    </div>
  );
}
```

## 💡 Usage Examples

### Complete User Registration Flow

```typescript
import { useAuth } from "./contexts/AuthContext";
import { useUserProfile } from "./hooks/api/useUserProfile";

function useUserRegistration() {
  const { user } = useAuth();
  const { upsertProfile } = useUserProfile(user?.uid);

  const registerUser = async (additionalData: any) => {
    if (!user) return;

    await upsertProfile({
      userId: user.uid,
      email: user.email!,
      displayName: user.displayName || "",
      photoURL: user.photoURL || "",
      ...additionalData,
    });
  };

  return { registerUser };
}
```

### Quiz Result Processing

```typescript
import { useQuiz } from "./hooks/api/useQuiz";
import { UserActivityService } from "./lib/models";

function useQuizSubmission(userId?: string) {
  const { saveQuizResult } = useQuiz();

  const submitQuiz = async (quizData: any) => {
    // Save quiz result
    const result = await saveQuizResult({
      userId,
      sessionId: generateSessionId(),
      ...quizData,
    });

    // Track activity
    if (result.success) {
      await UserActivityService.trackQuizCompletion(
        userId,
        quizData.sessionId,
        quizData.quizType
      );
    }

    return result;
  };

  return { submitQuiz };
}
```

## 🛠️ Scripts

### Database Initialization

```bash
npm run db:init
```

- Creates collections with validation schemas
- Sets up indexes for performance
- Seeds initial sample data

### Data Seeding

```bash
npm run db:seed
```

- Imports roadmap data from JSON files
- Creates or updates existing roadmaps
- Categorizes and tags roadmaps automatically

## 🔍 Indexes & Performance

The system creates optimized indexes for:

- **User lookups** by userId and email
- **Roadmap searches** by slug, category, and text content
- **Quiz analytics** by user, session, and completion date
- **Activity tracking** with automatic expiration after 1 year

## 🔒 Security & Validation

- **Schema validation** on all collections
- **Unique constraints** on critical fields
- **Data sanitization** in API operations
- **Error handling** with informative messages

## 📊 Analytics & Insights

The system provides analytics through:

- **Quiz statistics** - completion rates, popular careers
- **User activity tracking** - page views, interactions
- **Roadmap analytics** - most saved, category distribution
- **Performance metrics** - response times, usage patterns

## 🚀 Getting Started

1. **Start MongoDB** (local or cloud)
2. **Initialize database**: `npm run db:init`
3. **Seed data**: `npm run db:seed`
4. **Start development**: `npm run dev`

The CRUD operations are now fully integrated and ready to use throughout the application!

## 🤝 Contributing

When adding new features:

1. Update the database models in `lib/models/types.ts`
2. Add service methods in appropriate model files
3. Create API endpoints in the `api/` directory
4. Add React hooks in `hooks/api/`
5. Update this documentation
