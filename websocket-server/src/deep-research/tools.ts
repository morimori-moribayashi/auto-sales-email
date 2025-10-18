import { schema as filterResponseSchema } from "../openai/model"
import { getGemini, getOpenAI } from "../openai/openai"
import { zodTextFormat } from "openai/helpers/zod.js"
import z from "zod"
import dotenv from "dotenv"
import axios from "axios"

const starategyResponseSchema = z.object({
  strategies: z.array(z.string())
})

const gmailResponseSchema = z.object({
  subject: z.string(),
  body: z.string(),
  from: z.string(),
  date: z.string(),
})

const gmailThreadSchema = z.object({
  subject: z.string(),
  body: z.string(),
  from: z.string(),
  date: z.date(),
})

export type GmailThread = z.infer<typeof gmailThreadSchema>

const qualificationItemSchema = z.object({
  name: z.string(),
  req: z.string(),
  actual: z.string(),
  score: z.number(),
});

dotenv.config();

// Schema for the overall grading structure
export const gradingSchema = z.object({
  score: z.number(),
  grade: z.string(),
  required: z.object({
    score: z.number(),
    max: z.number(),
    items: z.array(qualificationItemSchema),
  }),
  preferred: z.object({
    score: z.number(),
    max: z.number(),
    items: z.array(qualificationItemSchema),
  }),
  analysis: z.object({
    strengths: z.string().array(),
    risks: z.string().array(),
    actions: z.string().array(),
  }),
});

export type GradingData = z.infer<typeof gradingSchema>;
export type GmailThreadWithGrading = GmailThread & GradingData

export async function planningStrategy(engineerInfo: string, additionalCriteria: string, history?: string){
    const openai = await getOpenAI()
    const system_prompt = `
# Gmail検索クエリ作成戦略立案専門AI

あなたは、ITエンジニアの職務経歴書を分析し、その人物に最適なGmail検索クエリ作成戦略を立案する専門AIです。技術的な詳細ではなく、**検索クエリをどのような戦略で構築すべきか**に特化してください。

## 戦略立案プロセス

### Step 1: 候補者の戦略的ポジション分析
- **市場での立ち位置**: 経験年数、技術レベルから市場価値と競合優位性を評価
- **差別化ポイント**: 他の候補者と比較した際の独自の強みを特定
- **成長ベクトル**: 現在のスキルから想定される次のキャリアステップを予測

### Step 2: 検索クエリ戦略の全方位展開
追加指示を考慮しながら、以下のすべての戦略軸からアプローチを展開し、多角的な検索戦略を立案：

**A. 攻めの戦略 & 守りの戦略**
- 攻め：高単価・挑戦的案件を積極的に狙う検索クエリ
- 守り：確実にマッチする安定案件を優先する検索クエリ

**B. 専門特化 & 汎用性重視**
- 専門特化：特定技術・分野に絞り込んだ検索クエリ
- 汎用性重視：幅広い技術でヒットする検索クエリ

**C. 量的拡大 & 質的選別**
- 量的拡大：多くの案件にヒットする広範囲検索クエリ
- 質的選別：厳選された高品質案件のみにヒットする精密検索クエリ

### Step 3: 創造的検索クエリ戦略立案

候補者の職務経歴書と追加指示を基に、**できる限り多角的で創造的な検索クエリ作成戦略**を考案してください。既存の枠組みにとらわれず、以下の観点から独自の戦略を発想し、最低5つの戦略を提案してください：

#### 戦略発想の観点：

**キーワード選択戦略**
- 技術キーワードの組み合わせ方
- 業界・職種キーワードの活用
- トレンドキーワードの取り入れ方

**検索演算子戦略**
- AND/OR/NOT演算子の効果的な使い方
- 括弧による条件グループ化
- ワイルドカード活用

**時間軸戦略**
- 新着案件重視 vs 継続案件重視
- 季節性・タイミングを考慮した検索

**競合回避戦略**
- 人気キーワードの避け方
- ニッチキーワードの発掘
- 逆張りキーワード選択

**段階的絞り込み戦略**
- 広範囲から段階的に絞る方法
- 複数クエリの組み合わせ戦略

**除外キーワード戦略**
- 効果的なノイズ除去
- 不要案件の排除方法

#### 戦略創造プロセス：
1. **制約条件の特定**: 候補者の制約・希望・NGを明確化
2. **キーワード機会の発見**: 市場の隙間・未開拓キーワードを探索
3. **逆張り思考**: 一般的な検索アプローチの逆を考える
4. **組み合わせ思考**: 異なるキーワード要素を掛け合わせる
5. **段階的思考**: 検索の段階や順序を工夫する
6. **視点転換思考**: 採用者・競合・市場の視点で検索クエリを考える

### Step 4: 戦略的リスク評価

各検索クエリ戦略について：
- **主要リスク**の特定（ヒット数過多/過少、ノイズ混入等）
- **リスク軽減策**の提案
- **期待効果**の予測

## 出力フォーマット

\`\`\`json
{
  "strategies": [
    "戦略1: 検索クエリ作成戦略の名前 - どのような考え方でキーワードを選び、どのような検索演算子を使い、どのような効果を狙うかの具体的な戦略説明",
    "戦略2: 検索クエリ作成戦略の名前 - どのような考え方でキーワードを選び、どのような検索演算子を使い、どのような効果を狙うかの具体的な戦略説明"
  ]
}
\`\`\`

---

**重要**: 実際のGmail検索クエリの構文を考えるのではなく、純粋に**検索クエリをどのような戦略・考え方で作成すべきか**に集中してください。キーワード選択、検索演算子の使い方、段階的絞り込みなど、検索クエリ構築の戦略的アプローチが最重要です。
`
  const message = `[エンジニア情報]\n${engineerInfo}\n[追加情報]\n${additionalCriteria}`
  const response = await openai.responses.parse({
    model: "gpt-4.1-nano",
    input: [
      { role: "system", content: system_prompt },
      { role: "user", content: message }
    ],
    text: {
      format: zodTextFormat(starategyResponseSchema,"starategyResponseSchema")
    }
  });
  
  const content = response.output_parsed
  if (!content) throw new Error("No content returned from OpenAI");
  return content
}

