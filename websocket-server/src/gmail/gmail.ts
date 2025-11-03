import { google } from 'googleapis';
import dotenv from 'dotenv';

// 型定義
interface GmailSearchMessage {
  id?: string;
  threadId?: string;
}

interface SearchSuccessResult {
  success: true;
  resultSizeEstimate?: number | null;
  messages: GmailSearchMessage[];
}

interface SearchErrorResult {
  success: false;
  error: string;
}

interface ParallelSearchResult {
  query: string;
  resultSizeEstimate?: number | null;
  messages: GmailSearchMessage[];
  error?: string;
}

interface ParallelSearchSuccessResult {
  success: true;
  results: ParallelSearchResult[];
}

interface MessageWithError {
  id: string;
  error: string;
}

interface MessageBatchSuccessResult {
  success: true;
  messages: Array<any | MessageWithError>;
}

interface FullMessage {
  id?: string | null;
  threadId?: string | null;
  snippet?: string | null;
  from?: string | null;
  to?: string | null;
  subject?: string | null;
  date?: string | null;
  body?: string | null;
}

interface FullSearchSuccessResult {
  success: true;
  count: number;
  messages: FullMessage[];
}

interface RateLimitedSearchResult {
  query: string;
  messages: GmailSearchMessage[];
}

interface RateLimitedSearchSuccessResult {
  success: true;
  results: RateLimitedSearchResult[];
}

interface AuthTokenSuccessResult {
  success: true;
  refreshToken?: string | null;
  accessToken?: string | null;
}

dotenv.config();

// OAuth2クライアントの設定
const oauth2Client = new google.auth.OAuth2(
  process.env.GMAIL_CLIENT_ID,
  process.env.GMAIL_CLIENT_SECRET,
  process.env.GMAIL_REDIRECT_URI
);

// 認証用トークンを設定（事前に取得したもの）
oauth2Client.setCredentials({
  refresh_token: process.env.GMAIL_REFRESH_TOKEN
});

const gmail = google.gmail({ version: 'v1', auth: oauth2Client });

// =====================================
// 1. 単純な検索
// =====================================
export async function searchGmail(query: string, maxResults: number = 50): Promise<SearchSuccessResult | SearchErrorResult> {
  try {
    const response = await gmail.users.messages.list({
      userId: 'me',
      q: query,
      maxResults
    });

    return {
      success: true,
      resultSizeEstimate: response.data.resultSizeEstimate,
      messages: (response.data.messages || []) as GmailSearchMessage[]
    };
  } catch (error) {
    console.error('Search error:', error);
    return { success: false, error: (error as Error).message };
  }
}

// =====================================
// 2. 並列検索（複数クエリを同時実行）
// =====================================
export async function searchGmailParallel(queries: string[], maxResults: number = 50): Promise<ParallelSearchSuccessResult | SearchErrorResult> {
  try {
    if (!Array.isArray(queries) || queries.length === 0) {
      return { 
        success: false, 
        error: 'queries must be a non-empty array' 
      };
    }

    // 並列実行
    const searchPromises = queries.map(async (query: string) => {
      try {
        const response = await gmail.users.messages.list({
          userId: 'me',
          q: query,
          maxResults
        });
        return {
          query,
          resultSizeEstimate: response.data.resultSizeEstimate,
          messages: (response.data.messages || []) as GmailSearchMessage[]
        };
      } catch (error) {
        return {
          query,
          error: (error as Error).message,
          messages: []
        };
      }
    });

    const results = await Promise.all(searchPromises);

    return {
      success: true,
      results
    };
  } catch (error) {
    console.error('Parallel search error:', error);
    return { success: false, error: (error as Error).message };
  }
}

// =====================================
// 3. メッセージ詳細を並列取得
// =====================================
export async function getMessagesBatch(messageIds: string[]): Promise<MessageBatchSuccessResult | SearchErrorResult> {
  try {
    if (!Array.isArray(messageIds) || messageIds.length === 0) {
      return { 
        success: false, 
        error: 'messageIds must be a non-empty array' 
      };
    }

    // 並列でメッセージ詳細を取得
    const messagePromises = messageIds.map(async (id: string) => {
      try {
        const response = await gmail.users.messages.get({
          userId: 'me',
          id,
          format: 'metadata', // 'full', 'metadata', 'minimal', 'raw'
          metadataHeaders: ['From', 'To', 'Subject', 'Date']
        });
        return response.data;
      } catch (error) {
        return {
          id,
          error: (error as Error).message
        };
      }
    });

    const messages = await Promise.all(messagePromises);

    return {
      success: true,
      messages
    };
  } catch (error) {
    console.error('Batch get error:', error);
    return { success: false, error: (error as Error).message };
  }
}

