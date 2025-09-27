import { ConnectingAirportsOutlined } from "@mui/icons-material";
import { useState } from "react";

type streamResponseChunk = {
    type: "content" | "final_content",
    content: string
}

export function useEmailGeneration(){
    const [mailContent,setMailContent] = useState("");
    const [engineerInfo, setEngineerInfo] = useState("");
    const [projectContent, setProjectContent] = useState("");
    const [editInstructions, setEditInstructions] = useState("");
    const [emailTemplate, setEmailTemplate] = useState("");
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
                    setMailContent(content.content)
                    break;
                case "final_content":
                    setMailContent(content.content)
                    break;
            }
        }
    }

    async function generateEmail(pjInfo? :string){
        setLoading(true)
        setMailContent("")
        const formData: FormData = new FormData();
        formData.append("project_info", pjInfo ?? projectContent);
        formData.append("engineerInfo", engineerInfo);
        formData.append("email_template", emailTemplate);
        formData.append("system_prompt", prompt);

        try {
            const response = await fetch("/api/generate/email", {
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
    async function editEmail(){
        setLoading(true)
        const formData: FormData = new FormData();
        formData.append("mail_content", mailContent);
        formData.append("edit_instructions", editInstructions);

        try {
            const response = await fetch("/api/generate/editemail", {
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
        mailContent,
        setMailContent,
        engineerInfo,
        setEngineerInfo,
        projectContent,
        setProjectContent,
        editInstructions,
        setEditInstructions,
        emailTemplate,
        setEmailTemplate,
        prompt,
        setPrompt,
        loading,
        generateEmail,
        editEmail
    }
}