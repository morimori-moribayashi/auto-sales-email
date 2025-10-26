
export const emailGenerationDefaultPrompt = `
以下のプロンプトに従ってメールを作成してください。

このプロンプトは、貴社から他社へ人材提案メールを作成するためのガイドです。必要情報をもとに、簡潔かつ丁寧な構成でメールを作成し、提案人材の魅力を的確に伝えることを目的とします。
■ 使用する主な情報
案件情報（案件名、概要、スキル要件、期間、場所、条件など）
宛先情報（会社名、担当者名）
提案人材情報（スキルシート内容、補足情報）
■ メール構成ガイド
【宛名・挨拶】
宛先企業名＋担当者名（例：〇〇株式会社 〇〇様）
挨拶と自己紹介（例：お世話になっております。〇〇株式会社の〇〇です。）
【案件名の明記・提案の主旨】
例：「貴社よりご提示いただきました『〇〇〇〇』の案件につきまして、弊社エンジニアをご提案申し上げます。」
【提案要員の要約（箇条書き）】
氏名（フリガナ）、性別、年齢
最寄駅／稼働開始時期／所属
単金（スキル見合い or 上限に近い金額）
資格／面談可能日時
【アピールポイント（汎用テンプレート）】
関連する技術領域（開発・インフラ・運用保守など）での実務経験あり
案件で想定される使用環境・工程・技術スタックへの対応経験あり
課題解決に向けた提案・実行・改善のサイクルを実践している
新しい技術や業務への適応力が高く、チームとの連携もスムーズ
※読みやすさと簡潔さを重視する場合は、箇条書き＋一文ずつの短文化を基本とし、全体で400〜600字程度を目安にしてください。目を引く情報から順に配置し、冗長な表現や重複表現は削ぎ落とします。
※より具体性を出したい場合は、下記のような応用例を活用：
顧客折衝から設計・構築・保守まで対応
複数クラウドやツールの実務経験（AWS/GCP等）
アジャイル／ウォーターフォールいずれの体制にも対応
【添付資料の案内】
「スキルシートを添付いたしますので、ご確認ください。」など
【今後の希望・お願い】
「ご検討のうえ、面談の機会をいただけましたら幸いです。」
【結び】
丁寧なビジネスメールとして締めの挨拶（例：「何卒よろしくお願い申し上げます。」）
■ 実用テンプレート（簡潔構成の例文）
〇〇株式会社
〇〇様
お世話になっております。〇〇株式会社の【氏名】です。
貴社よりご提示いただきました「【案件名】」の件につきまして、弊社エンジニアをご提案いたします。添付のスキルシートをご確認ください。
【ご提案要員】
・氏名：〇〇（フリガナ）／性別・年齢
・最寄駅：〇〇
・稼働開始：即日または〇月〇日（応相談）
・所属：自社正社員／パートナーなど
・単金：〇〇万円（スキル見合いで応相談）
・資格：〇〇〇〇
・面談可能日時：〇〇、〇〇
【アピールポイント】
関連領域での実務経験あり
技術環境・工程への対応実績あり
チーム内外との連携・報告・調整にも強みあり
適応力・習得スピードに優れ、早期立ち上がり可能
何卒よろしくお願い申し上げます。
■ 留意事項
案件の制約（商流、契約形態、国籍条件など）には必ず準拠する
単価は案件条件と人材スキルの両面から判断し、過不足ない提示を
過度な誇張や抽象表現は避け、信頼を損ねない誠実な表現で
改行や箇条書きを用いて、視認性と読みやすさを重視

### 出力形式
メール本文のみ
`

export const emailGenerationDefaultTemplate = `
[会社名]
[担当者名]様

お世話になっております。
◯◯株式会社の◯◯です。

貴社にご提示いただきました[案件名]の案件につきまして、
弊社エンジニアのスキルシートを添付いたしましたので、ご提案させていただきます。

____________________________________________________________

【要員】
【最寄】
【稼働】
【所属】
【単金】
【資格】(Optional)
【面談】
____________________________________________________________

[要員名]は、以下の点で貴社案件に貢献できるかと存じます。


詳細につきましては、添付のスキルシートをご確認ください。
ご検討いただけますようお願い申し上げます。
面談の機会をいただけましたら幸いです。

今後とも、どうぞよろしくお願い申し上げます。
`

export const gmailFilterDefaultPrompt = `
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
Output inside \`\`\` code block, plain text only.

5. Core Directives
Prioritize recall (hit count) if feedback.type == LOW_HIT_COUNT.
Decompose into multiple filters if too complex.
Strict Gmail syntax compliance.`