// =====================================
// 4. 検索 + 詳細取得（パイプライン実行）
// =====================================
export async function searchGmailFull(queries: string[],date?: Date, maxResults: number = 20): Promise<FullSearchSuccessResult | SearchErrorResult> {
  try {
    queries = queries.map(query => {
        if(date){
            const formattedDate = date.toISOString().split('T')[0];
            return `${query} before:${formattedDate} after:${formattedDate}`;
        }
        return query;
    });
    // ステップ1: メッセージIDを検索
    const searchResponse = await searchGmailParallel(queries, maxResults);

    if (!searchResponse.success) {
      return searchResponse;
    }

    const messageIds: string[] = [];
    searchResponse.results.forEach(result => {
      result.messages.forEach(message => {
        if (message.id) {
          messageIds.push(message.id);
        }
      });
    });

    if (messageIds.length === 0) {
      return {
        success: true,
        count: 0,
        messages: []
      };
    }

    // ステップ2: 詳細を並列取得
    const messagePromises = messageIds.map(async (id: string) => {
      const response = await gmail.users.messages.get({
        userId: 'me',
        id,
        format: 'full'
      });
      
      const headers = response.data.payload?.headers;
      
      // メッセージ本文を抽出する関数
      const extractBody = (payload: any): string => {
        if (!payload) return '';
        
        // プレーンテキストを優先
        if (payload.mimeType === 'text/plain' && payload.body?.data) {
          return Buffer.from(payload.body.data, 'base64').toString('utf-8');
        }
        
        // HTMLテキスト
        if (payload.mimeType === 'text/html' && payload.body?.data) {
          return Buffer.from(payload.body.data, 'base64').toString('utf-8');
        }
        
        // マルチパートの場合
        if (payload.parts && Array.isArray(payload.parts)) {
          for (const part of payload.parts) {
            const partBody = extractBody(part);
            if (partBody) return partBody;
          }
        }
        
        return '';
      };
      
      return {
        id: response.data.id,
        threadId: response.data.threadId,
        snippet: response.data.snippet,
        from: headers?.find(h => h.name === 'From')?.value,
        to: headers?.find(h => h.name === 'To')?.value,
        subject: headers?.find(h => h.name === 'Subject')?.value,
        date: headers?.find(h => h.name === 'Date')?.value ?? new Date().toString(),
        body: extractBody(response.data.payload)
      };
    });

    const messages = await Promise.all(messagePromises);

    return {
      success: true,
      count: messages.length,
      messages
    };
  } catch (error) {
    console.error('Full search error:', error);
    return { success: false, error: (error as Error).message };
  }
}

// =====================================
// 5. レート制限を考慮した並列実行
// =====================================
async function parallelWithRateLimit(tasks: any[], limit = 10): Promise<any[]> {
  const results = [];
  for (let i = 0; i < tasks.length; i += limit) {
    const batch = tasks.slice(i, i + limit);
    const batchResults = await Promise.all(batch);
    results.push(...batchResults);
    
    // 次のバッチまで少し待機（オプション）
    if (i + limit < tasks.length) {
      await new Promise(resolve => setTimeout(resolve, 100));
    }
  }
  return results;
}

export async function searchGmailRateLimited(queries: string[], maxResults: number = 50, batchSize: number = 10): Promise<RateLimitedSearchSuccessResult | SearchErrorResult> {
  try {
    const tasks = queries.map((query: string) => async () => {
      const response = await gmail.users.messages.list({
        userId: 'me',
        q: query,
        maxResults
      });
      return {
        query,
        messages: (response.data.messages || []) as GmailSearchMessage[]
      };
    });

    const results = await parallelWithRateLimit(
      tasks.map((task: any) => task()),
      batchSize
    );

    return {
      success: true,
      results
    };
  } catch (error) {
    console.error('Rate limited search error:', error);
    return { success: false, error: (error as Error).message };
  }
}

// =====================================
// OAuth認証（初回設定用）
// =====================================
export function generateAuthUrl(): string {
  return oauth2Client.generateAuthUrl({
    access_type: 'offline',
    scope: [
      'https://www.googleapis.com/auth/gmail.readonly',
      'https://www.googleapis.com/auth/gmail.modify'
    ]
  });
}

export async function exchangeCodeForTokens(code: string): Promise<AuthTokenSuccessResult | SearchErrorResult> {
  try {
    const { tokens } = await oauth2Client.getToken(code);
    return {
      success: true,
      refreshToken: tokens.refresh_token,
      accessToken: tokens.access_token
    };
  } catch (error) {
    return {
      success: false,
      error: (error as Error).message
    };
  }
}