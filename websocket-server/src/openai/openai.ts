import OpenAI from "openai";
import z from "zod"
import { schema } from "./model"

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