export async function generateGmailFilter(engineerInfo: string, additionalCriteria: string, strategy: string, history?: string){
  const openai = await getOpenAI()
  const companyEmailDomain = '@oneness-group.jp'
  const system_prompt = `
【System Prompt: Gmail Filter Design Engine v5.1 TechScout Edition】

1. Agent Configuration
ID: Gmail_Filter_Design_Expert
Objective: Generate Gmail filters optimized for capturing "technical scout job offers" only.
Core Principle: Exclusion-first.

2. Input Schema
user_profile: (Text, Optional) User's resume, skill sheet.
Keys: core_skills, experience_years, career_goals
filter_purpose: (Text, Required) The primary goal of the filter (e.g., tech scout offers).
custom_domain: (String, Optional, Default: oneness-group.jp)
feedback: (Object, Optional)
  type: Enum(LOW_HIT_COUNT, NOISE_DETECTED)
  value: (String, Optional)

3. Processing Logic & Heuristics
Step 1: Initialization
  Template: from:(-(@{{custom_domain}}))

Step 2: Target Keyword Definition (OR Logic)
  Action: Build (key1 OR key2 OR …) using technical stack keywords from user_profile.

Step 3: Strategic Condition Application (AND Logic)
  Action: Combine OR groups with AND if necessary.
  Heuristic: If feedback.type == LOW_HIT_COUNT → relax AND conditions, output broader filters.
  custom_strategy: ${strategy}

Step 4: Exclusion List Construction (NOT Logic)
  Action: Expand exclusions into explicit Gmail syntax: 
    -word1 -word2 -"multi word phrase"
  Apply rules from Exclusion Dictionary:

--- Exclusion Dictionary ---
GROUP_A: BASE_EXCLUSIONS (Always Enabled)
  当社エンジニア
  案件ください
  見合う案件
  注力要員
  Flexibility
  弊社正社員
  弊社フリーランス

GROUP_B: CONTEXTUAL_EXCLUSIONS
  B1: For_Junior_Targeting → exclude 高経験者ワード (経験3年, 経験5年, シニア, リーダー, PM, PL, マネージャー, 要件定義)
  B2: For_Senior_Targeting → exclude 未経験, 若手, 歓迎, ポテンシャル, ジュニア, 育成
  B3: For_Tech_Focus → exclude competing technologies (例: TypeScript/React なら Java, PHP, Ruby を排除)
  B4: For_Role_Focus → exclude competing roles (例: "フロントエンド" 狙いなら バックエンド, インフラ, SRE を排除)

GROUP_C: USER_CONFIGURABLE_EXCLUSIONS
  (ユーザー指定で追加/削除)

GROUP_D: FEEDBACK_DRIVEN_EXCLUSIONS
  動的に feedback.value から追加
--- End Dictionary ---

Step 5: Final String Concatenation
  Assemble filter:
    from:(-(@{{custom_domain}})) (keyword OR keyword ...) -除外ワード -"除外フレーズ"

4. Output Schema & Formatting
Type: Array<Object>
Minimum Length: 1
Object Schema:
  filter_name: (String)
  filter_string: (String)
  rationale: (String)
CRITICAL: filter_string must follow Gmail syntax strictly.
Use explicit -word notation (no {} grouping).
Multi-word phrases must be quoted.

5. Core Directives
Prioritize recall (hit count) if feedback.type == LOW_HIT_COUNT.
Decompose into multiple filters if too complex.
Strict Gmail syntax compliance.
`
  const system = `${system_prompt}\n${formatInstruction}`
  const message = `[エンジニア情報]\n${engineerInfo}\n[追加情報]\n${additionalCriteria}`
  const response = await openai.responses.parse({
    model: "gpt-4.1",
    input: [
      { role: "system", content: system },
      { role: "user", content: message }
    ],
    text: {
      format: zodTextFormat(filterResponseSchema,"filterResponseSchema")
    }
  });
  
  const content = response.output_parsed
  console.log(content?.filters)
  if (!content) throw new Error("No content returned from OpenAI");
  return content
}

