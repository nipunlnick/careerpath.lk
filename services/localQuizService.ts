import fs from 'fs';
import path from 'path';
import type { CareerSuggestion } from '../types';
import { QuizPatternService } from '../lib/models/QuizPattern';

interface QuizPattern {
  id: string;
  pattern: Record<string, string>;
  suggestions: CareerSuggestion[];
}

interface QuizMappings {
  standard: {
    patterns: QuizPattern[];
    fallback: CareerSuggestion[];
  };
  long: {
    patterns: QuizPattern[];
    fallback: CareerSuggestion[];
  };
}

class LocalQuizService {
  private mappings: QuizMappings | null = null;

  constructor() {
    this.loadMappings();
  }

  private loadMappings(): void {
    try {
      const mappingsPath = path.join(process.cwd(), 'data', 'quiz-mappings.json');
      const mappingsData = fs.readFileSync(mappingsPath, 'utf8');
      this.mappings = JSON.parse(mappingsData);
      console.log('✅ Quiz mappings loaded successfully');
    } catch (error) {
      console.error('❌ Failed to load quiz mappings:', error);
      this.mappings = null;
    }
  }

  /**
   * Calculate similarity between user answers and a pattern
   */
  private calculatePatternSimilarity(
    answers: Record<string, string>, 
    pattern: Record<string, string>
  ): number {
    const patternKeys = Object.keys(pattern);
    let matchCount = 0;
    let totalKeys = patternKeys.length;

    for (const key of patternKeys) {
      if (answers[key] && answers[key] === pattern[key]) {
        matchCount++;
      }
    }

    return totalKeys > 0 ? matchCount / totalKeys : 0;
  }

  /**
   * Find the best matching pattern for given answers
   */
  private findBestPattern(
    answers: Record<string, string>,
    quizType: 'standard' | 'long'
  ): QuizPattern | null {
    if (!this.mappings) {
      console.warn('Quiz mappings not loaded');
      return null;
    }

    const patterns = this.mappings[quizType]?.patterns || [];
    let bestMatch: QuizPattern | null = null;
    let bestScore = 0;

    for (const pattern of patterns) {
      const similarity = this.calculatePatternSimilarity(answers, pattern.pattern);
      
      if (similarity > bestScore) {
        bestScore = similarity;
        bestMatch = pattern;
      }
    }

    // Only return a match if it's reasonably good (at least 60% similarity)
    if (bestScore >= 0.6) {
      console.log(`Found pattern match: ${bestMatch?.id} with ${(bestScore * 100).toFixed(1)}% similarity`);
      return bestMatch;
    }

    console.log(`No good pattern match found. Best score: ${(bestScore * 100).toFixed(1)}%`);
    return null;
  }

  /**
   * Get career suggestions based on quiz answers (with database support)
   */
  public async getSuggestions(
    answers: Record<string, string>,
    quizType: 'standard' | 'long' = 'standard'
  ): Promise<CareerSuggestion[]> {
    try {
      // First try to get patterns from database
      const dbMatches = await QuizPatternService.findByPattern(answers, quizType, 0.6);
      
      if (dbMatches.length > 0) {
        console.log(`Using database pattern: ${dbMatches[0].pattern.id} with ${(dbMatches[0].similarity * 100).toFixed(1)}% similarity`);
        return dbMatches[0].pattern.suggestions;
      }
      
      console.log('No database matches found, falling back to JSON mappings');
    } catch (error) {
      console.warn('Database query failed, falling back to JSON mappings:', error);
    }

    // Fallback to JSON-based patterns
    if (!this.mappings) {
      console.error('Quiz mappings not available, using empty fallback');
      return [];
    }

    // Try to find the best matching pattern
    const bestPattern = this.findBestPattern(answers, quizType);
    
    if (bestPattern) {
      console.log(`Using JSON pattern-based suggestions for: ${bestPattern.id}`);
      return bestPattern.suggestions;
    }

    // Fall back to default suggestions if no good pattern match
    console.log(`Using fallback suggestions for ${quizType} quiz`);
    return this.mappings[quizType]?.fallback || [];
  }

