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

export async function getOpenAI(){
 return new OpenAI({
  apiKey: process.env.OPENAI_API_KEY,
});
}

export async function getGemini(){
  return new OpenAI({
  baseURL: "https://generativelanguage.googleapis.com/v1beta/openai/",
  apiKey: process.env.GEMINI_API_KEY,
})
}

export const generateEmail = async ({emailTemplate, engineerInfo, projectContent, prompt}: generatEmailProps) => {
  const openai = await getOpenAI()
  const context = `メールのテンプレート:\n${emailTemplate}\n要員情報:\n${engineerInfo}\n案件内容:\n${projectContent}`  
  const message = prompt + '\n' + context
  const response = await openai.chat.completions.create({
    messages: [{ role: "user", content: message}],
    model: "gpt-4.1-mini",
  });
  return response.choices[0].message.content;
};

export const editEmail = async ({emailContent, editInstructions}: editEmailProps) => {
  const openai = await getOpenAI()
  const message = `編集指示に従ったメール本文を修正してください。\nメール本文:\n${emailContent}\n編集指示:\n${editInstructions}`
  const response = await openai.chat.completions.create({
    messages: [{ role: "user", content: message }],
    model: "gpt-4.1-mini",
  });
  return response.choices[0].message.content;
};

export async function generateGmailFilter(prompt: string, engineerInfo: string, additionalCriteria: string, history?: string){
  const gemini = await getGemini()
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
    },...
  ],
}
  `
  const system = `${prompt}\n${formatInstruction}`
  const message = `[エンジニア情報]\n${engineerInfo}\n[追加情報]\n${additionalCriteria}`
  const response = await gemini.chat.completions.create({
    model: "gemini-2.5-flash",
    messages: [
      { role: "system", content: system },
      { role: "user", content: message }
    ],
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
                },
                required: ["pattern_name", "filter_string", "description"]
              }
            },
          },
          required: ["summary", "filters"]
        }
      }
    }
  });
  
  const content = response.choices[0].message.content;
  if (!content) throw new Error("No content returned from OpenAI");
  
  const parsed = JSON.parse(content);
  return schema.parse(parsed);
}

export async function convertPDFtoMD(base64String : string, fileName: string){
  const openai = await getOpenAI()
  const response = await openai.responses.create({
    model: "gpt-4.1-mini",
    input: [
        {
            role: "user",
            content: [
                {
                    type: "input_file",
                    filename: fileName,
                    file_data: `data:application/pdf;base64,${base64String}`,
                },
                {
                    type: "input_text",
                    text: "Markdown形式にしてください。文字化けは直してください。",
                },
            ],
        },
    ],
});
return response.output_text
}