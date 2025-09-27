import { editEmail, generateEmail } from '@/services/openai/openai-stream';
import { NextRequest, NextResponse } from 'next/server';

export async function POST(request: NextRequest) {
  try {
    const formData = await request.formData();
    const mail_content = formData.get('mail_content') as string ?? "";
    const edit_instructions = formData.get('edit_instructions') as string ?? "";
    
    const readableStreamResponse = await editEmail({
        emailContent: mail_content,
        editInstructions: edit_instructions,
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
