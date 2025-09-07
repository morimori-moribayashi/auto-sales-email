"use server"
import "server-only"
import OpenAI from "openai";

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