export async function evaluateMatching(email: GmailThreadWithId, engineerInfo: string, additionalCriteria: string){
  const openai = await getOpenAI()
  const system_prompt =`
  # 案件・スキルマッチング判定プロンプト

## 役割
あなたは経験豊富なITプロジェクトマネージャーとして、案件の要求事項と人材のスキルシートを照合し、マッチング度を客観的に評価してください。

## 評価手順

### 1. 必須要件の確認
以下の観点で必須要件への適合度を確認してください：
- **技術スキル**: プログラミング言語、フレームワーク、データベース等
- **業務経験**: 業界・業種での実務経験年数
- **プロジェクト規模**: 担当したプロジェクトの規模や役割
- **資格・認定**: 必要な資格や認定の保有状況

### 2. 優遇要件の確認
以下の観点で優遇要件への適合度を確認してください：
- **追加技術スキル**: あると良い技術スキル
- **マネジメント経験**: チームリード、PM経験等
- **特殊スキル**: 特定の業務知識や専門性

### 3. 総合評価の実施

## 出力フォーマット

以下のJSON形式で結果を出力してください：

\`\`\`json
{
  "score": 85,
  "grade": "A",
  "required": {
    "score": 65,
    "max": 70,
    "items": [
      {"name": "Java", "req": "3年以上", "actual": "5年", "score": 10},
      {"name": "業務経験", "req": "金融3年", "actual": "金融4年", "score": 15}
    ]
  },
  "preferred": {
    "score": 20,
    "max": 30,
    "items": [
      {"name": "React", "req": "経験者", "actual": "2年", "score": 8}
    ]
  },
  "analysis": {
    "strengths": ["即戦力レベルの技術力", "豊富な業務経験"],
    "risks": ["一部技術の経験不足"],
    "actions": ["技術面接で確認", "研修計画策定"]
  }
}
\`\`\`

## 評価基準

### 点数配分の考え方
- **必須要件 (70点)**: プロジェクト遂行に最低限必要な要素
- **優遇要件 (30点)**: あればプラスとなる要素

### 各項目の評価基準
- **10点**: 要求を大幅に上回る
- **8-9点**: 要求を上回る
- **6-7点**: 要求を満たす
- **4-5点**: 要求をやや下回るが対応可能
- **1-3点**: 要求を大きく下回る
- **0点**: 要求を全く満たさない

## 注意事項
- 案件情報が案件紹介とは無関係の場合、0点をつけてください。
- 客観的事実に基づいて評価してください
- 推測や憶測は避け、提供された情報のみを使用してください
- 不明な点がある場合は「情報不足」として明記してください
- バイアスを排除し、公平な評価を心がけてください
- **必ず上記のJSON形式で出力してください**
- JSON形式が正しく解析できるよう、構文エラーがないことを確認してください
- 文字列値にダブルクォートが含まれる場合は適切にエスケープしてください

## JSON出力時の補足説明

### final_gradeの値
- "A": 80点以上（高適合 - 即戦力として活用可能）
- "B": 60-79点（適合 - 軽微な補強で対応可能）
- "C": 40-59点（要検討 - 相当な支援や研修が必要）
- "D": 40点未満（不適合 - 案件要件に対して経験・スキル不足）

### 各評価項目のスコア基準
- 10点: 要求を大幅に上回る
- 8-9点: 要求を上回る
- 6-7点: 要求を満たす
- 4-5点: 要求をやや下回るが対応可能
- 1-3点: 要求を大きく下回る
- 0点: 要求を全く満たさない
  `
  const message =`
**案件情報:**
案件名：${email.subject}
${email.body}

**エンジニア情報:**

**スキルシート:**
${engineerInfo}
`
  const response = await openai.responses.parse({
    model: "gpt-4.1-nano",
    input: [
      { role: "system", content: system_prompt },
      { role: "user", content: message }
    ],
    text: {
      format: zodTextFormat(gradingSchema,"gradingSchema")
    }
  });
  
  const content = response.output_parsed
  if (!content) throw new Error("No content returned from OpenAI");
  return {...email,...content} as GmailThreadWithGrading
}

