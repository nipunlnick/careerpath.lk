import { QuizResultService } from '../../lib/models';

import { createHash } from 'crypto';

// API endpoints for quiz operations
export async function saveQuizResult(quizData: {
  userId?: string;
  sessionId: string;
  quizType: 'quick' | 'long';
  answers: any[];
  results: any;
}) {
  try {
    const answersHash = createHash('md5').update(JSON.stringify(quizData.answers)).digest('hex');
    
    const result = await QuizResultService.create({
      userId: quizData.userId,
      sessionId: quizData.sessionId,
      quizType: quizData.quizType === 'quick' ? 'quick' : 'long',
      answers: quizData.answers,
      results: quizData.results,
      answersHash,
      completedAt: new Date()
    });
    return { success: true, data: result };
  } catch (error) {
    console.error('Error saving quiz result:', error);
    return { success: false, error: 'Failed to save quiz result' };
  }
}

export async function getQuizResult(id: string) {
  try {
    const result = await QuizResultService.getById(id);
    return { success: true, data: result };
  } catch (error) {
    console.error('Error getting quiz result:', error);
    return { success: false, error: 'Failed to get quiz result' };
  }
}

export async function getQuizResultBySession(sessionId: string) {
  try {
    const result = await QuizResultService.getBySessionId(sessionId);
    return { success: true, data: result };
  } catch (error) {
    console.error('Error getting quiz result by session:', error);
    return { success: false, error: 'Failed to get quiz result' };
  }
}

export async function getUserQuizResults(userId: string, limit: number = 10) {
  try {
    const results = await QuizResultService.findByUserId(userId);
    return { success: true, data: results };
  } catch (error) {
    console.error('Error getting user quiz results:', error);
    return { success: false, error: 'Failed to get quiz results' };
  }
}

export async function getLatestUserQuizResult(userId: string, quizType: 'quick' | 'long') {
  try {
    const result = await QuizResultService.getLatestByUserAndType(userId, quizType === 'quick' ? 'quick' : 'long');
    return { success: true, data: result };
  } catch (error) {
    console.error('Error getting latest quiz result:', error);
    return { success: false, error: 'Failed to get latest quiz result' };
  }
}

export async function getQuizStats() {
  try {
    const stats = await QuizResultService.getStats();
    return { success: true, data: stats };
  } catch (error) {
    console.error('Error getting quiz stats:', error);
    return { success: false, error: 'Failed to get quiz stats' };
  }
}

export async function getPopularCareers(limit: number = 10) {
  try {
    const careers = await QuizResultService.getPopularCareers(limit);
    return { success: true, data: careers };
  } catch (error) {
    console.error('Error getting popular careers:', error);
    return { success: false, error: 'Failed to get popular careers' };
  }
}

export async function deleteQuizResult(id: string) {
  try {
    const result = await QuizResultService.delete(id);
    return { success: true, data: result };
  } catch (error) {
    console.error('Error deleting quiz result:', error);
    return { success: false, error: 'Failed to delete quiz result' };
  }
}