  /**
   * Get suggestions with partial matching for more flexible results
   */
  public async getSuggestionsWithPartialMatching(
    answers: Record<string, string>,
    quizType: 'standard' | 'long' = 'standard',
    minSimilarity: number = 0.4
  ): Promise<CareerSuggestion[]> {
    try {
      // First try to get patterns from database
      const dbMatches = await QuizPatternService.findByPattern(answers, quizType, minSimilarity);
      
      if (dbMatches.length > 0) {
        console.log(`Using database patterns: ${dbMatches.length} matches found`);
        
        // Sort by similarity score (best first)
        dbMatches.sort((a, b) => b.similarity - a.similarity);
        
        // Take suggestions from the best match, or combine multiple if they have similar scores
        const bestScore = dbMatches[0].similarity;
        const topMatches = dbMatches.filter(match => match.similarity >= bestScore - 0.1);

        if (topMatches.length === 1) {
          console.log(`Using single database pattern: ${topMatches[0].pattern.id} (${(bestScore * 100).toFixed(1)}%)`);
          return topMatches[0].pattern.suggestions;
        }

        // Combine suggestions from multiple similar patterns
        console.log(`Combining suggestions from ${topMatches.length} similar database patterns`);
        const combinedSuggestions: CareerSuggestion[] = [];
        const seenCareers = new Set<string>();

        for (const match of topMatches) {
          for (const suggestion of match.pattern.suggestions) {
            if (!seenCareers.has(suggestion.career)) {
              combinedSuggestions.push(suggestion);
              seenCareers.add(suggestion.career);
            }
          }
        }

        return combinedSuggestions.slice(0, 3);
      }
      
      console.log('No database matches found, falling back to JSON mappings');
    } catch (error) {
      console.warn('Database query failed, falling back to JSON mappings:', error);
    }

    // Fallback to JSON-based patterns
    if (!this.mappings) {
      return [];
    }

    const patterns = this.mappings[quizType]?.patterns || [];
    const matchedPatterns: Array<{ pattern: QuizPattern; score: number }> = [];

    // Find all patterns that meet minimum similarity
    for (const pattern of patterns) {
      const similarity = this.calculatePatternSimilarity(answers, pattern.pattern);
      
      if (similarity >= minSimilarity) {
        matchedPatterns.push({ pattern, score: similarity });
      }
    }

    if (matchedPatterns.length === 0) {
      console.log('No patterns meet minimum similarity, using fallback');
      return this.mappings[quizType]?.fallback || [];
    }

    // Sort by similarity score (best first)
    matchedPatterns.sort((a, b) => b.score - a.score);

    // Take suggestions from the best match, or combine multiple if they have similar scores
    const bestScore = matchedPatterns[0].score;
    const topMatches = matchedPatterns.filter(match => match.score >= bestScore - 0.1);

    if (topMatches.length === 1) {
      console.log(`Using single JSON pattern: ${topMatches[0].pattern.id} (${(bestScore * 100).toFixed(1)}%)`);
      return topMatches[0].pattern.suggestions;
    }

    // Combine suggestions from multiple similar patterns
    console.log(`Combining suggestions from ${topMatches.length} similar JSON patterns`);
    const combinedSuggestions: CareerSuggestion[] = [];
    const seenCareers = new Set<string>();

    for (const match of topMatches) {
      for (const suggestion of match.pattern.suggestions) {
        if (!seenCareers.has(suggestion.career)) {
          combinedSuggestions.push(suggestion);
          seenCareers.add(suggestion.career);
        }
      }
    }

    // Limit to top 3 suggestions
    return combinedSuggestions.slice(0, 3);
  }

  /**
   * Add a new pattern to the mappings (for future expansion)
   */
  public addPattern(
    quizType: 'standard' | 'long',
    pattern: QuizPattern
  ): boolean {
    if (!this.mappings) {
      return false;
    }

    this.mappings[quizType].patterns.push(pattern);
    
    // Optionally save back to file
    try {
      const mappingsPath = path.join(process.cwd(), 'data', 'quiz-mappings.json');
      fs.writeFileSync(mappingsPath, JSON.stringify(this.mappings, null, 2));
      console.log(`✅ Added new pattern: ${pattern.id}`);
      return true;
    } catch (error) {
      console.error('❌ Failed to save new pattern:', error);
      return false;
    }
  }

  /**
   * Get all available patterns for a quiz type
   */
  public getPatterns(quizType: 'standard' | 'long'): QuizPattern[] {
    return this.mappings?.[quizType]?.patterns || [];
  }

  /**
   * Analyze answers to provide insights (for debugging/analytics)
   */
  public analyzeAnswers(
    answers: Record<string, string>,
    quizType: 'standard' | 'long' = 'standard'
  ): {
    answersCount: number;
    bestMatch: { id: string; score: number } | null;
    allMatches: Array<{ id: string; score: number }>;
  } {
    if (!this.mappings) {
      return {
        answersCount: Object.keys(answers).length,
        bestMatch: null,
        allMatches: []
      };
    }

    const patterns = this.mappings[quizType]?.patterns || [];
    const allMatches: Array<{ id: string; score: number }> = [];

    for (const pattern of patterns) {
      const similarity = this.calculatePatternSimilarity(answers, pattern.pattern);
      allMatches.push({ id: pattern.id, score: similarity });
    }

    // Sort by score
    allMatches.sort((a, b) => b.score - a.score);

    return {
      answersCount: Object.keys(answers).length,
      bestMatch: allMatches.length > 0 ? allMatches[0] : null,
      allMatches
    };
  }
}

// Export singleton instance
export const localQuizService = new LocalQuizService();
export default LocalQuizService;