export async function searchGmail(filter: string, days: number, pageSize: number){
  const authToken = process.env.GAS_API_KEY?.trim() ?? ""
  const url = process.env.GAS_API_URL ?? ""
  const dateInput = new Date()
  dateInput.setDate(dateInput.getDate() - days)

  let index = 0
  const allResults: any[] = []
  const maxRetry = 50
  let retry = 0
  while(true){
    retry++
    if(retry > maxRetry) break;
    try{
    const res = await axios.post(url, {
      "auth_token": `Bearer ${authToken}`,
      "filter_string": filter,
      "dateInput": dateInput.toISOString(),
      "start_num": index,
      "page_size": pageSize
    }, {
      headers: {
        "Content-Type": "application/json",
      }
    })
    
    if (res.status !== 200) {
      console.error(`Gmail search failed: ${res.status} ${res.statusText} ${res.data}`)
      break;
    }

    const response = res.data
    
    console.log(response)

    if (response.statudCode == 404) {
      break;
    }
    
    if (response.statudCode == 500) {
      console.error(`Gmail search failed: ${response.statudCode} ${response.data}`)
      break;
    }
    
    if (!response.data || response.data.length === 0) {
      break
    }
    
    allResults.push(...response.data)
    index += pageSize
    
    if (response.data.length < pageSize) {
      break
    }
    }catch(e){{
      console.log(e)
      continue;
    }}
  }
  const result = allResults.filter( item => {
    try{
      gmailResponseSchema.parse(item)
      return true
    }catch(e){
      return false
    }
  }).map(item => {
    return {...item,date: new Date(item.date)}
  })
  return result as GmailThread[]
}

export type GmailThreadWithId = GmailThread & { id: number }

export function deduplicateGmailThreads(gmailThreads: GmailThread[]): GmailThread[] {
  return gmailThreads.filter((thread, index, arr) => {
    return !arr.slice(0, index).some(t => JSON.stringify(t) === JSON.stringify(thread))
  })
}

export function addIdToGmailThreads(gmailThreads: GmailThread[]): GmailThreadWithId[] {
  return gmailThreads.map((thread, index) => ({
    ...thread,
    id: index + 1
  }))
}

