import { deepResearch } from '@/services/deep-research/deep-research';
import { generateEmail, generateGmailFilterStream } from '@/services/openai/openai-stream';
import { NextRequest, NextResponse } from 'next/server';

export async function POST(request: NextRequest) {
  try {
    const formData = await request.formData();
    const engineerInfo = formData.get('engineerInfo') as string ?? "";
    const additional_criteria = formData.get('additional_criteria') as string ?? "";
    const history = formData.get('history') as string ?? "";
    const readableStreamResponse = await deepResearch(
        engineerInfo,
        additional_criteria,
    );
    return new Response(readableStreamResponse, {
      headers: {
        "Content-Type": "text/event-stream",
        "Cache-Control": "no-cache",
      },
    });
  } catch (error) {
    console.error('エラ－', error);
    return NextResponse.json(
      { error: `エラーが発生しました ${error}` },
      { status: 500 }
    );
  }
}
