"use server"
import "server-only"
import OpenAI from "openai";
import z from "zod"
import { schema } from "./model"

type generatEmailProps = {
    emailTemplate: string;
    engineerInfo: string;
    projectContent: string; 
    prompt: string;
};

type editEmailProps = {
    emailContent: string;
    editInstructions: string;
};

const openai = new OpenAI({
  apiKey: process.env.OPENAI_API_KEY,
});

export const generateEmail = async ({emailTemplate, engineerInfo, projectContent, prompt}: generatEmailProps) => {
  const context = `メールのテンプレート:\n${emailTemplate}\n要員情報:\n${engineerInfo}\n案件内容:\n${projectContent}`  
  const message = prompt + '\n' + context
  const response = await openai.chat.completions.create({
    messages: [{ role: "user", content: message}],
    model: "gpt-5-mini",
  });
  return response.choices[0].message.content;
};

export const editEmail = async ({emailContent, editInstructions}: editEmailProps) => {
  const message = `編集指示に従ったメール本文を修正してください。\nメール本文:\n${emailContent}\n編集指示:\n${editInstructions}`
  const response = await openai.chat.completions.create({
    messages: [{ role: "user", content: message }],
    model: "gpt-5-mini",
  });
  return response.choices[0].message.content;
};

export async function generateGmailFilter(prompt: string, engineerInfo: string, additionalCriteria: string){
  const companyEmailDomain = '@oneness-group.jp'
  const formatInstruction = `
# 出力フォーマット (JSON)
code JSON
{
  "summary": {
    "experience_level": "(候補者の経験レベルを文字列で記述)",
    "core_skills": [
      "(抽出したコア技術1)",
      "(抽出したコア技術2)",
      "(抽出したコア技術3)",
      ...
    ],
    "strengths": "(候補者の強みを簡潔な文章で記述)"
  },
  "filters": [
    {
      "pattern_name": "【(戦略名)特化】フィルター",
      "filter_string": "from:(-(${companyEmailDomain})) (キーワード群) (キーワード群) -{除外キーワード群}",
      "description": "(このフィルターがどのような目的で、なぜこのキーワードを選んだのかを簡潔に説明)",
      "expected_results": [
        "(このフィルターで見つかる案件の具体例1)",
        "(このフィルターで見つかる案件の具体例2)"
      ]
    },...
  ],
  "usage_recommendation": "まずは最もバランスの取れた「(パターン名)」からお試しいただくのがおすすめです。より専門的な案件を探したい場合は「(パターン名)」を、視野を広げたい場合は「(パターン名)」をご利用ください。"
}
  `
  const system = `${prompt}\n${formatInstruction}`
  const message = `[エンジニア情報]\n${engineerInfo}\n[追加情報]\n${additionalCriteria}`
  const response = await openai.chat.completions.create({
    messages: [
      { role: "system", content: system },
      { role: "user", content: message }
    ],
    model: "gpt-5-mini",
    response_format: {
      type: "json_schema",
      json_schema: {
        name: "gmail_filter_response",
        schema: {
          type: "object",
          properties: {
            summary: {
              type: "object",
              properties: {
                experience_level: { type: "string" },
                core_skills: { type: "array", items: { type: "string" } },
                strengths: { type: "string" }
              },
              required: ["experience_level", "core_skills", "strengths"]
            },
            filters: {
              type: "array",
              items: {
                type: "object",
                properties: {
                  pattern_name: { type: "string" },
                  filter_string: { type: "string" },
                  description: { type: "string" },
                  expected_results: { type: "array", items: { type: "string" } }
                },
                required: ["pattern_name", "filter_string", "description", "expected_results"]
              }
            },
            usage_recommendation: { type: "string" }
          },
          required: ["summary", "filters", "usage_recommendation"]
        }
      }
    }
  });
  
  const content = response.choices[0].message.content;
  if (!content) throw new Error("No content returned from OpenAI");
  
  const parsed = JSON.parse(content);
  return schema.parse(parsed);
}