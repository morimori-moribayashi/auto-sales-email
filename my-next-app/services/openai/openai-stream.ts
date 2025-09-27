"use server"
import "server-only"
import { getOpenAI } from "./openai";
import { Stream } from "openai/streaming";
import { ResponseStreamEvent } from "openai/resources/responses/responses.js";

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

export const generateEmail = async ({emailTemplate, engineerInfo, projectContent, prompt}: generatEmailProps) => {
  const openai = await getOpenAI()
  const context = `メールのテンプレート:\n${emailTemplate}\n要員情報:\n${engineerInfo}\n案件内容:\n${projectContent}`  
  const message = prompt + '\n' + context
  const stream = await openai.responses.create({
    input: [{ role: "user", content: message}],
    model: "gpt-4.1-mini",
    stream: true,
  });
return await makeReadableStreamResponse(stream)
};

export const editEmail = async ({emailContent, editInstructions}: editEmailProps) => {
    const openai = await getOpenAI()
  const message = `編集指示に従ったメール本文を修正してください。\nメール本文:\n${emailContent}\n編集指示:\n${editInstructions}`
  const stream = await openai.responses.create({
    input: [{ role: "user", content: message }],
    model: "gpt-4.1-mini",
    stream: true,
  });
  return await makeReadableStreamResponse(stream)
};

async function makeReadableStreamResponse(stream : Stream<ResponseStreamEvent>) {
  return new ReadableStream({
    async start(controller) {
        function makeResponse(type: string, content: string){
            return JSON.stringify( {type, content})
        }

        let content = "";
        for await (const event of stream) {
          switch(event.type){
              case "response.output_text.delta":
                  content += event.delta
                  controller.enqueue(makeResponse("content", content));
                  break;
              case "response.completed":
                  const output = event.response.output[0];
                  if(output.type == "message" && output.content[0].type == "output_text"){
                    content = output.content[0].text
                  }
                  controller.enqueue(makeResponse("final_content", content));
                  controller.close();
                  break;
              case "error":
                  controller.error(event.message);
                  break;
          }
        }
    }})
}