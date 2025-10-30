import { ObjectId } from 'mongodb';
import { connectToDatabase } from '../mongodb';

export interface QuizPattern {
  _id?: ObjectId;
  id: string;
  quizType: 'standard' | 'long';
  pattern: Record<string, string>;
  suggestions: Array<{
    career: string;
    description: string;
    reasoning: string;
    roadmapPath: string;
  }>;
  isActive: boolean;
  createdAt: Date;
  updatedAt: Date;
}

export class QuizPatternService {
  private static collection = 'quizPatterns';

  static async create(patternData: Omit<QuizPattern, '_id' | 'createdAt' | 'updatedAt'>): Promise<QuizPattern> {
    const { db } = await connectToDatabase();
    
    const pattern: QuizPattern = {
      ...patternData,
      createdAt: new Date(),
      updatedAt: new Date()
    };

    const result = await db.collection(this.collection).insertOne(pattern);
    return { ...pattern, _id: result.insertedId };
  }

  static async getById(id: string): Promise<QuizPattern | null> {
    const { db } = await connectToDatabase();
    const result = await db.collection(this.collection).findOne({ id });
    return result ? (result as unknown as QuizPattern) : null;
  }

  static async getByQuizType(quizType: 'standard' | 'long'): Promise<QuizPattern[]> {
    const { db } = await connectToDatabase();
    const results = await db.collection(this.collection)
      .find({ quizType, isActive: true })
      .sort({ createdAt: 1 })
      .toArray();
    return results as unknown as QuizPattern[];
  }

  static async getAll(): Promise<QuizPattern[]> {
    const { db } = await connectToDatabase();
    const results = await db.collection(this.collection)
      .find({ isActive: true })
      .sort({ quizType: 1, createdAt: 1 })
      .toArray();
    return results as unknown as QuizPattern[];
  }

  static async update(id: string, updates: Partial<QuizPattern>): Promise<QuizPattern | null> {
    const { db } = await connectToDatabase();
    
    const result = await db.collection(this.collection).findOneAndUpdate(
      { id },
      { 
        $set: {
          ...updates,
          updatedAt: new Date()
        }
      },
      { returnDocument: 'after' }
    );

    return result.value ? (result.value as unknown as QuizPattern) : null;
  }

  static async delete(id: string): Promise<boolean> {
    const { db } = await connectToDatabase();
    const result = await db.collection(this.collection).updateOne(
      { id },
      { 
        $set: {
          isActive: false,
          updatedAt: new Date()
        }
      }
    );
    return result.modifiedCount > 0;
  }

  static async findByPattern(
    answers: Record<string, string>,
    quizType: 'standard' | 'long',
    minSimilarity: number = 0.6
  ): Promise<Array<{ pattern: QuizPattern; similarity: number }>> {
    const patterns = await this.getByQuizType(quizType);
    const matches: Array<{ pattern: QuizPattern; similarity: number }> = [];

    for (const pattern of patterns) {
      const similarity = this.calculateSimilarity(answers, pattern.pattern);
      if (similarity >= minSimilarity) {
        matches.push({ pattern, similarity });
      }
    }

    // Sort by similarity (highest first)
    matches.sort((a, b) => b.similarity - a.similarity);
    return matches;
  }

  private static calculateSimilarity(
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

  static async getStats(): Promise<{
    totalPatterns: number;
    standardPatterns: number;
    longPatterns: number;
    activePatterns: number;
  }> {
    const { db } = await connectToDatabase();
    
    const [total, standard, long, active] = await Promise.all([
      db.collection(this.collection).countDocuments({}),
      db.collection(this.collection).countDocuments({ quizType: 'standard' }),
      db.collection(this.collection).countDocuments({ quizType: 'long' }),
      db.collection(this.collection).countDocuments({ isActive: true })
    ]);

    return {
      totalPatterns: total,
      standardPatterns: standard,
      longPatterns: long,
      activePatterns: active
    };
  }

  static async seedFromJson(patternsData: any): Promise<{
    created: number;
    updated: number;
    errors: number;
  }> {
    let created = 0;
    let updated = 0;
    let errors = 0;

    try {
      // Process standard quiz patterns
      if (patternsData.standard?.patterns) {
        for (const pattern of patternsData.standard.patterns) {
          try {
            const existing = await this.getById(pattern.id);
            
            if (existing) {
              await this.update(pattern.id, {
                pattern: pattern.pattern,
                suggestions: pattern.suggestions,
                isActive: true
              });
              updated++;
            } else {
              await this.create({
                id: pattern.id,
                quizType: 'standard',
                pattern: pattern.pattern,
                suggestions: pattern.suggestions,
                isActive: true
              });
              created++;
            }
          } catch (error) {
            console.error(`Error processing standard pattern ${pattern.id}:`, error);
            errors++;
          }
        }
      }

      // Process long quiz patterns
      if (patternsData.long?.patterns) {
        for (const pattern of patternsData.long.patterns) {
          try {
            const existing = await this.getById(pattern.id);
            
            if (existing) {
              await this.update(pattern.id, {
                pattern: pattern.pattern,
                suggestions: pattern.suggestions,
                isActive: true
              });
              updated++;
            } else {
              await this.create({
                id: pattern.id,
                quizType: 'long',
                pattern: pattern.pattern,
                suggestions: pattern.suggestions,
                isActive: true
              });
              created++;
            }
          } catch (error) {
            console.error(`Error processing long pattern ${pattern.id}:`, error);
            errors++;
          }
        }
      }
    } catch (error) {
      console.error('Error in seedFromJson:', error);
      errors++;
    }

    return { created, updated, errors };
  }
}

export default QuizPatternService;