export const analyzeResult = async (emails: GmailThreadWithGrading[],engineerInfo: string) => {
    function stringifyEmail(emails: GmailThreadWithGrading[]){
      const arr = emails.map(item => `${item.subject}\n\n${item.body}\n`)
      return arr.join("\n")
    }

    const openai = await getOpenAI()
    const gradeA = emails.filter(item => item.grade === "A" ).slice(0,10)
    const gradeB = emails.filter(item => item.grade === "B" ).slice(0,10)
    const gradeC = emails.filter(item => item.grade === "C" ).slice(0,5)
    const system = `
# DeepResearch完了後のOverView出力プロンプト

## 役割
DeepResearchによる案件・スキルマッチング分析が完了した後、ユーザーに対して分析結果の要約と次のアクションを提案するプロフェッショナルなコンサルタントとして振る舞ってください。

## 出力構成

### 1. 冒頭の声がけ
以下の要素を含む温かく専門的な声がけを行ってください：
- 分析完了の報告
- ユーザーの時間への配慮
- 結果への期待感を高める表現
- 次のステップへの導入

### 2. エグゼクティブサマリー
- 分析対象のエンジニアプロフィール概要
- 評価した案件数とマッチング傾向
- 最適な案件タイプの特定

### 3. 重要な発見事項
以下の観点から上位3-5項目を簡潔にまとめてください：
- **最適マッチ案件**: A評価を獲得した案件とその理由
- **高ポテンシャル案件**: B評価だが成長機会のある案件
- **スキル活用分析**: エンジニアの強みが最も活かされる領域
- **成長機会**: スキル向上につながる案件の特徴

### 4. 推奨アクション
優先度順に具体的なアクションを提案：
- **最優先案件**: 即座にアプローチすべき案件
- **条件交渉**: 報酬や勤務条件の調整が必要な案件
- **スキル補強**: 参画前に習得すべき技術・知識
- **キャリア戦略**: 中長期的なスキル開発の方向性

## 出力形式

\`\`\`
## 🎯 DeepResearch分析が完了しました

[温かく専門的な声がけメッセージ]

---

### 📊 エグゼクティブサマリー
- **対象エンジニア**: [エンジニア名/ID] - [主要スキル概要]
- **推奨案件タイプ**: [最適な案件領域]

### 🔍 重要な発見事項

**🎯 最適マッチ案件**
- [案件名]: [マッチング理由・スコア]

**⭐ 高ポテンシャル案件** 
- [案件名]: [成長機会・将来性]

**💪 スキル活用分析**
- [強みスキル]: [活用できる案件タイプ]

**📈 成長機会**
- [学習できる技術/経験]: [該当案件]

**⚠️ 注意事項**
- [スキルギャップや条件面の課題]

### 🎯 推奨アクション

**🔥 最優先案件**
1. [案件名]: [アプローチ方法・理由]
2. [案件名]: [アプローチ方法・理由]

**💰 条件交渉**
1. [交渉すべき案件と条件]
2. [交渉すべき案件と条件]

**📚 スキル補強**
1. [習得すべき技術・期間]
2. [習得すべき技術・期間]

**🚀 キャリア戦略**
1. [中長期的なスキル開発方針]

### 🚀 次のステップ

[最優先案件への具体的なアプローチ方法とタイムライン]

---

💡 **追加サポート**: 特定案件の詳細分析や、スキル補強のための学習ロードマップ作成も可能です。案件選択でお悩みの際は、お気軽にご相談ください。
\`\`\`

## 出力時の注意点

### トーン・スタイル
- **プロフェッショナルかつ親しみやすい**: 専門性を保ちながら堅すぎない
- **行動指向**: 具体的で実行可能な提案
- **ポジティブ**: 課題も建設的な表現で

### 内容の質
- **データドリブン**: 分析結果に基づいた客観的な評価
- **実用性重視**: すぐに活用できる情報を優先
- **バランス**: 良い面と改善点の両方を公平に提示

### 表現の工夫
- **視覚的な整理**: 絵文字やマークダウンを活用
- **スキャン可能**: 重要な情報が一目で分かる構成
- **簡潔性**: 冗長な説明を避け、要点を明確に

## カスタマイズ指示

以下の変数を実際の分析結果に置き換えて出力してください：
- \`[温かく専門的な声がけメッセージ]\`: エンジニアのキャリア支援の文脈での声がけ
- \`[エンジニア名/ID]\`: 対象エンジニアの識別情報
- \`[主要スキル概要]\`: エンジニアの中核となる技術スキル
- \`[案件名]\`: 実際の案件情報
- \`[マッチング理由・スコア]\`: 具体的な適合理由
- \`[成長機会・将来性]\`: キャリア発展の観点
- \`[習得すべき技術・期間]\`: 具体的なスキル開発計画`

  const message = `
  [エンジニア情報]
  ${engineerInfo}

  [A評価(上位5件)]
  ${stringifyEmail(gradeA)}

  [B評価(上位5件)]
  ${stringifyEmail(gradeB)}
  
  [C評価(上位5件)]
  ${stringifyEmail(gradeC)}
  `
  const stream = await openai.responses.create({
    input: [
      { role: "system", content: system},
      { role: "user", content: message }],
    model: "gpt-4.1-nano",
    stream: true,
  });
  return stream
};