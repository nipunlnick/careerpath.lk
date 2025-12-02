import { NextRequest, NextResponse } from 'next/server';
import { QuizResultService } from '@/lib/models/QuizResult';

export async function GET(
  request: NextRequest,
  { params }: { params: Promise<{ hash: string }> }
) {
  try {
    const { hash } = await params;
    const searchParams = request.nextUrl.searchParams;
    const quizType = searchParams.get('quizType');

    const cachedResult = await QuizResultService.findByHash(hash, quizType as string);

    if (cachedResult) {
      return NextResponse.json({
        success: true,
        cached: true,
        result: cachedResult.result,
        timestamp: cachedResult.createdAt
      });
    } else {
      return NextResponse.json({
        success: true,
        cached: false,
        result: null
      });
    }
  } catch (error) {
    console.error('Error looking up quiz result:', error);
    return NextResponse.json({
      success: false,
      error: 'Failed to lookup quiz result'
    }, { status: 500 });
  }
}
