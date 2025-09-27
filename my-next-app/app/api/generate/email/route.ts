import { generateEmail } from '@/services/openai/openai-stream';
import { NextRequest, NextResponse } from 'next/server';

export async function POST(request: NextRequest) {
  try {
    const formData = await request.formData();
    const project_info = formData.get('project_info') as string ?? "";
    const engineerInfo = formData.get('engineerInfo') as string ?? "";
    const email_template = formData.get('email_template') as string ?? "";
    const system_prompt = formData.get('system_prompt') as string ?? "";
    
    const readableStreamResponse = await generateEmail({
      projectContent: project_info,
      engineerInfo,
      emailTemplate: email_template,
      prompt: system_prompt,
    });
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
