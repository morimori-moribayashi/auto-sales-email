import { GmailThreadWithGrading } from "@/services/deep-research/tools";
import { useState } from "react";

type IndicatorStatus = {
    status: "notStarted" | "inProgress" | "done"
}

function initIndicatorStatus(size : number){
    let arr: IndicatorStatus[] = []
    arr[0] = { status: "inProgress"}
    for(let i=1 ; i<size ;i++){
        arr[i] = { status: "notStarted"}
    }
    return arr;
}

export function useProjectDeepResearch(){
    const steps = 4;
    const [engineerInfo,setEngineerInfo] = useState("");
    const [additionalCriteria,setAdditionalCriteria] = useState("")
    const [loading,setLoading] = useState(false)
    const [emails,setEmails] = useState<GmailThreadWithGrading[]>()
    const [indicatorsStatus,setIndicatorsStatus] = useState<IndicatorStatus[]>(initIndicatorStatus(steps))
    const [analysisContent,setAnalysisContent] = useState("")
    const [analysisDialogOpen,setAnalysisDialogOpen] = useState(false)

    function goToNextStep(){
        setIndicatorsStatus(prevStatus => prevStatus.map((item, index) => {
            if(index == 0) return { status: "done" }
            return prevStatus[index-1]
        }))
    }

    async function parseStreamContent(response : Response){
        const decoder = new TextDecoder();
        for await(const chunk of response.body as any){
            const chunkText = decoder.decode(chunk);
            try{
                JSON.parse(chunkText)
            }
            catch(e){
                continue
            }
            const content = JSON.parse(chunkText);
            switch(content.type){
                case "plan":
                    break;
                case "make_query":
                    goToNextStep()
                    break;
                case "search":
                    goToNextStep()
                    break;
                case "evaluate":
                    goToNextStep()
                    break;
                case "analyze":
                    setAnalysisDialogOpen(true)
                    setLoading(false)
                    try{
                        const emailRes = JSON.parse(content.content)
                        console.log(emailRes)
                        setEmails(emailRes)
                    }catch(e){
                        console.error(e)
                    }
                    break;
                case "content":
                    setAnalysisContent(content.content)
                    break;
                case "final_content":
                    setAnalysisContent(content.content)
                    break;
            }
        }
    }

    async function execDeepResearch(){
        setAnalysisDialogOpen(false)
        setIndicatorsStatus(initIndicatorStatus(steps))
        setLoading(true) 
        const formData: FormData = new FormData();
        formData.append("engineerInfo", engineerInfo);
        formData.append("additional_criteria", additionalCriteria);

        try {
            const response = await fetch("/api/deepresearch/projects", {
                method: "POST",
                body: formData,
            });
            await parseStreamContent(response)
        }
        catch(e){
            console.error(e)
        }
        finally{
            setLoading(false)
        }
    }

    return {
        engineerInfo,
        setEngineerInfo,
        additionalCriteria,
        setAdditionalCriteria,
        loading,
        setLoading,
        emails,
        setEmails,
        indicatorsStatus,
        setIndicatorsStatus,
        analysisContent,
        setAnalysisContent,
        analysisDialogOpen,
        setAnalysisDialogOpen,
        execDeepResearch,
    }
}