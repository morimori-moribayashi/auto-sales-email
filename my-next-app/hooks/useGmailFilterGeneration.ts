import { ConnectingAirportsOutlined } from "@mui/icons-material";
import { useState } from "react";

type streamResponseChunk = {
    type: "content" | "final_content",
    content: string
}

export function useGmailFilterGeneration(){
    const [filterContent,setFilterContent] = useState("");
    const [engineerInfo, setEngineerInfo] = useState("");
    const [additionalCriteria, setAdditionalCriteria] = useState("");
    const [prompt, setPrompt] = useState("");
    const [loading, setLoading] = useState(false);

    async function parseMailContent(response : Response){
        const decoder = new TextDecoder();
        for await(const chunk of response.body as any){
            const chunkText = decoder.decode(chunk);
            try{
                JSON.parse(chunkText)
            }
            catch(e){
                continue
            }
            const content = JSON.parse(chunkText) as streamResponseChunk;
            switch(content.type){
                case "content":
                    setFilterContent(content.content)
                    break;
                case "final_content":
                    setFilterContent(content.content)
                    break;
            }
        }
    }

    async function generateGmailFilter(){
        setLoading(true)
        setFilterContent("")
        const formData: FormData = new FormData();
        formData.append("engineerInfo", engineerInfo);
        formData.append("system_prompt", prompt);
        formData.append("additional_criteria", additionalCriteria);

        try {
            const response = await fetch("/api/generate/gmailfilter", {
                method: "POST",
                body: formData,
            });
            await parseMailContent(response)
        }
        catch(e){
            console.error(e)
        }
        finally{
            setLoading(false)
        }
    }
    return {
        filterContent,
        setFilterContent,
        engineerInfo,
        setEngineerInfo,
        additionalCriteria,
        setAdditionalCriteria,
        prompt,
        setPrompt,
        loading,
        generateGmailFilter,
    }
}