import { GmailThreadWithGrading } from "@/services/deep-research/tools";
import { useState } from "react";

type IndicatorStatus = {
    status: "notStarted" | "inProgress" | "done"
}

function initIndicatorStatus(size : number){
    let arr: IndicatorStatus[] = []
    for(let i=0 ; i<size ;i++){
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

    function goToNextStep(){
        const currentStep = indicatorsStatus.findIndex( item => item.status == "inProgress")
        setIndicatorsStatus( indicatorsStatus.map( (item ,index) => {
            if(index == currentStep) return {status: "done"}
            if(index == currentStep+1) return {status: "inProgress"}
            return item
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
                case "content":
                    break;
                case "final_content":
                    break;
            }
        }
    }

    async function execDeepResearch(){
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
}