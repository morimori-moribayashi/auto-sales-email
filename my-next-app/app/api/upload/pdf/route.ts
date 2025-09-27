import { convertPDFtoMD } from '@/services/openai/openai';
import { NextRequest, NextResponse } from 'next/server';

export async function POST(request: NextRequest) {
  try {
    const formData = await request.formData();
    const file = formData.get('file') as File;
    
    if (!file) {
      return NextResponse.json(
        { error: 'ファイルが見つかりません' },
        { status: 400 }
      );
    }

    // PDFファイルかどうかをチェック
    if (file.type !== 'application/pdf') {
      return NextResponse.json(
        { error: 'PDFファイルのみアップロード可能です' },
        { status: 400 }
      );
    }

    // ファイルサイズチェック（10MB以下）
    if (file.size > 30 * 1024 * 1024) {
      return NextResponse.json(
        { error: 'ファイルサイズは30MB以下にしてください' },
        { status: 400 }
      );
    }

    // ファイルをBase64に変換
    const arrayBuffer = await file.arrayBuffer();
    const base64String = Buffer.from(arrayBuffer).toString('base64');
    const markdown = await convertPDFtoMD(base64String, file.name)

    return NextResponse.json({
      markdown
    });

  } catch (error) {
    console.error('PDFアップロードエラー:', error);
    return NextResponse.json(
      { error: 'ファイルアップロード中にエラーが発生しました' },
      { status: 500 }
    );
  }
}
