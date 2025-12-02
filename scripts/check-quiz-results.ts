import * as dotenv from 'dotenv';
dotenv.config();
import { connectToDatabase } from '../lib/mongodb';
import { QuizResultService } from '../lib/models/QuizResult';

async function checkQuizResults() {
  console.log('Connecting to DB...');
  try {
    await connectToDatabase();
    console.log('Connected.');

    const count = await QuizResultService.count();
    console.log(`Total Quiz Results: ${count}`);

    if (count > 0) {
      // We need to access the collection directly or add a method to service to get latest
      // For now, let's just use the service if it has a method, or add one.
      // Looking at previous file views, QuizResultService might not have a 'getAll' or 'getLatest'.
      // Let's check the file content first or just try to use the underlying model if exported, 
      // but the service wraps it.
      // Let's assume we can add a temporary method or just use the native client since we have connectToDatabase.
      
      const { db } = await connectToDatabase();
      const results = await db.collection('quiz_results')
        .find({})
        .sort({ completedAt: -1 })
        .limit(3)
        .toArray();

      console.log('\nLatest 3 Quiz Results:');
      results.forEach((r: any) => {
        console.log('------------------------------------------------');
        console.log(`ID: ${r._id}`);
        console.log(`Date: ${r.completedAt}`);
        console.log(`Type: ${r.quizType}`);
        console.log(`Answers Hash: ${r.answersHash}`);
        console.log('Result Summary:');
        if (Array.isArray(r.result)) {
            r.result.forEach((res: any, i: number) => {
                console.log(`  ${i + 1}. ${res.career} (${res.roadmapPath})`);
            });
        } else {
            console.log('  Result is not an array:', r.result);
        }
      });
    } else {
        console.log('No quiz results found.');
    }

    process.exit(0);
  } catch (error) {
    console.error('Error checking quiz results:', error);
    process.exit(1);
  }
}

checkQuizResults();
