import { NextRequest, NextResponse } from 'next/server';
import { QuizResultService } from '@/lib/models/QuizResult';
import { CareerRoadmapService } from '@/lib/models/CareerRoadmap';
import { localQuizService } from '@/services/localQuizService';
import crypto from 'crypto';

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

export async function POST(request: NextRequest) {
  try {
    const body = await request.json();
    const { answers, quizType, userId } = body;

    if (!answers) {
      return NextResponse.json({
        success: false,
        error: 'Answers are required'
      }, { status: 400 });
    }

    let answersForHashing: any;
    let answersForAPI: Record<string, string>;

    if (Array.isArray(answers)) {
      answersForHashing = answers;
      answersForAPI = answers.reduce((acc, answer, index) => {
        acc[`q${index}`] = typeof answer === 'string' ? answer : JSON.stringify(answer);
        return acc;
      }, {} as Record<string, string>);
    } else {
      answersForHashing = answers;
      answersForAPI = answers as Record<string, string>;
    }

    const answersHash = generateAnswersHash(answersForHashing);
    
    // Map quizType to DB schema ('quick' | 'long')
    const dbQuizType = (quizType === 'long' ? 'long' : 'quick') as 'quick' | 'long';
    
    const existingResult = await QuizResultService.findByHash(answersHash, dbQuizType);

    if (existingResult) {
      return NextResponse.json({
        success: true,
        cached: true,
        result: existingResult.results,
        hash: answersHash,
        source: 'database'
      });
    }

    // Generate using Local Pattern Matching Service (Gemini Disabled)
    
    const careerSuggestions = await localQuizService.getSuggestions(
      answersForAPI, 
      quizType === 'long' ? 'long' : 'standard'
    );

    if (!careerSuggestions || careerSuggestions.length === 0) {
      throw new Error('Failed to generate suggestions from Local service');
    }

    const enhancedSuggestions = await Promise.all(
      careerSuggestions.map(async (suggestion: any) => {
        try {
          const careerName = suggestion.roadmapPath || suggestion.career;
          const slug = careerName.toLowerCase()
            .replace(/[^a-z0-9]+/g, '-')
            .replace(/(^-|-$)/g, '');

          // Check if roadmap exists, but DO NOT generate if missing (to avoid Gemini call)
          // let existingRoadmap = await CareerRoadmapService.getBySlug(slug);

          return {
            career: suggestion.career,
            description: suggestion.description,
            reasoning: suggestion.reasoning,
            roadmapPath: suggestion.roadmapPath,
            roadmapSlug: slug
          };
        } catch (error) {
          console.error(`Error processing suggestion ${suggestion.career}:`, error);
          return {
            career: suggestion.career,
            description: suggestion.description,
            reasoning: suggestion.reasoning,
            roadmapPath: suggestion.roadmapPath
          };
        }
      })
    );

    await QuizResultService.create({
      userId,
      sessionId: crypto.randomUUID(),
      answersHash,
      answers: answersForHashing,
      results: enhancedSuggestions,
      quizType: dbQuizType,
      completedAt: new Date()
    });

    return NextResponse.json({
      success: true,
      cached: false,
      result: enhancedSuggestions,
      hash: answersHash,
      roadmapsGenerated: 0, // No roadmaps generated in local-only mode
      source: 'local-patterns'
    });

  } catch (error) {
    console.error('Error generating quiz result:', JSON.stringify(error, Object.getOwnPropertyNames(error)));
    return NextResponse.json({
      success: false,
      error: error instanceof Error ? error.message : 'Failed to generate quiz result'
    }, { status: 500 });
  }
}
